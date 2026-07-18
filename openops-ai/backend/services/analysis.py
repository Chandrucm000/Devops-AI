CAPABILITIES = {
    "explain_repository": "Explain Repository",
    "security_review": "Security Review",
    "cicd_review": "CI/CD Review",
    "terraform_review": "Terraform Review",
    "docker_review": "Docker Review",
    "kubernetes_review": "Kubernetes Review",
    "generate_readme": "Generate README",
    "estimate_cost": "Estimate Cost",
}


def analyse_request(mode: str, capability: str, message: str) -> dict:
    name = CAPABILITIES.get(capability, "OpenOps analysis")
    answer = (f"{name} is ready to review your repository.\n\nYour request: \"{message}\"\n\n"
              "This starter response is deterministic. Connect an LLM provider to return production analysis and actionable results.")
    suggestions = ["Ask a follow-up question", "Try another quick action", "Upload a different repository"]
    return {"answer": answer, "suggestions": suggestions}
