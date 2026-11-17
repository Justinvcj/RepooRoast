# RepoRoast Front-End Redesign Progress Tracker (v3)

**Branch:** `redesign/v3`  
**Base Commit:** `de5199b` (`main`)  
**Status:** Phase 4 Complete — Ready for Phase 5  
**Current Next Step:** Begin Phase 5: Screens & Dashboard Redesign (Navbar, Footer, Splash, Home Hero, URL Input, Custom Mode Modal, Loading Screen, ResultPage, ScoreCard, ScoreChart, CategorySection, IssueCard, StaticAnalysisPanel, 404, Legal, Toasts, ErrorBoundary).

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
| **Phase 3** | **Foundations & Tokens** | Design tokens in `tailwind.config.js`, `index.css`, fonts, inline pre-React loader in `index.html`, retire `Lightfall` & `ogl` | **COMPLETE** |
| **Phase 4** | **UI Primitives Library** | Button, Input, Switch, Surface/Card, Terminal Tag/Badge, Modal, Score Ring, Score Bar, Code display | **COMPLETE** |
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
| **Global Footer** | `client/src/components/Footer.tsx` | Basic footer with Lightfall credit | Lightfall credit retired; pending Phase 5 overhaul | Baseline screenshot captured |
| **Home Hero** | `client/src/components/Hero.tsx` | Hero text + ReviewPreviewCard | Lightfall background removed; pending Phase 5 overhaul | Baseline screenshot captured |
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
| **HTML Pre-React Loader** | `client/index.html` | Stock inline SVG flame pulse | Phase 3 Complete (Geometric caliper & ember SVG mark + calm breathing animation) | Inspected |
| **Favicon & App Icon** | `client/public/favicon.svg` | Stock flame SVG | Phase 2 Complete (Integer 16px SVG & 512px icon) | Zero Lucide flame |
| **Design Review Page** | `client/design/` | Does not exist | Phase 2 Complete (/design route & logo-preview.html) | Interactive suite |

---

## 4. UI Primitives Matrix (Phase 4)

| Primitive | Target Path | Variants / Requirements | Status |
|---|---|---|---|
| **Button** | `client/src/components/ui/Button.tsx` | Primary, Secondary, Ghost, Icon (sm/md/lg), loading, disabled | **COMPLETE** |
| **Input** | `client/src/components/ui/Input.tsx` | Form input with focus ring, error & disabled states, mono/tabular | **COMPLETE** |
| **Switch** | `client/src/components/ui/Switch.tsx` | Accessible toggle (`role="switch"`, keyboard operable, description) | **COMPLETE** |
| **Surface / Card** | `client/src/components/ui/Surface.tsx`, `Card.tsx` | Layered surface cards with hairline borders & elevated tiers | **COMPLETE** |
| **Terminal Tag / Badge**| `client/src/components/ui/Badge.tsx`, `TerminalTag.tsx` | Monospace severity tags (`[CRITICAL]`, `[WARNING]`, `[SUCCESS]`) | **COMPLETE** |
| **Modal Dialog** | `client/src/components/ui/Modal.tsx` | Accessible dialog with backdrop blur, Escape key, & focus trap | **COMPLETE** |
| **Score Ring / Meter** | `client/src/components/ui/ScoreRing.tsx` | Animated circular SVG meter with tabular score & data palette | **COMPLETE** |
| **Score Bar** | `client/src/components/ui/ScoreBar.tsx` | Horizontal score progress bar with tabular numbers | **COMPLETE** |
| **Code Display** | `client/src/components/ui/CodeBlock.tsx` | Monospace code block with copy action & syntax styling | **COMPLETE** |
| **File Path Display** | `client/src/components/ui/FilePath.tsx` | Line-number tag with truncate and select-all | **COMPLETE** |
| **Tooltip** | `client/src/components/ui/Tooltip.tsx` | Accessible spring micro-tooltip (top/bottom/left/right) | **COMPLETE** |

---

## 5. Decisions Log

- **2026-11-17**: Completed Phase 4 by authoring complete accessible UI Primitives Suite (`Button`, `Input`, `Switch`, `Surface`, `Card`, `Badge`, `TerminalTag`, `Modal`, `ScoreRing`, `ScoreBar`, `CodeBlock`, `FilePath`, `Tooltip`) in `client/src/components/ui/`. Implemented Apple-inspired tactile responsiveness (<100ms response, `active:scale-[0.98]`, spring curves, tabular figures, high-contrast focus rings, WCAG AA compliance). Integrated interactive UI Primitives inspection suite with live controls in `DesignReviewPage.tsx`. Verified 100% clean build and zero functional regressions in test suite.

