import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '../contexts/layoutState';
import { LogoMark, LogoWordmark, LogoLockup, LogoAnimation } from '../components/brand';
import {
  Button,
  Input,
  Switch,
  Card,
  Badge,
  TerminalTag,
  Modal,
  ScoreRing,
  ScoreBar,
  CodeBlock,
  FilePath,
  Tooltip,
} from '../components/ui';
import { Search, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DesignReviewPage: React.FC = () => {
  const { setIsNavbarVisible, setIsFooterVisible } = useLayout();

  // Active view tab: 'brand' or 'primitives'
  const [activeTab, setActiveTab] = useState<'brand' | 'primitives'>('primitives');

  // Brand interactive control states
  const [replayKey, setReplayKey] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMonochrome, setIsMonochrome] = useState<boolean>(false);
  const [simulatedReducedMotion, setSimulatedReducedMotion] = useState<boolean>(false);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(false);

  // Primitives interactive demo states
  const [switchA, setSwitchA] = useState<boolean>(true);
  const [switchB, setSwitchB] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('https://github.com/facebook/react');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [scoreValue, setScoreValue] = useState<number>(78);

  // Clean studio layout: hide floating nav and footer on mount, restore on unmount
  useEffect(() => {
    setIsNavbarVisible(false);
    setIsFooterVisible(false);
    return () => {
      setIsNavbarVisible(true);
      setIsFooterVisible(true);
    };
  }, [setIsNavbarVisible, setIsFooterVisible]);

  const sizes = [16, 24, 32, 48, 64, 128, 256];

  return (
    <main className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-[#0B0D14] text-[#EEF0F5] p-6 md:p-12 font-sans selection:bg-[#FF6B3D]/30">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <header className="border-b border-[#1E222D] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A3A9B8] hover:text-[#FF6B3D] transition-colors mb-2"
            >
              ← Back to App
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Design system and visual review
            </h1>
            <p className="text-sm text-[#A3A9B8] mt-1">
              Deterministic verification suite for the RepoRoast Night Review visual system and UI primitives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button"
              onClick={() => setActiveTab('primitives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'primitives'
                  ? 'bg-primary text-dominant font-semibold shadow-sm'
                  : 'bg-surface-secondary text-textSecondary hover:text-textPrimary border border-border-hairline'
              }`}
            >
              UI primitives
            </button>
            <button type="button"
              onClick={() => setActiveTab('brand')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'brand'
                  ? 'bg-primary text-dominant font-semibold shadow-sm'
                  : 'bg-surface-secondary text-textSecondary hover:text-textPrimary border border-border-hairline'
              }`}
            >
              Brand and logo
            </button>
          </div>
        </header>

        {activeTab === 'primitives' ? (
          /* ========================================================================= */
          /* UI PRIMITIVES SHOWCASE (Phase 4)                                          */
          /* ========================================================================= */
          <div className="space-y-12">
            {/* Buttons Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222D] pb-2">
                <h2 className="text-xl font-semibold tracking-tight">1. Buttons and triggers</h2>
                <span className="text-xs font-mono text-[#A3A9B8]">&lt;100ms tactile feedback • active:scale-[0.98]</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card level={1} className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-mono text-[#A3A9B8]">Primary (6.02:1 Contrast)</span>
                  <div className="flex flex-col gap-2">
                    <Button variant="primary" size="lg" fullWidth>Large Primary</Button>
                    <Button variant="primary" size="md" rightIcon={<Search className="w-4 h-4" />}>
                      Medium Accent
                    </Button>
                    <Button variant="primary" size="sm">Small Primary</Button>
                  </div>
                </Card>

                <Card level={1} className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-mono text-[#A3A9B8]">Secondary & Ghost</span>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" size="md">Secondary Action</Button>
                    <Button variant="ghost" size="md">Ghost Trigger</Button>
                    <div className="flex items-center gap-2">
                      <Button variant="icon" size="sm" aria-label="Search"><Search /></Button>
                      <Button variant="icon" size="md" aria-label="Alert"><AlertTriangle /></Button>
                      <Button variant="icon" size="lg" aria-label="Shield"><ShieldCheck /></Button>
                    </div>
                  </div>
                </Card>

                <Card level={1} className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-mono text-[#A3A9B8]">States & Interactions</span>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      loading={buttonLoading}
                      onClick={() => {
                        setButtonLoading(true);
                        setTimeout(() => setButtonLoading(false), 2000);
                      }}
                    >
                      {buttonLoading ? 'Analyzing...' : 'Click for Loading State'}
                    </Button>
                    <Button variant="primary" disabled>Primary Disabled</Button>
                    <Button variant="secondary" disabled>Secondary Disabled</Button>
                  </div>
                </Card>

                <Card level={1} className="p-5 flex flex-col gap-3">
                  <span className="text-xs font-mono text-[#A3A9B8]">Interactive Modal Trigger</span>
                  <p className="text-xs text-textSecondary">
                    Accessible focus-trapping dialog adhering to WCAG 2.1 specifications.
                  </p>
                  <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                    Open Modal Dialog
                  </Button>
                </Card>
              </div>
            </section>

            {/* Inputs & Form Controls */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222D] pb-2">
                <h2 className="text-xl font-semibold tracking-tight">2. Inputs and switches</h2>
                <span className="text-xs font-mono text-[#A3A9B8]">Tabular numbers • Explicit focus rings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card level={1} className="p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-textPrimary">Input variants</h3>
                  <Input
                    label="GitHub Repository URL"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    leftIcon={<Search className="w-4 h-4 text-textMuted" />}
                    hint="Enter public or accessible repository"
                    mono
                  />
                  <Input
                    label="Invalid Validation State"
                    defaultValue="not-a-valid-url"
                    error="Repository URL must match https://github.com/owner/repo format"
                  />
                  <Input
                    label="Disabled Field"
                    defaultValue="Read-only analysis token"
                    disabled
                  />
                </Card>

                <Card level={1} className="p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-textPrimary">Accessible switches</h3>
                  <Switch
                    label="Bring Your Own Key (Custom Mode)"
                    description="Run static AST analysis with direct Gemini client calls"
                    checked={switchA}
                    onChange={setSwitchA}
                  />
                  <div className="border-t border-border-hairline pt-4">
                    <Switch
                      label="Store API Key Locally"
                      description="Persist encrypted token across browser sessions"
                      checked={switchB}
                      onChange={setSwitchB}
                    />
                  </div>
                  <div className="border-t border-border-hairline pt-4">
                    <Switch
                      label="Disabled Configuration Toggle"
                      description="Feature locked during current run mode"
                      checked={false}
                      onChange={() => {}}
                      disabled
                    />
                  </div>
                </Card>
              </div>
            </section>

            {/* Badges, Terminal Tags & File Paths */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222D] pb-2">
                <h2 className="text-xl font-semibold tracking-tight">3. Badges, tags and file paths</h2>
                <span className="text-xs font-mono text-[#A3A9B8]">Geist Mono • Monospace telemetry</span>
              </div>

              <Card level={1} className="p-6 space-y-6">
                <div>
                  <div className="text-xs font-mono text-[#A3A9B8] mb-3">Semantic Severity Badges</div>
                  <div className="flex flex-wrap gap-2.5">
                    <Badge variant="critical">[CRITICAL: P0]</Badge>
                    <Badge variant="warning">[HIGH: P1]</Badge>
                    <Badge variant="flawed">[MEDIUM: P2]</Badge>
                    <Badge variant="success">[PASSED: CLEAN]</Badge>
                    <Badge variant="accent">[TELEMETRY]</Badge>
                    <Badge variant="default">[AST-NODE]</Badge>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-[#A3A9B8] mb-3">Terminal Tags & File Path Display</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <TerminalTag variant="accent">AST_WALK</TerminalTag>
                    <TerminalTag variant="warning">DEPRECATED_API</TerminalTag>
                    <FilePath path="client/src/components/ReviewDashboard.tsx" lineNumber={142} />
                    <FilePath path="server/src/services/treeSitter.ts" lineNumber={88} />
                  </div>
                </div>
              </Card>
            </section>

            {/* Score Telemetry (Ring & Bar) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222D] pb-2">
                <h2 className="text-xl font-semibold tracking-tight">4. Score meters</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#A3A9B8]">Adjust Score:</span>
                  <input
                    type="range"
                    aria-label="Adjust score"
                    min="0"
                    max="100"
                    value={scoreValue}
                    onChange={(e) => setScoreValue(Number(e.target.value))}
                    className="w-32 accent-[#FF6B3D]"
                  />
                  <span className="text-xs font-mono font-semibold w-8 text-primary">{scoreValue}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card level={1} className="p-6 flex flex-col items-center justify-center gap-6">
                  <span className="text-xs font-mono text-[#A3A9B8]">ScoreRing Sizes & Color Mapping</span>
                  <div className="flex items-center gap-8 flex-wrap justify-center">
                    <ScoreRing score={scoreValue} size="sm" />
                    <ScoreRing score={scoreValue} size="md" />
                    <ScoreRing score={scoreValue} size="lg" />
                  </div>
                </Card>

                <Card level={1} className="p-6 space-y-4 justify-center flex flex-col">
                  <span className="text-xs font-mono text-[#A3A9B8]">ScoreBar Metric Progression</span>
                  <ScoreBar score={scoreValue} label="Overall Code Health" />
                  <ScoreBar score={92} label="Architecture & Modularity" />
                  <ScoreBar score={68} label="Type Safety & Soundness" />
                  <ScoreBar score={35} label="Security & Sanitization" />
                  <ScoreBar score={18} label="Test Coverage & Reliability" />
                </Card>
              </div>
            </section>

            {/* Code Display & Tooltips */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E222D] pb-2">
                <h2 className="text-xl font-semibold tracking-tight">5. Code display and tooltips</h2>
                <span className="text-xs font-mono text-[#A3A9B8]">One-click copy • Syntax background</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CodeBlock
                    fileName="src/roast/analyzer.ts"
                    language="typescript"
                    code={`// Tree-sitter AST validation pass\nexport function validateCaliper(score: number): HeatReport {\n  if (score < 40) {\n    return { verdict: 'BROKEN_AST', level: 'CRITICAL' };\n  }\n  return { verdict: 'CLEAN_SYNTAX', level: 'OPTIMAL' };\n}`}
                  />
                </div>

                <Card level={1} className="p-6 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-textPrimary mb-2">Tooltip positions</h3>
                    <p className="text-xs text-textSecondary mb-4">
                      Hover to test fluid spring tooltips with smart offsets.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Tooltip content="WCAG 2.1 AA Verified Contrast">
                        <Button variant="secondary" size="sm" fullWidth>Hover Top Tooltip</Button>
                      </Tooltip>
                      <Tooltip content="Latency &lt; 100ms direct manipulation" position="bottom">
                        <Button variant="secondary" size="sm" fullWidth>Hover Bottom Tooltip</Button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="p-3 bg-surface-secondary rounded border border-border-hairline text-xs font-mono text-textMuted">
                    prefers-reduced-motion: Auto-detected
                  </div>
                </Card>
              </div>
            </section>
          </div>
        ) : (
          /* ========================================================================= */
          /* BRAND IDENTITY & LOGO REVIEW (Phase 2)                                    */
          /* ========================================================================= */
          <div className="space-y-12">
            {/* Studio Controls Bar */}
            <section className="bg-[#11141C] border border-[#1E222D] rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button"
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF6B3D] text-[#0B0D14] hover:bg-[#E84518] transition-colors shadow-sm"
                >
                  Replay 1.4s Assembly
                </button>
                <button type="button"
                  onClick={() => setIsLooping((l) => !l)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    isLooping
                      ? 'bg-[#1A1E28] text-[#FF6B3D] border-[#FF6B3D]/40'
                      : 'bg-[#0B0D14] text-[#A3A9B8] border-[#1E222D] hover:text-[#EEF0F5]'
                  }`}
                >
                  {isLooping ? 'Looping: Active (2.4s)' : 'Toggle Calm Loop'}
                </button>
                <button type="button"
                  onClick={() => setIsMonochrome((m) => !m)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    isMonochrome
                      ? 'bg-[#1A1E28] text-[#FF6B3D] border-[#FF6B3D]/40'
                      : 'bg-[#0B0D14] text-[#A3A9B8] border-[#1E222D] hover:text-[#EEF0F5]'
                  }`}
                >
                  {isMonochrome ? 'Monochrome: ON' : 'Toggle Monochrome'}
                </button>
                <button type="button"
                  onClick={() => setSimulatedReducedMotion((r) => !r)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    simulatedReducedMotion
                      ? 'bg-[#1A1E28] text-[#FF6B3D] border-[#FF6B3D]/40'
                      : 'bg-[#0B0D14] text-[#A3A9B8] border-[#1E222D] hover:text-[#EEF0F5]'
                  }`}
                >
                  {simulatedReducedMotion ? 'Reduced Motion: ON' : 'Simulate Reduced Motion'}
                </button>
                <button type="button"
                  onClick={() => setShowGridOverlay((g) => !g)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    showGridOverlay
                      ? 'bg-[#1A1E28] text-[#FF6B3D] border-[#FF6B3D]/40'
                      : 'bg-[#0B0D14] text-[#A3A9B8] border-[#1E222D] hover:text-[#EEF0F5]'
                  }`}
                >
                  {showGridOverlay ? 'Grid: Visible' : 'Toggle 32x32 Grid'}
                </button>
              </div>
              <div className="text-xs font-mono text-[#A3A9B8]">
                Replays: {replayKey}
              </div>
            </section>

            {/* Live Animation & Master Lockup */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Master lockup and animation</h2>
                <span className="text-xs font-mono text-[#A3A9B8]">Size: 48px</span>
              </div>
              <div className="relative bg-[#11141C] border border-[#1E222D] rounded-lg p-12 flex items-center justify-center min-h-[180px] overflow-hidden">
                {showGridOverlay && (
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#A3A9B8_1px,transparent_1px)] [background-size:16px_16px]" />
                )}
                <div key={replayKey}>
                  <LogoAnimation
                    size={48}
                    monochrome={isMonochrome}
                    looping={isLooping}
                    showWordmark={true}
                    reducedMotion={simulatedReducedMotion}
                  />
                </div>
              </div>
            </section>

            {/* Scale & Rendering Matrix */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Pixel scale, 16px to 256px</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {sizes.map((s) => (
                  <div
                    key={s}
                    className="bg-[#11141C] border border-[#1E222D] rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] relative group"
                  >
                    {showGridOverlay && (
                      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#A3A9B8_1px,transparent_1px)] [background-size:8px_8px]" />
                    )}
                    <div className="flex-1 flex items-center justify-center">
                      <LogoMark
                        size={s}
                        monochrome={isMonochrome}
                        looping={isLooping}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-xs font-mono font-semibold text-[#EEF0F5]">{s}px</div>
                      <div className="text-[10px] font-mono text-[#A3A9B8]">
                        {s <= 18 ? 'Integer Snapped' : `${s / 32}x Master`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Surface Contrast Matrix */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Surface contrast</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0B0D14] border border-[#1E222D] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
                  <div className="text-xs font-mono text-[#A3A9B8]">
                    Obsidian Canvas (#0B0D14)
                    <div className="text-[10px] text-[#10B981]">17.34:1 contrast</div>
                  </div>
                </div>

                <div className="bg-[#11141C] border border-[#1E222D] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
                  <div className="text-xs font-mono text-[#A3A9B8]">
                    Card surface (#11141C)
                    <div className="text-[10px] text-[#10B981]">15.82:1 contrast</div>
                  </div>
                </div>

                <div className="bg-[#11141C] border border-[#E2E8F0] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center text-[#0B0D14]">
                  <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
                  <div className="text-xs font-mono text-[#838BA0]">
                    Pure Light Surface (#11141C)
                    <div className="text-[10px] text-[#10B981]">Monochrome Inversion</div>
                  </div>
                </div>

                <div className="bg-[#000000] border border-[#1E222D] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
                  <div className="text-xs font-mono text-[#A3A9B8]">
                    Terminal Black (#000000)
                    <div className="text-[10px] text-[#10B981]">Single-Color Cutout</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wordmark Kerning & Anatomy */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Type anatomy and kerning</h2>
              <div className="bg-[#11141C] border border-[#1E222D] rounded-xl p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-baseline gap-6 border-b border-[#1E222D] pb-6">
                  <LogoWordmark size={64} monochrome={isMonochrome} />
                  <div className="text-xs font-mono text-[#A3A9B8] space-y-1">
                    <div>Font: Plus Jakarta Sans / system-ui</div>
                    <div>Repo: Medium (500) — #EEF0F5</div>
                    <div>Roast: Extrabold (800) — #FF6B3D</div>
                    <div>Letter-Spacing: -0.03em</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-[#0B0D14] rounded border border-[#1E222D]">
                    <div className="text-[#FF6B3D] font-semibold">Lockup Gap</div>
                    <div className="text-[#A3A9B8]">0.375x mark size (12px @ 32px)</div>
                  </div>
                  <div className="p-3 bg-[#0B0D14] rounded border border-[#1E222D]">
                    <div className="text-[#FF6B3D] font-semibold">Font Size Ratio</div>
                    <div className="text-[#A3A9B8]">0.625x mark size (20px @ 32px)</div>
                  </div>
                  <div className="p-3 bg-[#0B0D14] rounded border border-[#1E222D]">
                    <div className="text-[#FF6B3D] font-semibold">Clear Space Envelope</div>
                    <div className="text-[#A3A9B8]">0.5x mark width on all 4 sides</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Modal Dialog Interactive Inspection */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Custom Review Mode [BYOK]"
          description="Direct client-side AST inspection using user-supplied Gemini API token."
        >
          <div className="space-y-4">
            <Input
              label="Gemini API Key"
              placeholder="AIzaSy..."
              type="password"
              mono
              hint="Your key never leaves your browser session"
            />
            <Switch
              label="Remember API Key"
              description="Keep key saved in sessionStorage during this session"
              checked={switchB}
              onChange={setSwitchB}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-border-hairline">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>Save Settings</Button>
            </div>
          </div>
        </Modal>

        {/* Static Companion Preview Link */}
        <footer className="text-center pt-8 border-t border-[#1E222D] text-xs text-[#A3A9B8]">
          Zero-dependency offline preview available at{' '}
          <code className="text-[#FF6B3D]">client/design/logo-preview.html</code>.
        </footer>
      </div>
    </main>
  );
};
