# Contributing to RepooRoast

Thank you for your interest in contributing to RepooRoast! We welcome contributions to improve static analysis accuracy, expand AST parsing support, enhance the AI prompts, and refine the frontend experience.

## Getting Started

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/<your-username>/RepooRoast.git
   cd RepooRoast
   ```

2. **Install Dependencies:**
   ```bash
   # Install Server Dependencies
   cd server && npm install
   
   # Install Client Dependencies
   cd ../client && npm install
   ```

3. **Configure Environment:**
   ```bash
   cd ../server
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

4. **Run Tests:**
   Make sure existing unit tests pass before submitting a PR:
   ```bash
   cd server
   npm test
   ```

## Development Guidelines

- **AST Parsers:** All AST extraction rules should be deterministic and placed under `server/src/analyzers/`.
- **Prompts & Security:** Ensure untrusted repository data remains strictly fenced in `<repository_data>` and `<diff_data>` tags.
- **Pull Requests:** Open a concise PR detailing your changes, motivation, and test coverage.

## License
By contributing to RepooRoast, you agree that your contributions will be licensed under the MIT License.
