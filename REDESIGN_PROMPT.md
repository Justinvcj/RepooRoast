# RepoRoast: full rebrand and UI redesign

You are redesigning the whole front end of RepoRoast and giving it a new visual identity, including a logo and logo animation drawn from scratch. The owner will preview the result in the browser and then decide what to keep, so your job is to get a complete, coherent, shippable-quality redesign onto a branch and running locally. Nothing gets merged, pushed or deployed.

This prompt may be run more than once, possibly by a different model, because a session can run out of usage partway through. **Before doing anything else, follow "Resuming" below.**

## Resuming

1. Check whether the branch `redesign/v3` and the file `client/REDESIGN_PROGRESS.md` exist.
2. If they do, check out the branch, read `client/REDESIGN_PROGRESS.md` and `client/DESIGN.md` in full, read `git log --oneline -20`, and continue from the first unfinished phase. The brand direction, palette, type and logo concept recorded in `DESIGN.md` are settled. Do not redo or second-guess them, even if you would have chosen differently; a redesign that changes direction halfway is worse than either direction alone. If the working tree has uncommitted changes, inspect them and finish that step instead of discarding it.
3. If they do not exist, create the branch from `main` and start at Phase 0.

Keep the work resumable as you go:

- Commit at the end of every phase, and inside long phases after every screen. Small commits are the save points.
- Update `client/REDESIGN_PROGRESS.md` in the same commit. It holds a checklist of the phases below, a checklist of every screen and component with its status, a short "Decisions" log (what you chose and why, one line each), and a "Next step" line specific enough that someone with no memory of this session could pick it up, e.g. "IssueCard restyled; next is StaticAnalysisPanel, then run e2e".
- Write decisions down the moment you make them. Anything that lives only in your context is lost if the session ends.

## The product

RepoRoast takes a public GitHub repository URL and returns a brutally honest code review: an overall score out of 100, a verdict, a senior-dev quote, per-category scores with issues and positives, top priorities, a hiring verdict, a copyable fix prompt, and a static-analysis panel (LOC, language breakdown, dependency hubs, orphans, circular paths). The score is grounded in real static analysis (tree-sitter ASTs, a dependency graph), not only an LLM's opinion. That is the product's actual differentiator and the brand should carry it: a sharp, credible instrument with a dry sense of humour, not a meme toy. The audience is developers, who are quick to notice and dismiss generic design.

Read `PRD.md`, `README.md` and `ARCHITECTURE.md` for the rest. The name stays **RepoRoast**.

## The codebase

- `client/` is the only thing you change. React 19, Vite 8, TypeScript, Tailwind 3.4, framer-motion 12, lucide-react, recharts, react-hot-toast, react-router 7. `server/` is out of scope.
- Routes (`client/src/App.tsx`): `/` home, `/result`, `/privacy`, `/terms`, and a 404.
- Screens and states to cover, all of them: splash, home (hero, URL input with validation and example repos, the sections below the hero in `HomePage.tsx`), the Custom Mode (bring-your-own-API-key) modal, the loading screen (driven by real server-reported pipeline stages, with a shorter stage list in custom mode), the result page with its own action bar, `ReviewDashboard`, `ScoreCard`, `ScoreChart`, `CategorySection`, `IssueCard`, `StaticAnalysisPanel`, the navbar, footer, toasts, `ErrorBoundary` fallback, 404, privacy and terms. Also the pre-React loader and meta tags in `client/index.html`, and `client/public/favicon.svg`.
- The data shapes are in `client/src/types/index.ts`. Design for real content: long repo names, a score of 3 and a score of 98, a category with zero issues and one with fifteen, long file paths, missing description, missing `analysis`.

What is there now is a GitHub-dark background (`#0d1117`), a stock orange (`#f97316`), Inter plus Bricolage Grotesque, a Lucide flame icon standing in as the logo, a pulsing-scale splash, a floating glass pill navbar, and rounded cards with tinted borders. It has been through several cleanup passes and is tidy, but it is still a polished default rather than an identity. Treat it as a description of the content and behaviour, not as a starting point for the visuals. You are replacing the look, not adjusting it.

### What must not change

- Behaviour. Do not alter the hooks (`client/src/hooks`), utils, types, API calls, routing, or the Custom Mode logic. This is a presentation-layer redesign. If a component mixes logic and markup, keep the logic and rewrite the markup.
- The loading screen hides the navbar and footer (via `LayoutContext`) and its progress reflects real pipeline stages. Do not add fake timed progress.
- The end-to-end tests in `client/tests/reporoast.spec.ts` must pass when you finish. Read that file before touching any screen. It relies on, among other things: the text "Roast your codebase.", a `nav` containing "RepoRoast", a `footer` with "Privacy Policy" and "Terms of Service" links, "404" with a "back to safety" link, "Back to RepoRoast" links on the legal pages, a single `input[type="text"]` and `button[type="submit"]` on home, the text "Analyzing Codebase", a result `nav` containing "Roast Another", an "invalid github url" error, a "use your own api key" button that becomes "custom mode: on", a `role="switch"`, the placeholder `AIza...`, and a "Save" button. If you become convinced a specific string should change for the brand, change the test in the same commit and note it in the Decisions log. Do not weaken or delete tests to get them passing.
- `npm run build` and `npm run lint` in `client/` must pass.
- Avoid new dependencies. Everything here is achievable with what is installed plus hand-written SVG and CSS. If something genuinely needs one, record why. Remove dependencies and files the redesign leaves unused (check whether `Lightfall` and `ogl` are still used).

