import sqlite3
import os

DB_FOLDER = "database"
DB_NAME = "evidence.db"
DB_PATH = os.path.join(DB_FOLDER, DB_NAME)

def init_db():
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create evidence table
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
    
    print(f"Database initialized at {DB_PATH}")
    print("Table 'evidence' created/verified.")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
