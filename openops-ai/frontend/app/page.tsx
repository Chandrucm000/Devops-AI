"use client";
import { ChangeEvent, FormEvent, useState } from "react";

type Project = { id: string; name: string };
type ChatMessage = { role: "user" | "assistant"; text: string; suggestions?: string[] };

const API_BASE = "http://localhost:8000/api";

const QUICK_ACTIONS = [
  { icon: "🏗", label: "Explain Repository", capability: "explain_repository", prompt: "Explain this project." },
  { icon: "🔐", label: "Security Review", capability: "security_review", prompt: "Run a security review on this repository." },
  { icon: "🚀", label: "CI/CD Review", capability: "cicd_review", prompt: "Review the CI/CD setup in this repository." },
  { icon: "📦", label: "Terraform Review", capability: "terraform_review", prompt: "Review the Terraform code in this repository." },
  { icon: "🐳", label: "Docker Review", capability: "docker_review", prompt: "Review the Docker setup in this repository." },
  { icon: "☸", label: "Kubernetes Review", capability: "kubernetes_review", prompt: "Review the Kubernetes manifests in this repository." },
  { icon: "📖", label: "Generate README", capability: "generate_readme", prompt: "Generate a README for this repository." },
  { icon: "💰", label: "Estimate Cost", capability: "estimate_cost", prompt: "Estimate the cloud cost of this repository." },
];

export default function Home() {
  const [project, setProject] = useState<Project | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (!file.name.toLowerCase().endsWith(".zip")) { setUploadError("Please select a ZIP archive."); return; }
    setUploading(true);
    const body = new FormData(); body.append("file", file);
    try {
      const response = await fetch(`${API_BASE}/projects/upload`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Upload failed.");
      setProject(result);
      setConversation([]);
    } catch (reason) { setUploadError(reason instanceof Error ? reason.message : "Upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  }

  async function ask(text: string, capability: string) {
    if (!text.trim() || sending) return;
    setChatError("");
    setSending(true);
    setConversation((prev) => [...prev, { role: "user", text }]);
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, mode: "no_integration", capability }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Request failed.");
      setConversation((prev) => [...prev, { role: "assistant", text: result.answer, suggestions: result.suggestions }]);
    } catch (reason) {
      setChatError(reason instanceof Error ? reason.message : "Request failed.");
    } finally {
      setSending(false);
    }
  }

  function handleSend(event: FormEvent) {
    event.preventDefault();
    const text = message;
    setMessage("");
    ask(text, "general_question");
  }

  function handleQuickAction(prompt: string, capability: string) {
    ask(prompt, capability);
  }

  return (
    <main className="app">
      <header className="top">
        <div className="brand">OpenOps <span>AI</span></div>
      </header>

      <section className="card">
        <h2>📂 Upload Repository</h2>
        <div className="upload-row">
          <label className="btn">
            <input type="file" accept=".zip,application/zip" onChange={upload} disabled={uploading} />
            {uploading ? "Extracting…" : "Choose ZIP"}
          </label>
          {project && <span className="repo-name">Repository: <strong>{project.name}</strong></span>}
        </div>
        {uploadError && <p className="error">{uploadError}</p>}
      </section>

      <section className="card">
        <h2>💬 Ask anything about your repository</h2>
        <form onSubmit={handleSend}>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Explain this project..."
            disabled={!project || sending}
          />
          <div className="send-row">
            <button type="submit" className="primary" disabled={!project || sending || !message.trim()}>
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
        {!project && <p className="hint">Upload a repository to start asking questions.</p>}
        {chatError && <p className="error">{chatError}</p>}

        {conversation.length > 0 && (
          <div className="conversation">
            {conversation.map((entry, index) => (
              <div key={index} className={`bubble ${entry.role}`}>
                {entry.text}
                {entry.suggestions && (
                  <div className="suggestions">
                    {entry.suggestions.map((suggestion) => <span key={suggestion} className="chip">{suggestion}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Quick Actions</h2>
        <div className="quick-list">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.capability}
              className="quick-btn"
              disabled={!project || sending}
              onClick={() => handleQuickAction(action.prompt, action.capability)}
            >
              <span className="icon">{action.icon}</span>{action.label}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
