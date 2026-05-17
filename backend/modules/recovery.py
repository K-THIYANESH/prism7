import os
import time
import binascii
import zipfile

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RECOVERY_DIR = os.path.join(PROJECT_ROOT, "recovered_files")

# File signatures (Magic Numbers)
SIGNATURES = {
    'jpg': {'start': b'\xFF\xD8\xFF', 'end': b'\xFF\xD9'},
    'png': {'start': b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A', 'end': b'\x49\x45\x4E\x44\xAE\x42\x60\x82'},
    'pdf': {'start': b'%PDF-', 'end': b'%%EOF'},
    'prism7': {'start': b'PRISM7_CARVE_START', 'end': b'PRISM7_CARVE_END'},
}

def carve_files(filepath, output_dir):
    """
    Scans a file for specific byte signatures and extracts them.
    Returns a tuple of (recovered_files, carving_log).
    """
    recovered_files = []
    carving_log = [f"INITIATING_CARVE_SCAN on {os.path.basename(filepath)}"]
    
    # Get list of files to process
    files_to_process = []
    if os.path.isdir(filepath):
        for root, _, files in os.walk(filepath):
            for file in files:
                files_to_process.append(os.path.join(root, file))
    else:
        files_to_process = [filepath]

    for current_file in files_to_process:
        try:
            file_size = os.path.getsize(current_file)
            carving_log.append(f"ANALYZING_NODE: {os.path.basename(current_file)} ({file_size} bytes)")
            
            if file_size > 100 * 1024 * 1024:
                carving_log.append(f"SKIP_LARGE_BLOCK: {os.path.basename(current_file)}")
                continue

            with open(current_file, "rb") as f:
                content: bytes = f.read()
                
            for ext, sigs in SIGNATURES.items():
                start_sig = sigs['start']
                end_sig = sigs['end']
                
                start_index = 0
                while True:
                    start_index = content.find(start_sig, start_index)
                    if start_index == -1:
                        break
                    
                    carving_log.append(f"MATCH_FOUND: Signature {ext.upper()} at offset {hex(start_index)}")
                    
                    end_index = content.find(end_sig, start_index)
                    if end_index != -1:
                        end_index += len(end_sig)
                        file_data = content[start_index:end_index]
                        
                        filename = f"recovered_{len(recovered_files)}_{int(time.time())}.{ext}"
                        out_path = os.path.join(output_dir, filename)
                        
                        with open(out_path, "wb") as out_f:
                            out_f.write(file_data)
                        
                        recovered_files.append(out_path)
                        carving_log.append(f"RESTORED_ARTIFACT: {filename} ({len(file_data)} bytes)")
                        start_index = end_index
                    else:
                        start_index += 1
                        
        except Exception as e:
            carving_log.append(f"CARVE_ERROR on {os.path.basename(current_file)}: {str(e)}")
            continue

    carving_log.append(f"CARVE_PROTOCOL_COMPLETE: {len(recovered_files)} fragments restored.")
    return recovered_files, carving_log

def run_foremost(filepath, case_id):
    """
    Run native Python recovery to carve files from evidence.
    """
    timestamp = str(int(time.time()))
    safe_case_id = "".join(x for x in case_id if x.isalnum() or x in "-_")
    output_dir = os.path.join(RECOVERY_DIR, f"{safe_case_id}_{timestamp}")
    os.makedirs(output_dir, exist_ok=True)

    filepath = filepath.strip('"').strip("'")

    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Evidence file not found: {filepath}")

    try:
        recovered, logs = carve_files(filepath, output_dir)
        
        zip_filename = f"recovered_{safe_case_id}_{timestamp}.zip"
        zip_path = os.path.join(RECOVERY_DIR, zip_filename)
        
        recovered_basenames = []
        if recovered:
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for file in recovered:
                    basename = os.path.basename(file)
                    zipf.write(file, basename)
                    recovered_basenames.append(basename)
                    os.remove(file)
            
            try:
                os.rmdir(output_dir)
            except:
                pass

        message = f"Successfully recovered {len(recovered)} files."
        if os.path.isdir(filepath) and len(recovered) == 0:
            message = "Directory processed, but no files could be carved."

        return {
            "case_id": case_id,
            "filepath": filepath,
            "zip_filename": zip_filename if recovered else None,
            "recovered_count": len(recovered),
            "recovered_files": recovered_basenames,
            "carving_log": logs,
            "message": message
        }
    except Exception as e:
        return {
            "error": str(e),
            "message": f"Failed to run recovery on {filepath}."
        }
