# RepoRoast 🔥

**RepoRoast** is a brutal, lightning-fast, AI-powered codebase auditor and pull request reviewer. It combines deterministic static code analysis with state-of-the-art LLM capabilities (Google Gemini) to instantly identify architectural flaws, security risks, anti-patterns, and code quality issues. 

Unlike standard "AI wrappers", RepoRoast uses an intelligent **Token Optimization Engine** and **Abstract Syntax Tree (AST) Parsing** to analyze entire repositories—up to hundreds of files—without exhausting AI context limits or breaking the bank.

![RepoRoast Demo UI](client/public/favicon.svg)

---

## 🌟 Key Features

1. **Zero-Budget OOM Protection & Smart Selection**: Intelligently skips binary files, massive blobs (>50KB), and lock files, preventing Out-of-Memory crashes and wasted bandwidth.
2. **Deterministic AST Static Analysis**: Locally parses JavaScript/TypeScript and Python to compute Lines of Code (LOC), Comment/Code ratios, Magic Numbers, and Architectural Hubs & Orphans before sending data to the AI.
3. **Advanced Token Allocation**: Uses `gpt-tokenizer` to accurately measure file sizes in tokens, automatically prioritizing core files (like `package.json` and `Dockerfile`) and dynamically allocating the remaining context budget.
4. **Incremental Pull Request (Diff) Review**: Supports pasting PR, compare, or commit URLs (e.g., `https://github.com/owner/repo/pull/1`) to run targeted, deep analysis on *just* the changed files.
5. **Interactive Architecture Dashboard**: A sleek, fluid web interface that visualizes code scores, dependency hubs, and critical security issues, complete with a generated "Auto-Fix Prompt" you can paste directly into an IDE.

---

## 🏗️ Architecture

RepoRoast is a full-stack web application consisting of a React-based frontend and an Express-based Node.js backend.

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Vite.
- **Backend**: Node.js, Express, Axios, Zod, Google Generative AI (`@google/generative-ai`).
- **Static Analysis**: Babel Parser (for JS/TS), Pyright-inspired regex fallback (for Python).
- **Testing**: Vitest with `@vitest/ui` HTML reporting.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or newer
- **GitHub Token**: (Optional but highly recommended) A personal access token to avoid GitHub API rate limits.
- **Google Gemini API Key**: Required for the LLM analysis. Get one from Google AI Studio.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Justinvcj/RepooRoast.git
   cd RepooRoast
   ```

2. **Setup the Backend Server:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   GITHUB_TOKEN=your_optional_github_token_here
   ```

3. **Setup the Frontend Client:**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application Locally

You need to run both the frontend and backend concurrently. 

**Start the Backend:**
```bash
cd server
npm start
# Server will start on http://localhost:5000
```

**Start the Frontend:**
```bash
cd client
npm run dev
# Frontend will start on http://localhost:5173
```

---

## 🧪 Testing (Production-Grade)

RepoRoast employs a robust, real-world testing strategy using **Vitest**. We don't just mock data; we execute live integration tests against the actual GitHub API to ensure the full analysis pipeline works end-to-end.

### Running Tests

Navigate to the `server` directory and run:

```bash
cd server
npm run test
```

### Viewing the HTML Test Report

We generate a beautiful, interactive HTML test report for all passed and failed suites. After running the tests, you can view the report via:

```bash
npx vite preview --outDir test-reports
```

*The report details AST parsing accuracy, Token Allocation algorithms, prompt injection security validation, and schema enforcement.*

---

## 🛡️ Security

RepoRoast is designed with strict boundaries to mitigate Prompt Injection. 
1. **Fencing**: Untrusted repository content and diff payloads are isolated using XML fences (e.g., `<repository_data>`).
2. **Instruction Precedence**: Critical system instructions and the `CRITICAL SECURITY RULE` are appended *after* the untrusted payload to reinforce AI containment.
3. **Validation**: All API endpoints use strict input sanitization via custom middleware and `zod` schema parsing for LLM outputs.

---

## 📜 License

This project is licensed under the MIT License.
