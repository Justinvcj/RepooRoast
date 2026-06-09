<div align="center">
  <h1>🤖 RepoRoast: AI Code Review System</h1>
  <p>A full-stack, AI-powered platform integrating the Gemini API to analyze repositories, evaluate code quality, and provide contextual architectural insights.</p>

  <!-- TECH STACK BADGES -->
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini API"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
</div>

<br/>

## 📖 Overview
Standard static code analyzers often lack a contextual understanding of complex business logic, while manual peer code reviews are heavily time-consuming and prone to human error. **RepoRoast** solves this by bridging the gap between raw syntax validation and high-level architectural intent. 

By integrating Google's Gemini Large Language Model, RepoRoast dynamically parses repositories and provides intelligent, human-readable insights directly on the frontend.

## ✨ Key Features
- **🧠 Automated AI Code Reviews:** Leverages the Gemini API to evaluate code quality, suggest structural best practices, and point out optimization areas.
- **📂 Multi-File Parsing Engine:** A sophisticated backend parser capable of handling complex repository structures to extract critical configuration details efficiently.
- **⚡ Token Optimization Logic:** Intelligently filters out unnecessary boilerplate code before sending it to the LLM, ensuring the system remains efficient and strictly within API token limits.
- **💻 Responsive UI:** A fast, interactive frontend interface built with React that cleanly displays complex code structure insights.

## 🏗️ Architecture Workflow
```text
[ React Frontend ] --> (Repo URL / Files) --> [ Node.js Backend ]
                                                     |
                                                     V
[ Token Optimization Engine ] <--- (Multi-File Parser)
         |
         V
[ Gemini API (LLM) ] ---> (Contextual Code Review) ---> [ React Frontend Display ]
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Justinvcj/RepooRoast.git
   ```
2. Install dependencies (for both frontend and backend):
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set your environment variables in `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   PORT=5000
   ```
4. Start the application:
   ```bash
   # Run the backend
   cd backend && npm run start

   # In a new terminal, run the frontend
   cd frontend && npm run dev
   ```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
