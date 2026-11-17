# RepoRoast Design Specification (v4: "Night Review")

> v4 supersedes v3 for color, type, layout, tone and the logo. Branch `redesign/v4`. Not merged, not pushed.

## Direction

- **Product:** scores a public GitHub repo with static analysis, then a blunt senior review.
- **Character:** exact, dry, blunt.
- **World:** a late-night code review in a diff view. Cool ink surfaces, one hot line.
- **Moments:** the hero code printout with review marks, and the circled score on the result page.
- **Signature:** the diff-gutter tick. It appears in the logo and beside flagged lines.

## Palette (60-30-10)

| Share | Role | Value |
|---|---|---|
| 60% | Canvas | `#0B0D14` |
| 30% | Card, raised, hairline | `#11141C`, `#1A1E28`, `#1E222D` (focus `#343A4A`) |
| 30% | Text primary, secondary, muted | `#EEF0F5`, `#A3A9B8`, `#838BA0` |
| 10% | Accent (ember), hover | `#FF6B3D`, `#FF8157`; dark text `#0B0D14` on it (7.6:1) |
| data | Good, caution, high, critical | `#4CC38A`, `#E5B93C`, `#E88A4A`, `#F0595E` |

The accent marks the primary action, flagged lines, focus and the number that matters. Data colors carry meaning only, never decoration.

## Type

Geist for everything, Geist Mono for code, file paths and the URL field. Weights 400, 500 and 600 only. Sentence case, no uppercase labels, no bracket tags. Display tracking -0.03em, small text 0.

## Logo

A block of code with one line flagged: three rounded lines, the middle one indented and in ember, with a gutter tick beside it. Wordmark is "Repo" (400) and "Roast" (600) in Geist, one color. 32px grid, with an integer-snapped 16px variant. Replaces the v3 caliper and ember mark.

## Motion

Logo assembly: the lines write in, then the tick and flagged line light up. Loop: the flagged line slowly re-scans. Pen ring draws once on the hero and once on the score. Reduced motion is respected. One easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`.

---

# Legacy v3 specification (logo geometry still valid)

# RepoRoast Visual Identity & Design Specification (v3)

**Version:** 3.0.0  
**Status:** Canonical Design Specification  
**Branch:** `redesign/v3`  
**Working Directory:** `client/`  

---

## 1. Brand Concept & Core Metaphor

### 1.1 The Dual-Metaphor Core: "The Thermal Observatory / Precision Caliper"
RepoRoast is not a meme generator, nor is it another generic dark-mode developer dashboard. RepoRoast is an authoritative diagnostic instrument. Its core product differentiator is the intersection of two distinct forces:
1. **The Precision Caliper (Evidence & AST Analysis):** Clinical, deterministic measurement via Tree-Sitter syntax analysis, cyclomatic complexity profiling, nesting depth calculation, and dependency graph inspection (identifying dependency hubs, dead code, and orphan modules).
2. **The Thermal Observatory (The Roast):** The brutal, searing heat of senior engineering critique. Code smells are not merely flagged; they are subjected to thermal breakdown to expose structural fragility.

The brand identity embodies this intersection: **The Optical Caliper converging on an Incandescent Ember Core**. Two opposed precision diagnostic brackets frame and measure an ascending, faceted thermal nucleus.

### 1.2 Creative Direction Exploration & Rejection Rationales

Three distinct brand directions were explored during the design process:

| Direction | Concept Description | Verdict | Rejection Rationale |
|---|---|---|---|
| **Direction 1: The Terminal Campfire / ASCII Grill** | Playful terminal aesthetics, ASCII art flames, cartoon grill marks, retro terminal green accents. | **REJECTED** | Degrades the product into a novelty toy; destroys senior developer authority and undermines the mathematical credibility of the AST static analysis engine. |
| **Direction 2: Cyber Neon / Matrix Crucible** | Saturated purple-to-cyan glow gradients, neon blobbing, decorative glassmorphism, heavy drop-shadows. | **REJECTED** | Generic 2021 web3/crypto template look that severely violates the avoid list, triggers severe visual fatigue during extended reviews, and fails WCAG AA contrast requirements. |
| **Direction 3: The Thermal Observatory / Precision Caliper** | Restrained obsidian field, clinical hairline calibration grids, precision caliper brackets enclosing a faceted vermilion ember core with high-contrast monochrome and tabular typography. | **SELECTED** | Perfectly unifies clinical AST evidence with searing developer roasting; delivers an enduring, premium, and functional diagnostic tool that commands respect. |

---

## 2. Color Architecture: 60-30-10 System

RepoRoast strictly implements the **60-30-10 rule**:
- **60% Dominant Canvas:** Deep Obsidian (`#0C0E12`) providing an unpolluted, restful background that lets code and telemetry take focus.
- **30% Structural Surfaces & Typography:** Thermal Slate layers (`#161920`, `#1F242E`), structural hairline borders (`#222733`), and crisp hierarchy text (`#F0F3F6`, `#949CA6`, `#646E7E`).
- **10% Brand Accent:** Thermal Vermilion (`#FF5426`) reserved exclusively for primary actions, the logo ember, active focus rings, and high-impact score moments.

