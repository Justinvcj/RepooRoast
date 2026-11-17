# RepoRoast Front-End Redesign Progress Tracker (v3)

**Branch:** `redesign/v3`  
**Base Commit:** `de5199b` (`main`)  
**Status:** Phase 2 Complete — Ready for Phase 3  
**Current Next Step:** Begin Phase 3: Foundations & Tokens (tailwind.config.js, index.css, fonts, pre-React loader in index.html, retire Lightfall & ogl).

---

## 1. Quick Overview & Local Preview Instructions

This branch (`redesign/v3`) contains the complete front-end redesign and brand identity system for RepoRoast. All work is kept strictly local on this branch without merging, pushing, or deploying.

### Preview Locally
```bash
# In the client directory:
cd client
npm install
npm run dev
# Vite server runs at http://localhost:5173
```

---

## 2. Phase Checklist

| Phase | Description | Deliverables | Status |
|---|---|---|---|
| **Phase 0** | **Orient & Baseline Setup** | Inspect codebase, tests, create `client/REDESIGN_PROGRESS.md`, capture baseline screenshots in `client/design/before/` | **COMPLETE** |
| **Phase 1** | **Brand Direction & Specification** | Write `client/DESIGN.md` (concept, rejected directions, 60-30-10 palette, type system, motion rules) | **COMPLETE** |
| **Phase 2** | **Logo System & Animation** | Original geometric SVG mark, wordmark, lockup, favicon, 1.2–1.6s path animation, calm loop, standalone review page under `client/design/` | **COMPLETE** |
| **Phase 3** | **Foundations & Tokens** | Design tokens in `tailwind.config.js`, `index.css`, fonts, inline pre-React loader in `index.html`, retire `Lightfall` & `ogl` | PLANNED |
| **Phase 4** | **UI Primitives Library** | Button, Input, Switch, Surface/Card, Terminal Tag/Badge, Modal, Score Ring, Score Bar, Code display | PLANNED |
| **Phase 5** | **Screens & Dashboard Redesign** | Navbar, Footer, Splash, Home, Custom Mode Modal, Loading Screen, ResultPage, ScoreCard, ScoreChart, CategorySection, IssueCard, StaticAnalysisPanel, 404, Legal, Toasts, ErrorBoundary | PLANNED |
| **Phase 6** | **Motion System Polish** | Cohesive transitions, tokenized easing, reduced-motion fallbacks | PLANNED |
| **Phase 7** | **Review, Audits & Final Screenshots** | 60-30-10 audit, avoid list check, keyboard a11y, after screenshots in `client/design/after/`, verify build/lint/e2e | PLANNED |
| **Phase 8** | **Hand-off & Review Documentation** | Executive summary, local preview guide, test observation report | PLANNED |

---

## 3. Component & Screen Status Matrix

