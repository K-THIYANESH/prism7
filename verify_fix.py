from backend.modules.log_analysis import log_analyzer

# Actual sample logs from the user's environment
sample_logs = """203.10.1.8 - - [10/Feb/2025:12:31:02] "GET /login HTTP/1.1" 200
203.10.1.8 - - [10/Feb/2025:12:40:55] "POST /admin HTTP/1.1" 200
203.10.1.8 - - [10/Feb/2025:12:50:12] "GET /backup.zip HTTP/1.1" 200
"""

print("PRISM7 // VERIFYING_FIXED_LOG_PATTERN...")
result = log_analyzer.analyze(sample_logs)

if result.get("status") == "success":
    print(f"[OK] Intelligence extracted. Risk Score: {result['risk_score']}")
    print(f"[OK] Timeline Entries: {len(result['timeline'])}")
    print(f"[OK] Total Attempts: {sum(result['total_attempts'])}")
else:
    print(f"[FAIL] Error detected: {result.get('error')}")
