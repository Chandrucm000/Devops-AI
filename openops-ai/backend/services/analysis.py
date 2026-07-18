OFFLINE_CAPABILITIES = {"code_analysis": "Code Analysis", "iac_generation": "Generate IaC", "interview_help": "Interview Help", "architecture_review": "Architecture Review"}
CONNECTED_CAPABILITIES = {"live_analysis": "Live Analysis", "root_cause": "Root Cause", "auto_remediation": "Auto Remediation", "cost_optimization": "Cost Optimization"}

def analyse_request(mode: str, capability: str, message: str) -> dict:
    capabilities = OFFLINE_CAPABILITIES if mode == "no_integration" else CONNECTED_CAPABILITIES
    name = capabilities.get(capability, "OpenOps analysis")
    scope = "the supplied code and context" if mode == "no_integration" else "connected infrastructure telemetry"
    answer = (f"{name} is ready to review {scope}. Your request: \"{message}\"\n\n"
              "This starter response is deterministic. Connect an LLM provider and the relevant cloud integrations to return production analysis and actionable results.")
    suggestions = ["Paste a service log", "Upload a Terraform file", "Ask for an architecture review"] if mode == "no_integration" else ["Check recent deployment changes", "Inspect affected resources", "Create a remediation plan"]
    return {"answer": answer, "suggestions": suggestions}
