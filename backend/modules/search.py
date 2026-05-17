import os

# Define Project Root (3 levels up from backend/modules/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run_search(query, case_id):
    """
    Search for a keyword in all evidence files for a given case.
    """
    case_folder = os.path.join(PROJECT_ROOT, "evidence_storage", case_id)
    results = []

    if not os.path.exists(case_folder):
        return {"error": "Case not found"}

    for root, dirs, files in os.walk(case_folder):
        for filename in files:
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, "r", errors="ignore") as f:
                    for line_num, line in enumerate(f, start=1):
                        if query.lower() in line.lower():
                            results.append({
                                "file": filename,
                                "line": line.strip(),
                                "line_number": line_num
                            })
            except Exception:
                continue

    return {
        "case_id": case_id,
        "query": query,
        "matches": results
    }