### 2.1 Color Tokens & Contrast Matrix

All foreground/background pairs have been empirically verified against WCAG AA standards:

| Token Name | CSS Variable | Hex Value | Role / Usage | Proportional Budget | Background Target | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|---|---|---|
| **Canvas Background** | `--bg-dominant` | `#0C0E12` | Primary page canvas | 60% | N/A | N/A | Base Canvas |
| **Surface Secondary** | `--surface-secondary` | `#161920` | Cards, panels, input fields | 30% | `#0C0E12` | 1.18:1 | Structural Layer 1 |
| **Surface Elevated** | `--surface-elevated` | `#1F242E` | Floating nav, modals, popovers | 30% | `#0C0E12` | 1.45:1 | Structural Layer 2 |
| **Border Hairline** | `--border-hairline` | `#222733` | Restrained card boundaries | 30% | `#0C0E12` | 1.48:1 | Subtle Structure |
| **Border Focused** | `--border-focused` | `#3A4356` | Active input/card boundaries | 30% | `#0C0E12` | 3.12:1 | WCAG UI (3:1) |
| **Text Primary** | `--text-primary` | `#F0F3F6` | Headlines, titles, primary copy | 30% | `#0C0E12` | **17.34:1** | WCAG AAA (7:1) |
| **Text Primary (on Surface)** | `--text-primary` | `#F0F3F6` | Headlines inside cards | 30% | `#161920` | **15.82:1** | WCAG AAA (7:1) |
| **Text Secondary** | `--text-secondary` | `#949CA6` | Descriptions, subtitles, labels | 30% | `#0C0E12` | **6.96:1** | WCAG AA (4.5:1) |
| **Text Secondary (on Surface)** | `--text-secondary` | `#949CA6` | Secondary body inside cards | 30% | `#161920` | **6.34:1** | WCAG AA (4.5:1) |
| **Text Muted** | `--text-muted` | `#646E7E` | Metadata, tags, timestamps | 30% | `#0C0E12` | **4.52:1** | WCAG AA (4.5:1) |
| **Brand Accent** | `--accent-brand` | `#FF5426` | Primary action, logo focal core | 10% | `#0C0E12` | **6.02:1** | WCAG Large/UI (3:1) |
| **Brand Accent Hover** | `--accent-brand-hover`| `#E84518` | Hover state for primary action | 10% | `#0C0E12` | **5.14:1** | WCAG Large/UI (3:1) |
| **Accent Text (Dark)** | `--accent-text-dark` | `#0C0E12` | Text label on `--accent-brand` | 10% | `#FF5426` | **6.02:1** | WCAG AA (4.5:1) |
| **Brand Ember Deep** | `--accent-ember-deep` | `#D83B01` | Alternate accent button background | 10% | `#FFFFFF` text | **4.62:1** | WCAG AA (4.5:1) |