| Component / Screen | File Path | Baseline Status | Redesign Status | Verification Notes |
|---|---|---|---|---|
| **Splash Screen** | `client/src/components/SplashScreen.tsx` | Stock Lucide Flame, pulse scale | Phase 2 Complete (LogoLockup + 1.4s LogoAnimation) | 1600ms sync timer verified |
| **Global Navbar** | `client/src/components/Navbar.tsx` | Glass pill nav, stock typography | Pending Phase 5 | Baseline screenshot captured |
| **Result Navbar** | `client/src/pages/ResultPage.tsx` | Glass pill with "Roast Another" | Pending Phase 5 | Baseline screenshot captured |
| **Global Footer** | `client/src/components/Footer.tsx` | Basic footer with Lightfall credit | Pending Phase 5 | Baseline screenshot captured |
| **Home Hero** | `client/src/components/Hero.tsx` | Hero text + ReviewPreviewCard | Pending Phase 5 | Baseline screenshot captured |
| **URL Input & Validation** | `client/src/components/UrlInput.tsx` | Glow input with example repo chips | Pending Phase 5 | Baseline screenshot captured |
| **What We Roast (Features)** | `client/src/pages/HomePage.tsx` | 7-category icon grid | Pending Phase 5 | Baseline screenshot captured |
| **Custom Mode Modal** | `client/src/components/CustomModeModal.tsx` | BYOK modal with switch & API key input | Pending Phase 5 | Baseline screenshot captured |
| **Pipeline Loading Screen** | `client/src/components/LoadingScreen.tsx` | Pipeline stages & rotating quotes | Phase 2 Complete (Logo 2.4s calm respiration) | Replaced Lucide flame |
| **Review Dashboard** | `client/src/components/ReviewDashboard.tsx` | Staggered container for report | Pending Phase 5 | Baseline screenshot captured |
| **ScoreCard** | `client/src/components/ScoreCard.tsx` | Overall score ring & senior quote | Pending Phase 5 | Baseline screenshot captured |
| **ScoreChart** | `client/src/components/ScoreChart.tsx` | Recharts bar chart | Pending Phase 5 | Baseline screenshot captured |
| **CategorySection** | `client/src/components/CategorySection.tsx` | Collapsible cards with terminal tag | Pending Phase 5 | Baseline screenshot captured |
| **IssueCard** | `client/src/components/IssueCard.tsx` | Severity badges, code suggestions | Pending Phase 5 | Baseline screenshot captured |
| **StaticAnalysisPanel** | `client/src/components/StaticAnalysisPanel.tsx` | LOC, dependency hubs & orphans | Pending Phase 5 | Baseline screenshot captured |
| **Auto-Fix AI Prompt Block** | `client/src/components/ReviewDashboard.tsx` | Copyable CRED prompt | Pending Phase 5 | Baseline screenshot captured |
| **Privacy Policy Page** | `client/src/pages/PrivacyPage.tsx` | Content panel with back link | Pending Phase 5 | Baseline screenshot captured |
| **Terms of Service Page** | `client/src/pages/TermsPage.tsx` | Content panel with back link | Pending Phase 5 | Baseline screenshot captured |
| **404 Page** | `client/src/pages/NotFoundPage.tsx` | "Back to safety" link with Flame | Pending Phase 5 | Baseline screenshot captured |
| **Error Boundary** | `client/src/components/ErrorBoundary.tsx` | Fallback error card | Pending Phase 5 | Covered by tests |
| **Toasts** | `client/src/App.tsx` | react-hot-toast container | Pending Phase 5 | Baseline screenshot captured |
| **HTML Pre-React Loader** | `client/index.html` | Stock inline SVG flame pulse | Pending Phase 3 | Inspected |
| **Favicon & App Icon** | `client/public/favicon.svg` | Stock flame SVG | Phase 2 Complete (Integer 16px SVG & 512px icon) | Zero Lucide flame |
| **Design Review Page** | `client/design/` | Does not exist | Phase 2 Complete (/design route & logo-preview.html) | Interactive suite |

---

## 4. UI Primitives Matrix (Phase 4)

| Primitive | Target Path | Variants / Requirements | Status |
|---|---|---|---|
| **Button** | `client/src/components/ui/Button.tsx` | Primary, Secondary, Ghost, Icon (sm/md/lg) | Planned |
| **Input** | `client/src/components/ui/Input.tsx` | Form input with focus ring, error & disabled states | Planned |
| **Switch** | `client/src/components/ui/Switch.tsx` | Accessible toggle (`role="switch"`, keyboard operable) | Planned |
| **Surface / Card** | `client/src/components/ui/Surface.tsx` | Layered surface cards with hairline borders | Planned |
| **Terminal Tag / Badge**| `client/src/components/ui/Badge.tsx` | Monospace tags (`[TAG]`, `[CRITICAL]`) | Planned |
| **Modal Dialog** | `client/src/components/ui/Modal.tsx` | Accessible dialog with backdrop blur & focus trap | Planned |
| **Score Ring / Meter** | `client/src/components/ui/ScoreRing.tsx` | Animated circular SVG meter with tabular score | Planned |
| **Score Bar** | `client/src/components/ui/ScoreBar.tsx` | Horizontal score progress bar with tabular numbers | Planned |
| **Code Display** | `client/src/components/ui/CodeBlock.tsx` | Monospace code block with copy action | Planned |

