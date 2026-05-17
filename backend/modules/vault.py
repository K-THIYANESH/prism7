import datetime
import hashlib
import json
import os
import sqlite3

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(PROJECT_ROOT, "database", "evidence.db")

class EvidenceVault:
    def __init__(self):
        self.ensure_table_exists()

    def ensure_table_exists(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chain_of_custody (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT NOT NULL,
                evidence_id TEXT NOT NULL,
                action TEXT NOT NULL,
                operator TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                file_hash TEXT,
                notes TEXT,
                previous_block_hash TEXT
            )
        ''')
        conn.commit()
        conn.close()

    def calculate_block_hash(self, entry_data):
        """Calculates a verifiable SHA256 hash for a vault entry."""
        # Remove previous_block_hash from data temporarily for hashing if it exists
        data_to_hash = entry_data.copy()
        block_content = json.dumps(data_to_hash, sort_keys=True)
        return hashlib.sha256(block_content.encode()).hexdigest()

    def get_last_block_hash(self, case_id):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT notes FROM chain_of_custody 
            WHERE case_id = ? AND action != 'GENESIS'
            ORDER BY id DESC LIMIT 1
        ''', (case_id,))
        result = cursor.fetchone()
        conn.close()
        # Extract BH from notes if we stored it there, or use a default
        if result and "BH:" in result[0]:
            return result[0].split("BH:")[1].strip()
        return "GENESIS_START"

    def add_entry(self, case_id, evidence_id, action, operator, file_hash=None, notes=""):
        timestamp = datetime.datetime.now().isoformat()
        previous_hash = self.get_last_block_hash(case_id)
        
        entry_data = {
            "case_id": case_id,
            "evidence_id": evidence_id,
            "action": action,
            "operator": operator,
            "timestamp": timestamp,
            "file_hash": file_hash,
            "prev": previous_hash
        }
        
        # Calculate current block hash
        block_hash = self.calculate_block_hash(entry_data)
        
        # Store block hash in notes for verification
        final_notes = f"{notes} | BH: {block_hash}"
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO chain_of_custody (case_id, evidence_id, action, operator, timestamp, file_hash, notes, previous_block_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (case_id, evidence_id, action, operator, timestamp, file_hash, final_notes, previous_hash))
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "message": "Chain of Custody updated",
            "block_hash": block_hash,
            "entry": entry_data
        }

    def get_chain(self, case_id):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, timestamp, action, operator, evidence_id, file_hash, notes, previous_block_hash
            FROM chain_of_custody
            WHERE case_id = ?
            ORDER BY timestamp DESC
        ''', (case_id,))
        rows = cursor.fetchall()
        conn.close()
        
        chain = []
        for row in rows:
            chain.append({
                "id": row[0],
                "timestamp": row[1],
                "action": row[2],
                "operator": row[3],
                "evidence_id": row[4],
                "file_hash": row[5],
                "notes": row[6],
                "previous_block_hash": row[7]
            })
            
        return chain

vault_manager = EvidenceVault()