## The standard

Work as a senior brand and product designer who also writes the code. The bar is that a working designer would look at this and assume a person with taste made it for this product specifically. Every visual decision should trace back to one idea about what RepoRoast is. If you cannot say why an element looks the way it does, it is a default, and defaults are what make an interface read as machine-generated.

### Start from a concept

Before any styling, decide on one brand idea and write it in `client/DESIGN.md` in a few sentences. Derive it from the product: heat, char and roasting on one side; inspection, measurement, grading and evidence on the other. The interesting territory is where those meet. Sketch at least three genuinely different directions in your head (different mood, palette family, type personality and logo idea), pick the strongest, and record in one line each why the others lost. Then let that concept drive palette, type, shape language, the logo, illustration or texture if any, and how things move.

A dark theme is not required. Choose light or dark because the concept calls for it, and ship one theme done completely rather than two done partially. Structure the tokens so a second theme could be added later.

### Colour: the 60-30-10 rule

Build the palette on the 60-30-10 proportion (the owner referred to this as "70-30-10"; the intent is a dominant, a secondary and a sparing accent):

- About 60% dominant: the page background and large quiet areas.
- About 30% secondary: surfaces, panels, type, structural elements, in a small tonal family related to the dominant.
- About 10% accent: one brand colour, used only where it means something, such as the primary action, the logo, the focus ring, and the single most important number on screen. If the accent appears on more than a handful of elements per screen it has stopped being an accent.

Score and severity colours (good, middling, bad; critical, high, medium, low) are data colours. They sit outside the accent budget but must be tuned to belong to the same palette, be distinguishable from the brand accent, and never rely on colour alone. Pick neutrals with a deliberate temperature rather than pure grey or a borrowed GitHub grey. Define every colour once as a token (CSS custom properties surfaced through `tailwind.config.js`) and remove every hard-coded hex from components, including the toaster styles in `App.tsx` and the inline loader in `index.html`. Body text must meet WCAG AA contrast (4.5:1), large text and UI boundaries 3:1. Record the palette with each colour's role and its share of the 60-30-10 split in `DESIGN.md`, then check finished screenshots against it honestly.

### Apple's design principles, applied

Use these as working rules, not as a visual style to imitate. Do not copy Apple's look, fonts or iconography.

- Clarity: content is legible at every size, hierarchy is obvious at a glance, each screen has one primary action, and nothing is decorative at the cost of comprehension.
- Deference: the interface steps back so the content leads. On the result page the score and the findings are the hero, and chrome is minimal. Remove boxes, borders and labels that do not earn their place.
- Depth: use layering and motion to explain hierarchy and where things come from, with one consistent elevation model. Translucency only where something actually sits above moving content.
- Consistency: one spacing scale, one type scale, one radius scale, one set of control heights, one icon style. The same thing looks and behaves the same everywhere.
- Direct, responsive feedback: every interactive element has hover, active, focus-visible and disabled states, and reacts within about 100ms.
- Restraint and craft: generous, intentional whitespace, optical alignment, careful letter-spacing on large type, tabular numerals for scores and metrics.

### Typography

Choose typefaces for the concept, at most two families plus an optional monospace for code, file paths and metrics. Pick them on purpose; do not keep Inter out of habit. Use freely licensed fonts, load only the weights you use, and avoid layout shift. Define a modular type scale with named roles (display, title, heading, body, caption, mono) and use only those.

### The logo and its animation

This is the part to spend the most care on. The current mark is a stock Lucide icon and must go everywhere it appears as branding.

- Design an original mark as hand-authored SVG paths, constructed on a grid with deliberate geometry. It should express the brand concept, read clearly at 16px, work in a single colour, and not be a generic flame, a generic code bracket, or a flame inside a bracket unless you have found a construction of that idea that is genuinely new. Do not use an icon library, an image generator, or traced artwork for it.
- Deliver a system: the mark, a wordmark set with intentional letter-spacing and any custom lettering detail that ties it to the mark, a horizontal lockup, a favicon (simplified if the full mark does not hold at 16px), a maskable app icon, and an Open Graph image. Put the mark in one React component with size and variant props and use that component everywhere.
- Design the animation from the mark's own geometry: strokes drawing in, shapes assembling or resolving, something that could only belong to this logo. A scale pulse, a fade, or a spin is not a logo animation. Around 1.2 to 1.6 seconds, with considered easing, ending on the static lockup. Use it for the splash, and derive a calm looping variant for the loading screen so the two feel related. The inline pre-React loader in `index.html` should show the static mark so there is no flash of a different logo before React mounts. The splash is currently held by a fixed 2200ms timer in `App.tsx`; match the timer to your animation's length.
- Honour `prefers-reduced-motion` with a static or simple cross-fade version.
- Document the construction, clear space, minimum size and colour usage in `DESIGN.md`.

