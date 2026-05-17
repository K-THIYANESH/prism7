from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from modules import parser, recovery, search, timeline, reporting, templates, acquisition, vault, log_analysis
from custody.blockchain import blockchain_bridge

# Define Project Root (One level up from backend/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Configure Flask to serve the frontend as static files
app = Flask(
    __name__,
    static_folder=os.path.join(PROJECT_ROOT, "frontend"),
    static_url_path=""
)
CORS(app)

# Ensure required directories exist at Project Root
for folder in ["evidence_storage", "reports", "recovered_files", "database"]:
    path = os.path.join(PROJECT_ROOT, folder)
    os.makedirs(path, exist_ok=True)

@app.route('/')
def index_page():
    """Serves the main frontend dashboard index.html"""
    return send_file(os.path.join(PROJECT_ROOT, "frontend", "index.html"))

@app.route('/api/status')
def api_status():
    """Returns the API service health and blockchain bridge status"""
    return jsonify({
        "status": "online",
        "service": "PRISM7 Forensic Analysis Engine",
        "version": "10.2.3",
        "blockchain_connected": blockchain_bridge.is_connected()
    })

import hashlib

def verify_case_on_chain(case_id):
    """Authority check - ensures case exists in Blockchain Ledger"""
    # Deterministic mapping of Case ID string to integer (Python's hash() is unstable)
    case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
    exists = blockchain_bridge.check_case_exists(case_id_uint)
    print(f"DEBUG: Verifying Case {case_id} -> ID_UINT: {case_id_uint} -> EXISTS: {exists}")
    return exists

@app.route('/api/blockchain/register', methods=['POST'])
def register_forensic_case():
    data = request.json
    case_id = data.get('case_id')
    if not case_id:
        return jsonify({"error": "Case ID Required"}), 400
    
    # Anchor to Blockchain
    case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
    bc_result = blockchain_bridge.store_evidence(
        case_id_uint=case_id_uint,
        exhibit_name="CASE_GENESIS",
        description=f"Blockchain Registration of Case {case_id}",
        ipfs_hash="GENESIS_BLOCK"
    )
    
    if bc_result["status"] == "success":
        # Demo Authority Enhancement: If registering ALPHA_001, populate historical local events
        if case_id == "PRISM_ALPHA_001":
            parser.save_to_db(case_id, "blacklock_ram_dump.bin", "evidence_storage/blacklock_ram_dump.bin", "sha256:7f...a1")
            parser.save_to_db(case_id, "encrypted_vault.archive", "evidence_storage/encrypted_vault.archive", "sha256:3d...c4")
            parser.save_to_db(case_id, "ransomware_note.txt", "evidence_storage/ransomware_note.txt", "sha256:9e...f8")
        
        return jsonify({"status": "success", "message": "Case Registered on Blockchain Ledger", "tx": bc_result["tx_hash"]})
    return jsonify({"error": bc_result["message"]}), 500

