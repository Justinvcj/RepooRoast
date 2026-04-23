# RepoRoast 🔥

**Your code reviewed by an AI Senior Developer — brutally honest, always free.**

RepoRoast is a modern web application that leverages the GitHub API and Google's Gemini Pro AI to perform comprehensive, constructive, and brutally honest code reviews of public repositories. Designed for a high-end User Experience with "Apple-like" premium glassmorphism aesthetics.

## Features

- **6-Category Deep Dive**: The AI analyzes Code Quality, Project Structure, Documentation, Security, Test Coverage, and Performance.
- **Brutally Honest Senior Dev Persona**: Get witty, direct feedback modeled after top-tier Principal Engineers.
- **Zero-Cost Architecture**: Built entirely using free-tiers (GitHub REST API, Google Gemini API).
- **Premium Glassmorphism UI**: Buttery smooth 60fps animations in React, using Framer Motion and custom SVG interactions.
- **Smart File Parsing**: The backend selectively pulls the most critical architecture files (Configs, entry points, core logic) without exhausting token limits.

## Architecture Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express, Google Generative AI (`gemini-1.5-flash`), Axios.

---

## Local Development Setup

To run RepoRoast locally, you need two terminal windows for the frontend and backend.

### 1. Backend Setup (Port 3001)
Navigate to the `server` directory, install dependencies, configure environment variables, and start the development server.

\`\`\`bash
cd server
npm install

# Create the environment file based on the example
cp .env.example .env
\`\`\`

**Configure your `.env` file:**
Open `server/.env` and add your [Google Gemini API Key](https://aistudio.google.com/app/apikey). 
You may also optionally add a GitHub Personal Access Token to prevent hitting rate limits during heavy testing.

\`\`\`bash
# Start the backend in development mode
npm run dev
\`\`\`

### 2. Frontend Setup (Port 5173)
Navigate to the `client` directory, install dependencies, and start the Vite frontend server. The proxy is already configured to route `/api` requests to `localhost:3001`.

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

Open your browser to `http://localhost:5173` and start roasting some code!

---

*Built with ❤️ for the Cartrabbit Technologies interview.*
