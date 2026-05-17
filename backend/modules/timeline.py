import os
import sqlite3
import datetime

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH = os.path.join(PROJECT_ROOT, "database", "evidence.db")

def generate(case_id):
    """
    Build a timeline of events for a given case.
    Combines evidence metadata + parsed logs.
    """
    events = []

    # Pull evidence metadata from DB
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT filename, hash, timestamp FROM evidence WHERE case_id=?", (case_id,))
    rows = cursor.fetchall()
    conn.close()

    for r in rows:
        events.append({
            "timestamp": r[2],
            "action": "EVIDENCE_ANCHORED",
            "details": f"File: {r[0]} | Hash: {r[1]}"
        })

    # Add Genesis event if entries exist
    if events:
        events.insert(0, {
            "timestamp": events[0]["timestamp"],
            "action": "CASE_GENESIS",
            "details": f"Forensic Identity Established for {case_id}"
        })

    # Example: Add parsed log events (future integration with parser module)
    # For now, placeholder: logs would be parsed and appended here
    # events.extend(parsed_log_events)

    # Sort events chronologically
    events.sort(key=lambda e: e["timestamp"])

    return {"case_id": case_id, "events": events}