- **2026-11-17**: Created branch `redesign/v3` from `main` (`de5199b`).
- **2026-11-17**: Verified baseline client build (`npm run build`) succeeds cleanly with zero errors.
- **2026-11-17**: Verified baseline test suite (`npm run test:e2e`) passes 100% across all 9 tests.
- **2026-11-17**: Initialized `client/REDESIGN_PROGRESS.md` as single source of truth for resumable execution across all 8 phases.
- **2026-11-17**: Standardized baseline screenshot viewports to 375px (mobile, 375x812), 768px (tablet, 768x1024), and 1440px (desktop, 1440x900) across all 9 critical UI states.
- **2026-11-17**: Created automated baseline capture suite in `client/tests/capture-baseline.spec.ts` capturing 60 screenshot artifacts in `client/design/before/` with both pixel-suffix and bare-width aliases.
- **2026-11-17**: Verified full e2e test suite with baseline capture: 36 passed cleanly (38.2s).
- **2026-11-17**: Isolated baseline screenshot capture behind environment guard (`CAPTURE_BASELINE`) and added dedicated `npm run test:baseline` script with `cross-env`. Standard test suite (`npm run test:e2e`) now executes exclusively functional regression tests (9/9 passed, 27 baseline capture specs skipped) without side-effects, preserving committed baseline screenshots in `client/design/before/` across all future redesign phases.
- **2026-11-17**: Completed Phase 1 by authoring canonical design specification `client/DESIGN.md`: defined "The Thermal Observatory / Precision Caliper" dual-metaphor concept uniting Tree-Sitter AST telemetry with searing code roast; documented 3 directions and 1-line rejection rationales for the losing 2; codified 60-30-10 palette tokens with empirical WCAG AA contrast evaluations; established tabular numerals mandate; defined modular type scale (Plus Jakarta Sans + JetBrains Mono); formulated 6 Apple working design rules; codified strict anti-pattern avoid list; specified motion choreography (1.4s assembly and 2.4s calm respiration) with reduced-motion fallbacks; and formulated mathematical 32x32 master grid vectors, integer-snapped 16px favicon coordinates, and clear space rules.
- **2026-11-17**: Completed Phase 3 by implementing foundations, tokens, typography, global CSS, and inline HTML loader: authored `client/src/utils/cn.ts` with `clsx` and `tailwind-merge`; configured `client/tailwind.config.js` with 60-30-10 palette tokens (`background`/`dominant` #0C0E12, `surface` #161920/#1F242E, `border` #222733/#3A4356, `text` #F0F3F6/#949CA6/#646E7E, `primary`/`accent` #FF5426/#E84518/#0C0E12/#D83B01, semantic `data` palette #10B981/#F59E0B/#E67E22/#EF4444, `Plus Jakarta Sans` and `JetBrains Mono` fonts, and physical spring/settle motion tokens); updated `client/src/index.css` with `:root` CSS custom properties, `.tabular-nums`, `.border-hairline`, and modernized `.glass-panel`/`.content-panel`; updated `client/index.html` with Google Fonts preloading, authoritative metadata with zero emoji, and pre-React inline SVG loader matching `LogoMark.tsx` on #0C0E12 canvas with calm breathing pulse; updated `client/src/utils/scoreHelpers.ts` to return semantic data palette colors; tokenized `react-hot-toast` in `client/src/App.tsx`; retired `Lightfall.tsx`, `Lightfall.css`, removed `ogl` dependency from `client/package.json`, and purged references from `HomePage.tsx` and `Footer.tsx` (eliminating 6 ESLint baseline errors from 20 to 14, and saving ~50kB JS bundle size); verified 100% pass across build (`tsc -b && vite build`) and Playwright E2E regression suite (9/9 passed).

---

## 6. Next Step

**Next step:** Begin Phase 4: UI Primitives Library. Scaffold `client/src/components/ui/` and implement all accessible primitives (`Button`, `Input`, `Switch`, `Surface`/`Card`, `Badge`/`TerminalTag`, `Modal`, `ScoreRing`, `ScoreBar`, `CodeBlock`, `FilePath`, `Tooltip`, `index.ts`) with strict WCAG AA contrast (6.02:1 dark text on vermilion), tabular numerals, and interactive showcase in `client/src/pages/DesignReviewPage.tsx`.