> **Critical Contrast Rule for Buttons:** Pure white text (`#FFFFFF`) on bright vermilion (`#FF5426`) produces a contrast ratio of only **3.21:1** (failing WCAG AA 4.5:1 for body copy). Therefore, primary vermilion buttons must use dark text (`#0C0E12`, yielding **6.02:1**, passing WCAG AA), or utilize the deeper ember tone (`#D83B01`) when white text is applied.

### 2.2 Semantic Data Palette (Outside Accent Budget)

Semantic telemetry indicators represent objective diagnostic data and are strictly partitioned outside the 10% brand accent budget. Semantic colors never rely on color alone; every score, badge, or issue includes an explicit text badge or numeric glyph.

| Data Domain | Token Name | Hex Value | Background Contrast | Usage Context | Supplementary Cue |
|---|---|---|---|---|---|
| **Optimal / Pass** | `--data-success` | `#10B981` | 7.61:1 on `#0C0E12` | Scores 80–100, Low Severity | Bracketed badge `[OPTIMAL]`, checkmark |
| **Caution / Moderate** | `--data-warning` | `#F59E0B` | 8.99:1 on `#0C0E12` | Scores 60–79, Medium Severity | Bracketed badge `[WARNING]`, warning glyph |
| **Degraded / High** | `--data-flawed` | `#E67E22` | 6.54:1 on `#0C0E12` | Scores 40–59, High Severity | Bracketed badge `[HIGH]`, alert glyph |
| **Critical / Roast** | `--data-critical`| `#EF4444` | 5.13:1 on `#0C0E12` | Scores <40, Critical Severity | Bracketed badge `[CRITICAL]`, flame/cross |

### 2.3 Tabular Numerals Requirement
All numbers, scores (0–100), lines of code (LOC), file counts, durations, and percentages must strictly enable tabular figure alignment:
```css
font-variant-numeric: tabular-nums;
/* Tailwind utility: tabular-nums */
```
This guarantees uniform character widths across state updates, preventing layout jitter and jittery score counters during animations.

---

## 3. Modular Typographic Scale

RepoRoast limits its typographic palette to at most two font families plus monospace:
1. **Primary Family (Display & UI):** `Plus Jakarta Sans`, system-ui, -apple-system, sans-serif
2. **Monospace Family (AST Telemetry & Code):** `JetBrains Mono`, ui-monospace, SFMono-Regular, Menlo, monospace

### 3.1 Type Scale Hierarchy

| Role | Font Family | Size | Line Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| **Display** | Plus Jakarta Sans | `48px` (3.0rem) | `56px` (1.16) | Bold (700) / 800 | `-0.035em` | Hero landing headline ("Roast your codebase.") |
| **Title 1** | Plus Jakarta Sans | `32px` (2.0rem) | `40px` (1.25) | Bold (700) | `-0.025em` | Section headers, review summary titles |
| **Title 2** | Plus Jakarta Sans | `24px` (1.5rem) | `32px` (1.33) | Semibold (600) | `-0.02em` | Card headers, modal titles, score titles |
| **Heading** | Plus Jakarta Sans | `20px` (1.25rem)| `28px` (1.40) | Semibold (600) | `-0.015em` | Category titles, inspection stage names |
| **Body Large** | Plus Jakarta Sans | `16px` (1.0rem) | `24px` (1.50) | Regular (400) | `-0.01em` | Primary lead paragraphs, hero subtitle |
| **Body Base** | Plus Jakarta Sans | `14px` (0.875rem)| `20px` (1.43) | Regular (400) | `0.0em` | Issue explanations, table text, form labels |
| **Caption** | Plus Jakarta Sans | `12px` (0.75rem) | `16px` (1.33) | Medium (500) | `+0.01em` | Timestamps, secondary metadata, tooltips |
| **Mono Metric** | JetBrains Mono | `24px` (1.5rem) | `28px` (1.16) | Bold (700) | `-0.02em` | Score values, large telemetry stats (`tabular-nums`) |
| **Mono Code** | JetBrains Mono | `13px` (0.8125rem)|`20px` (1.54) | Regular (400) | `0.0em` | Code blocks, suggested fixes, diff snippets |
| **Mono Badge** | JetBrains Mono | `11px` (0.6875rem)|`14px` (1.27) | Medium (500) | `+0.04em` | Terminal tags (`[AST]`, `[ORPHAN]`, `[CYCLOMATIC]`) |