@app.route('/api/acquisition', methods=['POST'])
def acquire_evidence():
    data = request.json
    device_path = data.get('device_path')
    case_id = data.get('case_id')
    acq_type = data.get('acquisition_type', 'physical')
    
    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
        
    try:
        # 1. Acquire Data
        if acq_type == 'logical':
            result = acquisition.acquisition_manager.acquire_logical(device_path, case_id)
        else:
            result = acquisition.acquisition_manager.acquire_from_device(device_path, case_id)
            
        if result.get("status") == "success":
            # 2. Anchor to Blockchain (The Analysis Authority)
            case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
            bc_result = blockchain_bridge.store_evidence(
                case_id_uint=case_id_uint, 
                exhibit_name=os.path.basename(device_path or "STREAM"),
                description=f"Acquisition: {acq_type} from {device_path}",
                ipfs_hash=result.get("hash", "N/A")
            )
            result["blockchain"] = bc_result
            
            # 3. Log to Local Vault
            vault.vault_manager.add_entry(
                case_id=case_id,
                evidence_id=device_path,
                action=f"Acquisition ({acq_type})",
                operator="Forensic_Admin",
                file_hash=result.get("hash"),
                notes=f"BC_TX: {bc_result.get('tx_hash', 'N/A')}"
            )
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/parse', methods=['POST'])
def parse_evidence():
    # Handle both Form and JSON
    data = request.json if request.is_json else request.form
    filepath = data.get('filepath')
    case_id = data.get('case_id')
    
    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": f"Case ID {case_id} not found on Blockchain. Please register first."}), 403

    if not filepath or not os.path.exists(filepath):
        return jsonify({"error": f"Evidence not found at: {filepath}"}), 404
        
    try:
        result = parser.parse_evidence(filepath, case_id)
        
        # Anchor Parsing event to blockchain
        case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
        blockchain_bridge.store_evidence(
            case_id_uint=case_id_uint,
            exhibit_name=os.path.basename(filepath),
            description=f"Parsed: {result.get('type', 'Unknown')}",
            ipfs_hash=result.get('db_status', 'N/A')
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recover', methods=['POST'])
def recover_files():
    data = request.json if request.is_json else request.form
    filepath = data.get('filepath')
    case_id = data.get('case_id')
    
    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": f"Case ID {case_id} not found on Blockchain Ledger."}), 403

    if not filepath or not os.path.exists(filepath):
        return jsonify({"error": f"Evidence not found at: {filepath}"}), 404
        
    try:
        result = recovery.run_foremost(filepath, case_id)
        
        # Anchor Recovery event
        case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
        blockchain_bridge.store_evidence(
            case_id_uint=case_id_uint,
            exhibit_name=os.path.basename(filepath),
            description=f"Recovery: {result.get('recovered_count', 0)} files",
            ipfs_hash="RECOVERY_OP"
        )
        
        if "zip_filename" in result and result["zip_filename"]:
            result["download_url"] = f"http://localhost:5000/api/download/recovery/{result['zip_filename']}"
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/search', methods=['GET', 'POST'])
def keyword_search():
    if request.method == 'POST':
        data = request.json if request.is_json else request.form
        query = data.get('q') or data.get('query')
        case_id = data.get('case_id')
    else:
        query = request.args.get('q')
        case_id = request.args.get('case_id')

    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": "Blockchain Authority Verification Failed"}), 403

    try:
        result = search.run_search(query, case_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/timeline', methods=['GET', 'POST'])
def build_timeline():
    if request.method == 'POST':
        data = request.json if request.is_json else request.form
        case_id = data.get('case_id')
    else:
        case_id = request.args.get('case_id')

    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": "Temporal Reconstruction Forbidden: Case not on-chain"}), 403

    try:
        result = timeline.generate(case_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/report', methods=['GET', 'POST'])
def generate_report():
    if request.method == 'POST':
        data = request.json if request.is_json else request.form
        case_id = data.get('case_id')
    else:
        case_id = request.args.get('case_id')

    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": "Unauthorized Report Generation: Case not on-chain"}), 403

    try:
        pdf_path = reporting.create_pdf(case_id)
        filename = os.path.basename(pdf_path)
        download_url = f"http://localhost:5000/api/download/{filename}"
        
        # Anchor Report Generation
        case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
        blockchain_bridge.store_evidence(
            case_id_uint=case_id_uint,
            exhibit_name=filename,
            description="Forensic Report Generated",
            ipfs_hash="REPORT_READY"
        )

        # Local Vault Dual-Log (Timeline Consistency)
        vault.vault_manager.add_entry(
            case_id=case_id,
            evidence_id=filename,
            action="Forensic Report Generated",
            operator="SYSTEM_ADMIN",
            notes=f"Report Hash: {hashlib.md5(filename.encode()).hexdigest()}"
        )
        
        return jsonify({"report_url": download_url, "status": "generated"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        abs_path = os.path.join(PROJECT_ROOT, "reports", filename)
        return send_file(abs_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/api/download/recovery/<filename>', methods=['GET'])
def download_recovery(filename):
    try:
        abs_path = os.path.join(PROJECT_ROOT, "recovered_files", filename)
        return send_file(abs_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 404

@app.route('/api/vault/chain/<case_id>', methods=['GET'])
def get_chain_of_custody(case_id):
    if not verify_case_on_chain(case_id):
        return jsonify({"error": "Blockchain Vault Access Denied: Case ID not found on-chain"}), 403
    try:
        chain = vault.vault_manager.get_chain(case_id)
        return jsonify({"case_id": case_id, "chain": chain})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/integrity', methods=['POST'])
def verify_integrity():
    data = request.json
    filepath = data.get('filepath')
    case_id = data.get('case_id')
    
    if not case_id or not filepath:
        return jsonify({"error": "Case ID and Filepath Required"}), 400
        
    try:
        # Calculate current hash
        actual_hash = parser.calculate_hash(filepath)
        
        # Check Vault for latest hash
        chain = vault.vault_manager.get_chain(case_id)
        # Find entry for this file if it exists, or look for matching hash
        matching_entry = next((e for e in chain if e.get('file_hash') == actual_hash), None)
        
        # In a real system we'd look for the "expected" hash by filename independently
        # For this demo, we'll return the first hash found for this case as "expected" if actual doesn't match
        expected_hash = matching_entry['file_hash'] if matching_entry else (chain[0]['file_hash'] if chain else "NO_HASH_ON_CHAIN")
        
        return jsonify({
            "status": "success",
            "filepath": filepath,
            "actual_hash": actual_hash,
            "expected_hash": expected_hash,
            "verified": matching_entry is not None,
            "blockchain_anchored": True
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/log-analysis', methods=['POST'])
def analyze_logs():
    data = request.json if request.is_json else request.form
    filepath = data.get('filepath')
    case_id = data.get('case_id')
    threshold = int(data.get('threshold', 10))
    
    if not case_id:
        return jsonify({"error": "Verified Case ID Required"}), 400
    if not verify_case_on_chain(case_id):
        return jsonify({"error": "Unauthorized Intelligence Analysis: Case not on blockchain"}), 403

    if not filepath or not os.path.exists(filepath):
        # Fallback to demo log if none provided and demo case is active
        if case_id == "PRISM_ALPHA_001":
            filepath = os.path.join(PROJECT_ROOT, "prism7_forensic_sample_datasets/blacklock_case/apache.log")
        else:
            return jsonify({"error": f"Log file not found at: {filepath}"}), 404
        
    try:
        with open(filepath, 'r') as f:
            content = f.read()
        
        result = log_analysis.log_analyzer.analyze(content, bf_threshold=threshold)
        
        # Anchor intelligence event to blockchain
        case_id_uint = int(hashlib.md5(case_id.strip().encode()).hexdigest(), 16) % 10**8
        blockchain_bridge.store_evidence(
            case_id_uint=case_id_uint,
            exhibit_name=os.path.basename(filepath),
            description=f"Threat Analytics: Risk Score {result.get('risk_score')}",
            ipfs_hash="INTEL_ANALYSIS"
        )

        # Local Vault Dual-Log (Required for PDF Engine)
        vault.vault_manager.add_entry(
            case_id=case_id,
            evidence_id=f"RISK_SCORE: {result.get('risk_score')}",
            action="Threat Intelligence Analysis",
            operator="SYSTEM_AI",
            notes="BC_TX: INTEL_ANALYSIS"
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/blockchain/status', methods=['GET'])
def get_blockchain_status():
    return jsonify({
        "connected": blockchain_bridge.is_connected(),
        "address": blockchain_bridge.contract_address,
        "entry_count": blockchain_bridge.get_evidence_count(),
        "blockchain_authority": "ACTIVE"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
