# 🔥 RepoRoast V2
> From a "pretty GPT wrapper" to "the only AI code reviewer with a brain of its own."

RepoRoast is a brutal, objective, and delightfully sarcastic AI code reviewer. Point it at any public GitHub repository, and it will rip through the source code using deterministic AST parsing (Tree-Sitter) combined with Google's Gemini models to deliver a pinpoint accurate, senior-level code review.

It doesn't just skim your README; it parses your dependency graphs, calculates your cyclomatic complexity, flags your "God Functions," and roasts you for them.

---

## ⚡ Key Features

- **Blazing Fast Static Analysis**: Uses `web-tree-sitter` (JS/TS, Python) to parse AST locally. Calculates cyclomatic complexity, deep callbacks, magic numbers, and code-to-comment ratios *before* hitting the LLM.
- **Deep Dependency Graphing**: Analyzes local import structures to identify architectural Hubs, disconnected Orphans, and dangerous Circular Dependencies.
- **Intelligent Token Budget System**: Uses PageRank-style file scoring (centrality, length efficiency, recency, file type) and `gpt-tokenizer` to proactively distribute an exact 30k token budget, guaranteeing zero context truncation or OOMs.
- **Incremental Diff-Aware Roasts**: Paste a GitHub Pull Request or `/compare` URL, and RepoRoast will dynamically fetch the raw patch diff, isolating its critique strictly to the changed lines.
- **Jailbreak Immunity**: Built for the real world. Repo data is strictly fenced in XML boundaries, and the prompt engine actively ignores malicious prompt-injection attempts hidden in untrusted codebase READMEs.
- **Automated Fix Prompts**: Generates a custom, highly-detailed prompt following the CRED framework that you can paste directly into Copilot or Cursor to automatically fix all the issues it found.

---

## 🏗️ Architecture

RepoRoast uses a React frontend and an Express/Node.js backend.

1. **Frontend**: React + Vite (hosted on Vercel). Captures the GitHub URL and streams the UI states.
2. **Backend**: Express API.
   - **GitHub Service**: Fetches repo metadata, directory trees, and raw file contents concurrently.
   - **Static Analyzer**: Runs Tree-Sitter WASM binaries to build an AST and extract hard metrics (LOC, functions, magic numbers).
   - **Prompt Builder**: Fuses the AST metrics with the raw code, capping tokens to prevent explosion.
   - **Gemini Service**: Sends the locked-down prompt to Google Gemini and parses the structured JSON response.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key
- A GitHub Personal Access Token (optional, but highly recommended to avoid rate limits)

### 1. Clone the Repository
```bash
git clone https://github.com/Justinvcj/RepooRoast.git
cd RepooRoast
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Running Tests & Viewing HTML Reports
To verify the system works (including live integration tests, AST static analysis validation, and security fence checks):
```bash
# Still inside the /server directory
npm run test:report
```
This will run the test suite and generate a beautiful interactive HTML report. You can view it by opening `server/test-reports/index.html` in your browser.

### 4. Frontend Setup
Open a new terminal window.
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:3001
```

Start the frontend server:
```bash
npm run dev
```

---

## 🔒 Security Posture

RepoRoast is hardened for production:
- **XML Fencing**: All untrusted GitHub data is wrapped in `<repository_data>` tags to prevent LLM Prompt Injection.
- **Payload Limits**: Express JSON parsers are strictly capped at 10kb to prevent DoS attacks.
- **CORS Lockdown**: Non-origin requests (like automated cURL scripts) are blocked in production.
- **Zero-Leak Error Handling**: Internal server errors and API keys are scrubbed from all HTTP responses.

---

## 🗺️ Roadmap (Phase 3)
- [ ] **Supabase Integration**: Global "Roast Scores" leaderboard and historical review storage.
- [ ] **GitHub OAuth**: User dashboards to track past roasts.
- [ ] **GitHub App Webhook**: Automated PR review bot that comments directly on pull requests.

---

**Disclaimer**: RepoRoast will hurt your feelings. Please do not submit repositories if you are emotionally attached to your `console.log` statements.