---

## 5. Decisions Log

- **2026-11-17**: Created branch `redesign/v3` from `main` (`de5199b`).
- **2026-11-17**: Verified baseline client build (`npm run build`) succeeds cleanly with zero errors.
- **2026-11-17**: Verified baseline test suite (`npm run test:e2e`) passes 100% across all 9 tests.
- **2026-11-17**: Initialized `client/REDESIGN_PROGRESS.md` as single source of truth for resumable execution across all 8 phases.
- **2026-11-17**: Standardized baseline screenshot viewports to 375px (mobile, 375x812), 768px (tablet, 768x1024), and 1440px (desktop, 1440x900) across all 9 critical UI states.
- **2026-11-17**: Created automated baseline capture suite in `client/tests/capture-baseline.spec.ts` capturing 60 screenshot artifacts in `client/design/before/` with both pixel-suffix and bare-width aliases.
- **2026-11-17**: Verified full e2e test suite with baseline capture: 36 passed cleanly (38.2s).
- **2026-11-17**: Isolated baseline screenshot capture behind environment guard (`CAPTURE_BASELINE`) and added dedicated `npm run test:baseline` script with `cross-env`. Standard test suite (`npm run test:e2e`) now executes exclusively functional regression tests (9/9 passed, 27 baseline capture specs skipped) without side-effects, preserving committed baseline screenshots in `client/design/before/` across all future redesign phases.
- **2026-11-17**: Completed Phase 1 by authoring canonical design specification `client/DESIGN.md`: defined "The Thermal Observatory / Precision Caliper" dual-metaphor concept uniting Tree-Sitter AST telemetry with searing code roast; documented 3 directions and 1-line rejection rationales for the losing 2; codified 60-30-10 palette tokens with empirical WCAG AA contrast evaluations; established tabular numerals mandate; defined modular type scale (Plus Jakarta Sans + JetBrains Mono); formulated 6 Apple working design rules; codified strict anti-pattern avoid list; specified motion choreography (1.4s assembly and 2.4s calm respiration) with reduced-motion fallbacks; and formulated mathematical 32x32 master grid vectors, integer-snapped 16px favicon coordinates, and clear space rules.
- **2026-11-17**: Completed Phase 2 by implementing the original hand-authored geometric SVG logo system in `client/src/components/brand/` (`LogoMark.tsx`, `LogoWordmark.tsx`, `LogoLockup.tsx`, `LogoAnimation.tsx`, `Logo.tsx`, `index.ts`): built master 32x32 vector grid with 45-degree caliper chamfers, faceted ember core, single-color `fill-rule="evenodd"` cutout, and integer-snapped 16x16 vector path for `size <= 18`; implemented 1.4s Framer Motion assembly choreography and 2.4s calm thermal respiration looping variant with full `prefers-reduced-motion` fallbacks; replaced `client/public/favicon.svg` with dedicated 16x16 crisp integer-aligned SVG (zero Lucide flame, zero blur); authored `client/public/icon.svg` (maskable 512x512 app icon with 80% safe zone); authored `client/public/og-image.svg` (1200x630 Open Graph card with brand lockup, AST telemetry badges, and zero emoji); created offline static preview `client/design/logo-preview.html`; authored interactive studio review dashboard `client/src/pages/DesignReviewPage.tsx` routed to `/design` and `/design/logo` redirect in `client/src/App.tsx`; updated `client/src/components/SplashScreen.tsx` to use `LogoLockup` with 1.4s animation; synchronized splash screen timeout to 1600ms in `client/src/App.tsx`; updated `client/src/components/LoadingScreen.tsx` with calm 2.4s looping respiration logo; and verified 100% pass across build (`tsc -b && vite build`) and Playwright E2E suite (9/9 passed).

---

## 6. Next Step

**Next step:** Phase 1 brand design in `client/DESIGN.md`: articulate the brand concept (heat/roasting meets rigorous measurement/evidence), document rejected directions, define the 60-30-10 palette roles, select modular typography scales, establish motion principles, and specify the geometric logo system.