### Layout, components and data

Give each screen a composition that suits its content rather than a stack of identical cards. The result page deserves the most thought: it is a report, and it should read like one, with a clear order from verdict to evidence to action. Replace the default-looking recharts styling with a chart designed in the brand's language (custom axes, marks, labels and tooltip), or a hand-built SVG chart if that serves the data better. The API returns an emoji per category; do not let emoji be the iconography. Use one consistent icon style, and draw custom icons where a stock one would be generic.

Design every state, not only the happy path: empty, loading, error, validation, long content, disabled, focus. Check 375px, 768px and 1440px widths; the layout should feel designed at each, not merely unbroken. Full keyboard operability with visible focus, proper labels, and semantic landmarks are part of the design.

### Motion

Motion should explain something: where an element came from, what changed, what is happening. Use a small set of named durations and easings as tokens. Animate transform and opacity only. Let the score reveal be the one expressive moment on the result page and keep everything else quiet. No infinite decorative loops apart from the loading indicator. Respect reduced motion everywhere.

### Copy

Keep the voice dry, specific and confident, and keep the strings the tests depend on. Remove emoji from the page title and meta tags, and rewrite the meta description and Open Graph tags to match the brand. Tighten any microcopy that sounds generic.

### What to avoid

These are the patterns that make an interface look generated. None of them should appear:

- Purple or blue-to-purple gradients, gradient text, glows, neon, blurred colour blobs, aurora or mesh backgrounds, glassmorphism used as decoration.
- Uniform rounded cards with tinted borders or a coloured top stripe, everything centred, three identical feature cards with an icon on top.
- Emoji as icons, sparkle icons, "New" badges, pill badges on everything, uppercase tracked micro-labels used by reflex.
- Stock icon as logo, pulsing or bouncing elements, staggered fade-up on every block.
- Unmodified Tailwind default colours, default shadows, or default recharts output.
- Decoration with no connection to the concept.

## Phases

Work in this order and keep going until all of it is done. Do not stop to ask for approval between phases; the owner wants to see the finished result first. Make reasonable decisions, record them, and only stop for something that genuinely blocks progress.

0. **Orient.** Read the docs, every file in `client/src/components` and `client/src/pages`, `index.css`, `tailwind.config.js`, `index.html`, and the e2e spec. Install dependencies, run the client (`npm --prefix client run dev`, port 5173; `.claude/launch.json` has entries for client and server), and capture baseline screenshots of every screen into `client/design/before/`. The e2e spec shows how API responses are mocked; reuse that approach to view the loading and result screens without a live backend. Create the progress file.
1. **Brand direction.** Write `client/DESIGN.md`: concept, rejected directions, palette with roles and the 60-30-10 mapping, type system, spacing and radius scales, elevation model, icon style, motion principles, logo concept.
2. **Logo system and animation.** Build it, view it at 16, 32, 64 and 256px and in motion, and iterate until it holds up. Add a small temporary route or a standalone HTML file under `client/design/` that shows the mark, lockup, favicon sizes and the animation, so the owner can review the identity on its own.
3. **Foundation.** Tokens, Tailwind config, fonts, global CSS, `index.html`, favicon and icons, toaster theme.
4. **Primitives.** Buttons, inputs, switch, surfaces, badges, modal, tooltip, score ring or meter, bar, code or path text, section header. Build each once and reuse it.
5. **Screens.** Navbar and footer, home, Custom Mode modal, loading, result page and every dashboard component, 404, legal pages, error boundary, toasts, splash. Commit after each.
6. **Motion pass.** Apply the motion system consistently, including route transitions.
7. **Review and fix.** Run build, lint and e2e. Screenshot every screen at the three widths into `client/design/after/`. Then look at each screenshot as a critical outside designer would and write down what is weak: accent overuse against the 60-30-10 budget, inconsistent spacing, anything on the avoid list, anything that still looks like the old site or like a template, contrast failures, weak hierarchy. Fix what you find and re-shoot. Do at least two rounds. Check keyboard navigation and reduced motion.
8. **Hand-off.** Leave the dev server instructions and a summary at the top of `client/REDESIGN_PROGRESS.md`: the concept in two sentences, what changed, where the logo review page is, the test, build and lint results as actually observed, any test strings you changed, and anything you are not satisfied with or could not verify. Report failures and gaps plainly. Do not merge, push or deploy.

## Done means

Every screen and state listed above is redesigned in one coherent identity; the original logo system and its animation are in place everywhere, including favicon and pre-React loader; no hard-coded colours remain outside the token definitions; build, lint and e2e pass; before and after screenshots exist; `DESIGN.md` and `REDESIGN_PROGRESS.md` are current; and all of it is committed on `redesign/v3`, ready to preview.
