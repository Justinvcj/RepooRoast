<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg" alt="Flame Logo" width="120" height="120" />
  
  # 🔥 RepoRoast

  **Intelligence meets brutality. The ultimate AI-powered code auditing tool.**

  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  <br />
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![Groq](https://img.shields.io/badge/Groq-Llama_3-f55036?style=for-the-badge&logo=ai)](https://groq.com/)
  [![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
</div>

<br />

## 📖 Overview
**RepoRoast** is a full-stack, AI-powered application built to thoroughly analyze, score, and brutally review GitHub repositories. Acting as a hyper-critical "Principal Engineer," it parses your repository's metadata and file structure, passes it through advanced LLMs, and returns an interactive, beautifully visualized code review.

Designed with a heavy focus on **premium UI/UX**, performance, and robust backend engineering.

## ✨ Core Features

- **🧠 Multi-Model AI Engine**: Powered by a custom `aiService` architecture allowing instant toggling between **Groq (Llama-3 70B)** for blazing fast execution and **Google Gemini (1.5/2.0 Flash)**.
- **📊 Dynamic Scorecard**: An animated, Apple-style interactive dashboard built with Framer Motion and custom SVG rendering.
- **📄 Export to PDF**: Programmatically intercepts the browser's print engine, flattens 3D DOM transformations, and injects CSS page breaks (`print:break-before-page`) to export your roasting sessions into neat, professional PDF reports.
- **💻 One-Click Auto-Fix Prompts**: The AI automatically synthesizes its review into a highly detailed **CRED Framework** prompt (Character, Role, Execute, Details) that developers can copy to their clipboard and paste into ChatGPT or Cursor to instantly fix their repository's flaws.
- **🎨 State-of-the-Art UX**: Features a dramatic heartbeat splash screen, seamless page transitions, glassmorphic layout design, and staggered loading animations.
- **🔒 Rate-Limited & Secure**: Backend integrates token reduction algorithms for Github's API, API request rate-limiting, and resilient fallback loops to handle 429/503 provider errors without crashing.

---

## 🏗️ Architecture

The application follows a modern decoupled client-server architecture:

### Frontend (`/client`)
- **Vite + React + TypeScript**: Lightning fast HMR and strict type-safety.
- **Tailwind CSS**: Custom `tailwind.config.js` with semantic color variables (`surface`, `border`, `textPrimary`) for easy dark-mode handling.
- **Framer Motion**: Handles complex orchestrated orchestrations (Splash Screen exit splashes, staggered list reveals, pulsing SVGs).

### Backend (`/server`)
- **Node.js + Express**: Handles RESTful API routing.
- **Service Layer Pattern**: Decouples logic into `githubService`, `geminiService`, `groqService`, and `aiService`.
- **Intelligent Prompt Builder**: A custom utility that takes raw Git Tree APIs, strips out non-essential binaries and `.git` folders to save LLM context windows, and formats the directory tree structurally.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A GitHub Classic PAT (Personal Access Token)
- A Groq API Key OR Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Justinvcj/RepooRoast.git
cd RepooRoast
```

### 2. Setup the Backend
```bash
cd server
npm install

# Rename the example env file
cp .env.example .env
```
*Fill in your keys in the new `server/.env` file. You can toggle between Groq and Gemini by changing `AI_PROVIDER`.*

```bash
# Start the backend server (runs on port 3001)
npm run dev
```

### 3. Setup the Frontend
```bash
# Open a new terminal
cd client
npm install

# Rename the example env file
cp .env.example .env

# Start the Vite development server
npm run dev
```

Your app will now be running on `http://localhost:5173`.

---

## 💡 Why I Built This
This project was engineered to demonstrate a complete, production-ready full-stack skill set. It highlights:
1. **Frontend Polish**: Proving an eye for high-quality, modern, animated UI/UX.
2. **Backend Architecture**: Implementing scalable service layers, dynamic module loading based on `.env` files, and integrating bleeding-edge AI SDKs.
3. **Problem Solving**: Handling LLM hallucination constraints by enforcing strict JSON object schemas in the prompts and writing resilient error-fallback loops for unstable third-party APIs.

---
<div align="center">
  <i>Built with frustration and clean code.</i>
</div>