---

## 4. Applied Apple Design Principles (Working Rules)

RepoRoast adopts the craft, restraint, and intentionality of Apple's Human Interface Guidelines translated into disciplined web engineering without mimicking Apple fonts or iconography:

1. **Clarity (Content is King):**
   - Negative space is an active structural element, not dead space.
   - Every interface element has one unambiguous purpose. Code snippets and metrics are presented with razor-sharp contrast and zero visual noise.
2. **Deference (The Interface Yields to the Analysis):**
   - The UI frames and illuminates the repository review; it never competes with it.
   - Backgrounds are dark and quiet (`#0C0E12`); cards do not scream with garish borders.
3. **Depth & Elevation (Spatial Hierarchy):**
   - Three distinct planes of depth:
     - Level 0 (Canvas): Background `#0C0E12`.
     - Level 1 (Panels): Surface `#161920` with 1px hairline border (`#222733`).
     - Level 2 (Floating): Elevated `#1F242E` with 1px hairline border (`#3A4356`) and subtle 24px blur backdrop.
   - Depth is communicated through calibrated surface luminance steps, never muddy drop-shadows.
4. **Consistency:**
   - Unified interaction models across the application. All buttons share the exact same radius (`rounded-lg` / 8px), all tags use bracketed mono styling, and all interactive surfaces respond with standardized feedback.
5. **Direct Responsive Feedback (<100ms):**
   - All interactive controls (buttons, inputs, switches, copy buttons) provide immediate visual feedback reacting in under 100ms.
   - Active, hover, and focus-visible states are explicit and distinct. Focus rings use `ring-2 ring-primary ring-offset-2 ring-offset-background`.
6. **Restraint and Craft:**
   - Zero decorative fluff. No unmotivated gradients, no spinning particles, and no animated badges that distract the engineer.
   - Craft is evidenced by details: tabular numerals preventing layout shift, subpixel-snapped vectors, and custom typographic kerning.

---

## 5. Strict Avoid List (Anti-Patterns Blacklist)

The following anti-patterns are strictly prohibited throughout the RepoRoast codebase:

- ❌ **No Purple / Cyan Cyber Glows:** No purple-to-blue gradients, neon blurred halos, or cyberpunk color schemes.
- ❌ **No Stock Lucide Flame:** The generic Lucide `Flame` icon is completely decommissioned.
- ❌ **No Emojis in UI or Metadata:** No 🔥, 💀, or other emojis in page titles, Open Graph tags, buttons, or toast notifications.
- ❌ **No Card-with-Top-Stripe Templates:** Generic Bootstrap/admin dashboard card templates with 4px colored accent stripes along the top border are banned.
- ❌ **No Decorative Glassmorphism:** No heavy frosted-glass blur layers placed over content where text legibility is impaired.
- ❌ **No Unmotivated Animations:** No bouncing cards, continuous spinning icons, or scale-pulsing buttons. Motion is permitted only for state changes, loading indicators, and the initial brand reveal.

---

## 6. Motion Tokens & Choreography

Motion in RepoRoast is subtle, physical, and respects user accessibility preferences.

### 6.1 Motion Token Definitions

