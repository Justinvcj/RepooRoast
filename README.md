<div align="center">
  <img src="https://raw.githubusercontent.com/Justinvcj/RepooRoast/main/client/public/logo.png" alt="RepooRoast Logo" width="200" />
  <h1>RepooRoast</h1>
  <p><strong>The Most Brutally Honest AI Code Reviewer on the Internet.</strong></p>
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-repooroast.vercel.app-blue?style=for-the-badge&logo=vercel)](https://repooroast.vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

<br />

**RepooRoast** is a next-generation static analysis and AI-driven code review platform. Unlike standard linters that complain about missing semicolons, RepooRoast acts as a cynical, highly-experienced Principal Engineer that tears down your architecture, analyzes your technical debt, and grades your project—all while roasting you in the process.

## 🚀 Live Demo
Experience the roast live at: **[https://repooroast.vercel.app](https://repooroast.vercel.app)**

---

## 🧠 The Architecture (What We Do Differently)

We didn't just wrap an OpenAI API call in a basic prompt. RepooRoast is built on a **Parallel, Context-Aware AI Pipeline** designed for speed, precision, and surgical accuracy.

### 1. Zero-Shot Context Classification (Step 0)
Standard AI reviewers judge every codebase the same. We don't. Before roasting begins, our `classifierService` performs a lightning-fast scan of the repo's file tree and `package.json` to classify the project type (e.g., *Personal Portfolio*, *CLI Tool*, *Production SaaS*). 

### 2. Context-Aware Severity Suppression
We dynamically inject a mathematical **Applicability Matrix** into the prompt. If the repo is classified as a "Personal Portfolio", the AI is explicitly instructed to suppress penalties for missing `SECURITY.md` files or CI/CD pipelines. This ensures the roast is fair, calibrated, and highly accurate.

### 3. Mathematical Anchor Grading
AI models are notoriously bad at grading, often inflating scores. We fixed this by injecting a strict **Anchor Grading Rubric** directly into the core AI context. The model can no longer hallucinate arbitrary scores; a `75` objectively requires specific architectural standards, and a `40` means it found massive security holes. Final category scores are then mathematically aggregated using a weighted average based on the repo classification.

### 4. Parallel LLM Chaining
Instead of sending one massive prompt that takes 30 seconds to resolve, we split the review into three distinct partitions:
- **Part 1:** Architecture & Documentation
- **Part 2:** Code Quality, Performance, Scalability
- **Part 3:** Security & Actionable Fixes

We fire all three requests simultaneously to parallel Gemini models. The partial JSON responses are then deeply merged on the server, dropping response times from ~25s to **~8s**.

### 5. Redis-Style Response Caching
To optimize token usage and bandwidth, the backend hashes incoming requests against the repository's exact `commitSha` (or PR head ref). If a repo hasn't been updated since its last roast, the cached response is served instantly in **~100ms**.

### 6. Aggressive Noise Pruning
We actively prune the GitHub file tree prior to sending it to the LLM. Massive auto-generated directories (`node_modules`, `.git`, `dist`) and lockfiles are systematically stripped away, preventing token bloat, OOM crashes, and AI hallucination.

---

## 🛡️ Fortified Security

We take API security and data integrity seriously. RepooRoast is locked down against common modern attack vectors:

- **Strict CORS Policies:** API access is locked exclusively to trusted frontend origins.
- **Prompt Injection Fences:** All untrusted user code (READMEs, source code) is wrapped in strict `<repository_data>` XML fences. Core behavioral override protections are placed *after* the payload to neutralize malicious "ignore previous instructions" attacks.
- **OOM (Out Of Memory) Protection:** Files larger than 50KB are mathematically excluded during the GitHub tree fetch using zero-budget metadata scanning, ensuring massive binaries can never crash the Node server.
- **Rate Limiting & Headers:** Hardened with `helmet` for HTTP headers and `express-rate-limit` (10 requests per 15 mins) to prevent API key exhaustion.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Justinvcj/RepooRoast.git
   cd RepooRoast
   \`\`\`

2. **Setup the Backend:**
   \`\`\`bash
   cd server
   npm install
   cp .env.example .env
   # Add your GEMINI_API_KEY to the .env file
   npm start
   \`\`\`

3. **Setup the Frontend:**
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`

### Testing
We use `vitest` for our backend unit tests, covering caching, regex pruning, JSON schema validation, and security fences.
\`\`\`bash
cd server
npm test
\`\`\`

---

## 📝 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
