import os
import json
import datetime
import sqlite3
import hashlib
import shutil

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(PROJECT_ROOT, "database", "evidence.db")
EVIDENCE_STORAGE = os.path.join(PROJECT_ROOT, "evidence_storage")

def calculate_hash(filepath):
    """Calculate SHA256 hash of a file for forensic integrity."""
    try:
        sha256_hash = hashlib.sha256()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                sha256_hash.update(chunk)
        return sha256_hash.hexdigest()
    except Exception as e:
        print(f"Hashing Error: {e}")
        return "ERROR_HASHING"

def save_to_db(case_id, filename, filepath, file_hash):
    """Save evidence metadata to SQLite."""
    try:
        # Ensure directory exists just in case
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Create table if it doesn't exist (safety check)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS evidence (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT NOT NULL,
                filename TEXT NOT NULL,
                filepath TEXT NOT NULL,
                hash TEXT,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute("INSERT INTO evidence (case_id, filename, filepath, hash, timestamp) VALUES (?, ?, ?, ?, ?)",
                       (case_id, filename, filepath, file_hash, datetime.datetime.now().isoformat()))
        conn.commit()
        conn.close()
        print(f"Saved evidence {filename} to DB for Case {case_id}")
    except Exception as e:
        print(f"DB Error: {e}")

def parse_log_file(filepath):
    """
    Parse a generic log file into structured events.
    Each line is treated as a log entry with timestamp + message.
    """
    events = []
    try:
        with open(filepath, "r", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                # Example: "2026-02-07 10:15:23 - User logged in"
                parts = line.split(" - ", 1)
                if len(parts) == 2:
                    timestamp_str, message = parts
                    try:
                        timestamp = datetime.datetime.fromisoformat(timestamp_str)
                    except ValueError:
                        timestamp = None
                    events.append({
                        "timestamp": timestamp_str if timestamp else "Unknown",
                        "message": message
                    })
                else:
                    events.append({"timestamp": "Unknown", "message": line})
    except Exception as e:
        return [{"error": str(e)}]
    return events


def parse_file_metadata(filepath):
    """
    Extract basic metadata from a file.
    """
    try:
        stats = os.stat(filepath)
        metadata = {
            "filename": os.path.basename(filepath),
            "size_bytes": stats.st_size,
            "created": datetime.datetime.fromtimestamp(stats.st_ctime).isoformat(),
            "modified": datetime.datetime.fromtimestamp(stats.st_mtime).isoformat()
        }
        return metadata
    except Exception as e:
        return {"error": str(e)}


def parse_evidence(filepath, case_id=None):
    """
    Decide whether to parse as log or just extract metadata.
    Also saves to DB if case_id is provided.
    """
    result = {}
    if filepath.endswith(".log") or filepath.endswith(".txt"):
        result = {"type": "log", "events": parse_log_file(filepath)}
    else:
        result = {"type": "file", "metadata": parse_file_metadata(filepath)}
    
    # Auto-save to DB for timeline if case_id is present
    if case_id:
        file_hash = calculate_hash(filepath)
        filename = os.path.basename(filepath)
        save_to_db(case_id, filename, filepath, file_hash)
        
        result.update({'hash': file_hash})
        
        # Copy to evidence storage for search module
        try:
            case_storage = os.path.join(EVIDENCE_STORAGE, case_id)
            os.makedirs(case_storage, exist_ok=True)
            dest_path = os.path.join(case_storage, filename)
            shutil.copy2(filepath, dest_path)
            result.update({'storage_status': f"Copied to {case_storage}"})
        except Exception as e:
            result.update({'storage_error': str(e)})

        result.update({'db_status': "Saved to Evidence DB"})
        
    return result