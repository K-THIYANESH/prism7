import re
import os
from datetime import datetime
from collections import defaultdict

class LogAnalyzer:
    def __init__(self):
        # Common Log Format (Apache/Nginx/Standard)
        # 127.0.0.1 - - [12/Feb/2026:04:47:26 +0530] "GET /api/status HTTP/1.1" 200 123
        self.log_pattern = re.compile(
            r'(?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*?\[(?P<timestamp>.*?)\] "(?P<method>\w+) (?P<url>.*?) HTTP/.*?" (?P<status>\d+)'
        )
        
    def parse_logs(self, log_content):
        events = []
        for line in log_content.splitlines():
            match = self.log_pattern.search(line)
            if match:
                data = match.groupdict()
                try:
                    # Parse timestamp: 12/Feb/2026:04:47:26 +0530
                    ts_str = data['timestamp'].split(' ')[0]
                    dt = datetime.strptime(ts_str, '%d/%b/%Y:%H:%M:%S')
                    data['dt'] = dt
                    events.append(data)
                except Exception:
                    continue
        return events

    def analyze(self, log_content, bf_threshold=10, period=60):
        events = self.parse_logs(log_content)
        if not events:
            return {"error": "No valid log patterns detected."}

        # 1. Timeline Aggregation (attempts per minute)
        timeline_buckets = defaultdict(int)
        success_counts = defaultdict(int)
        failure_counts = defaultdict(int)
        ip_stats = defaultdict(lambda: {"total": 0, "failed": 0, "success": 0})
        
        for e in events:
            minute_str = e['dt'].strftime('%Y-%m-%d %H:%M')
            status = int(e['status'])
            ip = e['ip']
            
            timeline_buckets[minute_str] += 1
            ip_stats[ip]["total"] += 1
            
            if 200 <= status < 400:
                success_counts[minute_str] += 1
                ip_stats[ip]["success"] += 1
            else:
                failure_counts[minute_str] += 1
                ip_stats[ip]["failed"] += 1

        # 2. Detection Logic
        suspicious_events = []
        
        # Brute Force: Check windowed failures per IP
        # For simplicity in this demo, we check total failures per IP if they exceed threshold
        for ip, stats in ip_stats.items():
            if stats["failed"] >= 25: # Suspicious IP rule
                 suspicious_events.append({
                    "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    "ip": ip,
                    "event": "PERSISTENT_FAILURE_ZONE",
                    "severity": "HIGH",
                    "reason": f"Detected {stats['failed']} failed requests from single origin."
                })

        # Brute Force Bursts (10 failures in 60s bucket)
        for minute, count in failure_counts.items():
            if count >= bf_threshold:
                suspicious_events.append({
                    "timestamp": minute,
                    "ip": "MULTIPLE_ORIGINS",
                    "event": "BRUTE_FORCE_BURST",
                    "severity": "CRITICAL",
                    "reason": f"Massive spike ({count} failures) detected in 60s window."
                })

        # 3. Calculate Risk Score
        # Simple weighted score
        base_score = len(suspicious_events) * 15
        spike_multiplier = 1.0
        if any(c > 50 for c in timeline_buckets.values()): spike_multiplier = 1.5
        
        risk_score = min(100, int(base_score * spike_multiplier))

        # Prepare payload for Chart.js
        sorted_times = sorted(timeline_buckets.keys())
        
        return {
            "timeline": sorted_times,
            "total_attempts": [timeline_buckets[t] for t in sorted_times],
            "success_counts": [success_counts[t] for t in sorted_times],
            "failure_counts": [failure_counts[t] for t in sorted_times],
            "ip_stats": dict(sorted(ip_stats.items(), key=lambda x: x[1]['failed'], reverse=True)[:5]),
            "suspicious_events": suspicious_events,
            "risk_score": risk_score,
            "status": "success"
        }

log_analyzer = LogAnalyzer()
