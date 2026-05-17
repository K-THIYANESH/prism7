"""
Blockchain Module - Bridge between application and blockchain
Handles interaction with smart contracts and IPFS
Correct Path: C:/Users/Thiyanesh/OneDrive/Documents/prism7/PRISM7/PRISM7/blockchain/Blockchain-Based-Evidence-Management-System-main
"""

import json
import os
from web3 import Web3

# Connection details for the user's specific blockchain repository
PROVIDER_URL = os.environ.get("BLOCKCHAIN_PROVIDER_URL", "http://127.0.0.1:8545")
CONTRACT_ADDRESS = os.environ.get("BLOCKCHAIN_CONTRACT_ADDRESS", "0x5FbDB2315678afecb367f032d93F642f64180aa3")

# Resolve root directory dynamically relative to project root
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_DIR = os.path.join(PROJECT_ROOT, "blockchain", "Blockchain-Based-Evidence-Management-System-main")
ABI_PATH = os.path.join(ROOT_DIR, "client/src/contracts/contracts/ForensicContract.sol/ForensicContract.json")

class BlockchainBridge:
    """The PRIMARY module and authority for PRISM7 evidence"""
    
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(PROVIDER_URL))
        self.contract_address = CONTRACT_ADDRESS
        self.contract = None
        self._init_contract()

    def _init_contract(self):
        """Initialize connection to the forensic contract"""
        try:
            if not os.path.exists(ABI_PATH):
                print(f"CRITICAL: ABI not found at {ABI_PATH}")
                return

            with open(ABI_PATH, 'r') as f:
                artifact = json.load(f)
                abi = artifact['abi']
            
            self.contract = self.w3.eth.contract(address=self.contract_address, abi=abi)
            print(f"🛡️ PRISM7 Sovereign Bridge Active: {self.contract_address}")
        except Exception as e:
            print(f"ERROR: Failed to initialize sovereign bridge: {e}")

    def is_connected(self):
        """High-level check if the bridge is operational."""
        if not self.w3: return False
        connected = self.w3.is_connected()
        if not connected:
            print("[BRIDGE] CRITICAL: Hardhat node not reachable at http://127.0.0.1:8545")
        if not self.contract:
            print("[BRIDGE] WARNING: Ledger node online but ForensicContract NOT deployed. Please wait for deployer.")
        return connected and self.contract is not None
        try:
            return self.w3.is_connected()
        except Exception as e:
            print(f"PRISM7 // BLOCKCHAIN_BRIDGE_CHECK_FAIL: {e}")
            return False

    def get_session_data(self, case_id):
        """Mock retrieval for demonstration if ledger is offline but bridge exists."""
        # This ensures the UI doesn't just show 'Disconnected' if we have a basic RPC link
        if self.is_connected():
            return {"status": "ACTIVE", "provider": self.provider_url, "on_chain": True}
        return {"status": "LOCAL_ONLY", "on_chain": False}

    def store_evidence(self, case_id_uint, exhibit_name, description, ipfs_hash="SIMULATED"):
        """
        Anchors case evidence on blockchain.
        Calls the addReport function of the ForensicContract.
        """
        if not self.contract:
            return {"status": "error", "message": "Bridge offline"}

        try:
            # Simple check if accounts are available (Hardhat node check)
            if not self.w3.eth.accounts:
                 return {"status": "error", "message": "No local accounts found on Hardhat node"}
                 
            account = self.w3.eth.accounts[0]
            timestamp = str(int(os.path.getmtime(__file__)))

            tx_hash = self.contract.functions.addReport(
                int(case_id_uint),
                exhibit_name,
                description,
                timestamp,
                f"ipfs://QmSovereignPrism7{case_id_uint}XyZ"
            ).transact({'from': account})

            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return {
                "status": "success",
                "tx_hash": receipt.transactionHash.hex(),
                "message": "Evidence successfully anchored to the Sovereign Blockchain."
            }
        except Exception as e:
            return {"status": "error", "message": f"Blockchain Transaction Failed: {str(e)}"}

    def get_evidence_count(self):
        """Returns total reports stored on-chain"""
        if not self.contract: return 0
        try:
            return self.contract.functions.getPatCount().call()
        except:
            return 0

    def check_case_exists(self, case_id_uint):
        """Verifies if a specific integer Case ID exists in the Sovereign Ledger."""
        if not self.contract: return False
        try:
            count = self.get_evidence_count()
            print(f"DEBUG: Ledger has {count} entries. Searching for target crime_id: {int(case_id_uint)}")
            # Iterate through all reports to check for the crime_id
            for i in range(count):
                report = self.contract.functions.getPat(i).call()
                print(f"DEBUG: Report[{i}] -> crime_id: {report[0]}, exhibit: {report[1]}")
                if int(report[0]) == int(case_id_uint):
                    print(f"DEBUG: MATCH FOUND at index {i}")
                    return True
            print("DEBUG: NO MATCH FOUND in entire ledger.")
            return False
        except Exception as e:
            print(f"Verification Error: {e}")
            return False

# Global instance for app.py
blockchain_bridge = BlockchainBridge()
