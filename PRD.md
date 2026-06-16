# 📄 Product Requirements Document (PRD)

## 1. Product Overview
**Name:** RepoRoast
**Tagline:** Intelligence meets brutality. Your AI principal engineer.
**Vision:** To provide developers with brutally honest, highly actionable, and entertaining feedback on their GitHub repositories, bridging the gap between dry static analysis tools and senior-level human code reviews.

## 2. Problem Statement
Developers often suffer from "tunnel vision" when working on personal projects or managing open-source repositories. Standard linters (like ESLint or SonarQube) provide dry, mechanical feedback without architectural context. Developers need a tool that scrutinizes structural decisions, tech debt, and code quality with the critical, unfiltered lens of an experienced (and slightly cynical) Principal Engineer.

## 3. Target Audience
- **Junior/Mid-level Developers:** Looking to identify bad habits and improve their coding standards.
- **Open-Source Maintainers:** Seeking automated, high-level feedback on community contributions.
- **Senior Engineers/Tech Leads:** Looking for a quick, entertaining laugh while sanity-checking side projects.

## 4. Core Features & Requirements

### 4.1. Landing Page & URL Ingestion
- **Requirement:** A highly aesthetic, dark-themed, engaging landing page.
- **Functionality:** 
  - An input field to accept a valid public GitHub URL.
  - Client-side validation to ensure the URL format is correct (`https://github.com/owner/repo`).
  - Interactive "example" buttons (e.g., `facebook/react`) for quick testing.

### 4.2. Distraction-Free Loading Experience
- **Requirement:** A seamless transition state while the AI analyzes the repository.
- **Functionality:**
  - Upon submission, the global navigation and footer must completely unmount to provide a focused, distraction-free loading screen.
  - Display dynamic status indicators (e.g., "Analyzing Codebase...").
  - Handle potential timeout or network errors gracefully, returning the user to the home page with an error toast.

### 4.3. The AI "Roast" Engine (Backend)
- **Requirement:** Analyze the codebase and return structured JSON feedback.
- **Functionality:**
  - Ingest repository metadata (stars, forks, languages, open issues).
  - Generate an overall score (0-100).
  - Produce an `overallVerdict` and a snarky `seniorDevQuote`.
  - Categorize feedback into distinct pillars (Architecture, Security, Testing, Performance).
  - Provide a definitive `hiringVerdict` (e.g., "Do not hire" or "Strong Hire").

### 4.4. Results Dashboard
- **Requirement:** Present the complex AI analysis in a digestible, visually stunning dashboard.
- **Functionality:**
  - **Header:** Display repository metadata, stars, and language.
  - **Score Widget:** A prominent display of the overall architectural score.
  - **Categorized Cards:** Expandable/interactive cards showing critical issues, praises, and actionable suggestions per category.
  - **Action Bar:** A custom, localized floating navbar allowing the user to seamlessly "Roast Another" repository.

## 5. Technical Stack
- **Frontend Framework:** React (Vite)
- **Styling:** Tailwind CSS + Framer Motion (for micro-animations and page transitions)
- **State Management:** React Context API (e.g., `LayoutContext` for global UI orchestration)
- **Testing:** Playwright (for End-to-End local UI verification)
- **Deployment:** Vercel

## 6. Future Roadmap (Full-Stack Expansion)
> [!TIP]
> **Phase 2 Objectives:**
> 1. **Global Leaderboards:** Integrate a PostgreSQL database (e.g., Supabase) to save scores and rank the world's worst (and best) codebases globally.
> 2. **User Authentication:** Add Clerk or Auth0 so users can claim their repositories, save past roasts, and track score improvements over time.
> 3. **GitHub PR Bot:** Create a GitHub App integration that automatically drops a brutal roast as a comment whenever a developer opens a new Pull Request.
