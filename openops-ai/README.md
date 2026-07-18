# OpenOps AI

OpenOps AI is a DevOps repository assistant. Phase 1 lets you upload a project ZIP and immediately inspect its extracted structure.

## Current capabilities

- ZIP repository upload (50 MB maximum)
- Safe archive extraction; path traversal is rejected
- Project tree display
- Generated/dependency folders ignored: `.git`, `node_modules`, `.terraform`, `venv`, `.venv`, and `__pycache__`

AI chat, embeddings, ChromaDB, Terraform insights, and GitHub imports are planned next.

## Run locally

```powershell
cd backend
pip install -r ../requirements.txt
uvicorn app:app --reload --port 8000
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The API runs on `http://localhost:8000`.