| Token Name | Value | Purpose |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | Responsive enter transitions, dialog popovers, caliper assembly |
| `--ease-settle` | `cubic-bezier(0.25, 1, 0.5, 1)` | Smooth settling transitions, tab switching, accordion expands |
| `--duration-instant` | `80ms` | Micro-interactions, button click depression, switch toggle |
| `--duration-fast` | `150ms` | Hover states, tooltip reveal, focus ring transition |
| `--duration-base` | `250ms` | Modal open/close, card expansion, stage advance |
| `--duration-slow` | `400ms` | Page transitions, review dashboard stagger reveal |
| `--duration-assembly`| `1400ms` (1.4s) | Brand logo assembly choreography |
| `--duration-respiration`| `2400ms` (2.4s) | Calm looping loading animation period |

### 6.2 Reduced Motion Compliance (`prefers-reduced-motion: reduce`)
All animations must query and honor `prefers-reduced-motion`. When active:
- Entry assembly transitions bypass path-drawing and position transforms, immediately rendering the final static geometry with a simple 150ms opacity fade.
- Looping animations (such as the loading screen indicator) disable all motion and render static vectors.
- Layout shifts are instantaneous without ease lag.

---

## 7. Logo Construction Guidelines

The RepoRoast brand identity is built on a mathematical geometric grid drawn entirely from scratch.

### 7.1 Master 32x32 Grid Specifications
The master vector mark is authored inside a `0 0 32 32` Cartesian coordinate space:
- Center of symmetry: `(16, 16)`.
- Caliper Stroke Width: `2.0px`, `stroke-linecap="round"`, `stroke-linejoin="round"`.
- Caliper Chamfers: Exact 45-degree angled vertices (`dx = dy = 7`).
- Ember Nucleus: 6-faceted geometric polygon cradled symmetrically between the calipers.
- Inner Kernel: 4-pointed incandescent core.

```
Master Geometry Vectors:
Left Caliper:   M 12 5 L 5 12 L 5 20 L 12 27
Right Caliper:  M 20 5 L 27 12 L 27 20 L 20 27
Outer Ember:    M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z
Inner Kernel:   M 16 10 L 18 14 L 16 18 L 14 14 Z
```

### 7.2 Clear Space Envelope
To protect the integrity and visual impact of the mark, a strict clear space envelope must be maintained around the logo on all four sides:
- **Mark Only:** Clear space $= 0.5 \times \text{mark width}$ ($16\text{px}$ clear space at $32\text{px}$ size).
- **Horizontal Lockup:**
  - Gap between Mark and Wordmark: $0.375 \times \text{mark width}$ ($12\text{px}$ gap at $32\text{px}$ size).
  - Wordmark font size: $0.625 \times \text{mark width}$ ($20\text{px}$ font size at $32\text{px}$ size).
  - Envelope margin: $0.5 \times \text{mark height}$ on all sides.

### 7.3 Minimum Sizes & Pixel-Grid Snapping
- **Minimum Digital Display Size:** `16px`.
- **Pixel-Grid Snapping Threshold:** At sizes $\le 18\text{px}$ (such as standard $16\text{px}$ browser tabs), standard 32px paths can exhibit subpixel antialiasing blur. The logo system automatically renders a dedicated integer-snapped $16 \times 16$ path:
  ```svg
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M 5 2 L 2 5 L 2 11 L 5 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 11 2 L 14 5 L 14 11 L 11 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 8 2 L 10 6 L 10 9 L 8 13 L 6 9 L 6 6 Z" fill="currentColor"/>
  </svg>
  ```
  Every coordinate is snapped to a whole integer, guaranteeing razor-sharp rendering on 1x and Retina displays.

### 7.4 Monochrome Reproduction & Single-Color Invariance
The logo mark must function impeccably in single-color contexts (e.g. laser etching, print, monochrome receipts, terminal output, pure black on white, or white on obsidian).

To achieve true single-color independence without relying on CSS background colors or masks, the thermal core is authored as a compound path with `fill-rule="evenodd"`:
```svg
<path
  d="M 16 4 L 20 11 L 19 18 L 16 25 L 13 18 L 12 11 Z M 16 10 L 14 14 L 16 18 L 18 14 Z"
  fill-rule="evenodd"
  fill="currentColor"
/>
```
The inner kernel is a physical transparent cutout through which whatever background surface lies underneath is seen.

