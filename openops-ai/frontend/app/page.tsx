"use client";
import { ChangeEvent, useState } from "react";

type TreeNode = { name: string; path: string; type: "file" | "directory"; children?: TreeNode[] };
type Project = { id: string; name: string; tree: TreeNode[] };

function Tree({ nodes }: { nodes: TreeNode[] }) {
  return <ul>{nodes.map((node) => <li key={node.path}><span>{node.type === "directory" ? "⌄" : "·"}</span>{node.name}{node.children && <Tree nodes={node.children} />}</li>)}</ul>;
}

export default function Home() {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.name.toLowerCase().endsWith(".zip")) { setError("Please select a ZIP archive."); return; }
    setUploading(true);
    const body = new FormData(); body.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/api/projects/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Upload failed.");
      setProject(result);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  }

  return <main><section className="hero"><div className="brand">OPENOPS <span>AI</span></div><span className="tag">PHASE 1 · REPOSITORY EXPLORER</span><h1>Upload any DevOps project.<br />Understand its structure.</h1><p>Start by uploading a ZIP archive. OpenOps extracts the repository, safely ignores generated files, and presents a clean project tree.</p><label className="upload"><input type="file" accept=".zip,application/zip" onChange={upload} disabled={uploading} /><strong>{uploading ? "Extracting project…" : "Choose ZIP archive"}</strong><small>Maximum size: 50 MB · .git, node_modules and .terraform are ignored</small></label>{error && <p className="error">{error}</p>}</section><aside><h2>{project ? project.name : "Project Explorer"}</h2>{project ? <Tree nodes={project.tree} /> : <div className="empty">Your uploaded repository structure will appear here.</div>}</aside></main>;
}
