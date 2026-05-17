import json
from modules import acquisition, parser, recovery, search, timeline, reporting

# Define investigation templates
TEMPLATES = {
    "ransomware": {
        "description": "Investigate ransomware attack with focus on logs, recovery, and timeline.",
        "modules": ["acquisition", "parser", "recovery", "timeline", "reporting"]
    },
    "phishing": {
        "description": "Investigate phishing case with emphasis on keyword search and reporting.",
        "modules": ["acquisition", "search", "timeline", "reporting"]
    },
    "insider_threat": {
        "description": "Investigate insider activity with focus on metadata, search, and reporting.",
        "modules": ["acquisition", "parser", "search", "timeline", "reporting"]
    }
}

def list_templates():
    return [{"name": k, "description": v["description"]} for k, v in TEMPLATES.items()]

def load_template(template_name):
    if template_name not in TEMPLATES:
        return {"error": "Template not found"}
    return TEMPLATES[template_name]