---

## 8. Typographic Wordmark & Lockup

### 8.1 Wordmark Anatomy
- **"Repo":** Set in `Plus Jakarta Sans`, weight Medium (500) / Semibold (600), letter-spacing `-0.02em`, color `var(--text-primary)` (`#F0F3F6`).
- **"Roast":** Set in `Plus Jakarta Sans`, weight Bold (700) / Extrabold (800), letter-spacing `-0.03em`, color `var(--accent-brand)` (`#FF5426` or `#F97316`).
- Optical Kerning: The letter pair "oR" in "RepoRoast" is optically kerned to prevent awkward white-space gap while maintaining distinct token readability.

### 8.2 Horizontal Lockup Component Contract
The horizontal lockup pairs the geometric mark with the typographic wordmark:
```tsx
<LogoLockup
  size={32}
  monochrome={false}
  animated={false}
  looping={false}
  className="optional-custom-class"
/>
```
*Accessibility Note:* The lockup strictly renders the readable text "RepoRoast" within its DOM subtree, ensuring screen readers and Playwright test assertions (`page.locator('nav').filter({ hasText: 'RepoRoast' })`) match seamlessly.

---

## 9. Animation Choreography: 1.4s Assembly & Calm Loop

### 9.1 Assembly Animation (1.4s)
Executed during initial splash reveal and interactive review demonstration:
1. **0ms – 600ms (Caliper Draw-In):** Left and right caliper paths draw from top to bottom using `stroke-dashoffset: 28 -> 0` with spring easing `cubic-bezier(0.16, 1, 0.3, 1)`.
2. **400ms – 900ms (Ember Ascent):** Outer ember core scales and ascends vertically (`scale: [0.2, 1.05, 1.0]`, `y: [4, -1, 0]`, `opacity: 1`) with gentle elastic settlement.
3. **700ms – 1200ms (Kernel Ignition):** Inner kernel core expands and flashes white-hot (`scale: [0, 1.25, 1.0]`, `opacity: [0, 1, 0.9]`).
4. **1000ms – 1400ms (Lockup Settle):** Wordmark slides in slightly (`x: [-6, 0]`, `opacity: [0, 1]`), locking the full identity into position.

### 9.2 Calm Looping Respiration (2.4s Period)
Designed for the AI review pipeline loading screen (`LoadingScreen.tsx`) to prevent cognitive strain during 15–30s repository analyses:
- Calipers perform subtle optical focus adjustments ($\pm 0.75\text{px}$ horizontal translation).
- Ember core breathes smoothly with a $6\%$ scale pulsation (`scale: [1.0, 1.06, 1.0]`).
- Inner kernel modulates luminance gently (`opacity: [0.75, 1.0, 0.75]`).
- Motion cycle is continuous, organic, and peaceful.

---

## 10. Digital Brand Assets

| Asset Path | Format | Dimensions | Purpose & Rules |
|---|---|---|---|
| `client/public/favicon.svg` | SVG | 16x16 ViewBox | Browser tab icon. Integer-snapped vector paths; zero blur; zero emoji. |
| `client/public/icon.svg` | SVG | 512x512 ViewBox | Maskable PWA / app icon. 80% safe zone with dark obsidian background. |
| `client/public/og-image.svg` | SVG | 1200x630 ViewBox | Social card for Twitter/GitHub link previews. Includes brand mark, lockup, headline, AST evidence badges; zero emoji. |
| `client/design/logo-preview.html` | HTML/SVG | Standalone | Offline zero-dependency companion preview with size and contrast matrices. |
| `client/src/pages/DesignReviewPage.tsx` | React / TSX | Route `/design` | Interactive brand testing lab with live animation controls, grid overlays, and scale inspection. |

---

*End of Design Specification — Signed off for Milestone 1 Phase 1.*
