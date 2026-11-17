import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { LogoMark, LogoWordmark, LogoLockup, LogoAnimation } from '../components/brand';

export const DesignReviewPage: React.FC = () => {
  const { setIsNavbarVisible, setIsFooterVisible } = useLayout();

  // Interactive control states
  const [replayKey, setReplayKey] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMonochrome, setIsMonochrome] = useState<boolean>(false);
  const [simulatedReducedMotion, setSimulatedReducedMotion] = useState<boolean>(false);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#0C0E12] text-[#F0F3F6] p-6 md:p-12 font-sans selection:bg-[#FF5426]/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <header className="border-b border-[#222733] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#949CA6] hover:text-[#FF5426] transition-colors mb-2"
            >
              ← Back to App
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Brand Identity & Logo Review
            </h1>
            <p className="text-sm text-[#949CA6] mt-1">
              Deterministic verification suite for the RepoRoast Caliper & Ember visual system.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#FF5426]/10 text-[#FF5426] border border-[#FF5426]/20">
              MILESTONE 1 REVIEW
            </span>
          </div>
        </header>

        {/* Studio Controls Bar */}
        <section className="bg-[#161920] border border-[#222733] rounded-xl p-4 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setReplayKey((k) => k + 1)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5426] text-[#0C0E12] hover:bg-[#E84518] transition-colors shadow-sm"
            >
              Replay 1.4s Assembly
            </button>
            <button
              onClick={() => setIsLooping((l) => !l)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isLooping
                  ? 'bg-[#1F242E] text-[#FF5426] border-[#FF5426]/40'
                  : 'bg-[#0C0E12] text-[#949CA6] border-[#222733] hover:text-[#F0F3F6]'
              }`}
            >
              {isLooping ? 'Looping: Active (2.4s)' : 'Toggle Calm Loop'}
            </button>
            <button
              onClick={() => setIsMonochrome((m) => !m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                isMonochrome
                  ? 'bg-[#1F242E] text-[#FF5426] border-[#FF5426]/40'
                  : 'bg-[#0C0E12] text-[#949CA6] border-[#222733] hover:text-[#F0F3F6]'
              }`}
            >
              {isMonochrome ? 'Monochrome: ON' : 'Toggle Monochrome'}
            </button>
            <button
              onClick={() => setSimulatedReducedMotion((r) => !r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                simulatedReducedMotion
                  ? 'bg-[#1F242E] text-[#FF5426] border-[#FF5426]/40'
                  : 'bg-[#0C0E12] text-[#949CA6] border-[#222733] hover:text-[#F0F3F6]'
              }`}
            >
              {simulatedReducedMotion ? 'Reduced Motion: ON' : 'Simulate Reduced Motion'}
            </button>
            <button
              onClick={() => setShowGridOverlay((g) => !g)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                showGridOverlay
                  ? 'bg-[#1F242E] text-[#FF5426] border-[#FF5426]/40'
                  : 'bg-[#0C0E12] text-[#949CA6] border-[#222733] hover:text-[#F0F3F6]'
              }`}
            >
              {showGridOverlay ? 'Grid: Visible' : 'Toggle 32x32 Grid'}
            </button>
          </div>
          <div className="text-xs font-mono text-[#949CA6]">
            Replays: {replayKey}
          </div>
        </section>

        {/* Live Animation & Master Lockup */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Active Master Lockup & Choreography</h2>
            <span className="text-xs font-mono text-[#949CA6]">Size: 48px</span>
          </div>
          <div className="relative bg-[#161920] border border-[#222733] rounded-2xl p-12 flex items-center justify-center min-h-[180px] overflow-hidden">
            {showGridOverlay && (
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#949CA6_1px,transparent_1px)] [background-size:16px_16px]" />
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
          <h2 className="text-xl font-bold tracking-tight">Pixel Scale Matrix (16px to 256px)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {sizes.map((s) => (
              <div
                key={s}
                className="bg-[#161920] border border-[#222733] rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] relative group"
              >
                {showGridOverlay && (
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#949CA6_1px,transparent_1px)] [background-size:8px_8px]" />
                )}
                <div className="flex-1 flex items-center justify-center">
                  <LogoMark
                    size={s}
                    monochrome={isMonochrome}
                    looping={isLooping}
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-xs font-mono font-bold text-[#F0F3F6]">{s}px</div>
                  <div className="text-[10px] font-mono text-[#949CA6]">
                    {s <= 18 ? 'Integer Snapped' : `${s / 32}x Master`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Surface Contrast Matrix */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Surface Contrast Invariance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Obsidian */}
            <div className="bg-[#0C0E12] border border-[#222733] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
              <div className="text-xs font-mono text-[#949CA6]">
                Obsidian Canvas (#0C0E12)
                <div className="text-[10px] text-[#10B981]">17.34:1 contrast</div>
              </div>
            </div>

            {/* Surface */}
            <div className="bg-[#161920] border border-[#222733] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
              <div className="text-xs font-mono text-[#949CA6]">
                Thermal Slate Panel (#161920)
                <div className="text-[10px] text-[#10B981]">15.82:1 contrast</div>
              </div>
            </div>

            {/* Pure White */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center text-[#0C0E12]">
              <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
              <div className="text-xs font-mono text-[#646E7E]">
                Pure Light Surface (#FFFFFF)
                <div className="text-[10px] text-[#10B981]">Monochrome Inversion</div>
              </div>
            </div>

            {/* Pure Black */}
            <div className="bg-[#000000] border border-[#222733] rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
              <LogoLockup size={32} monochrome={isMonochrome} looping={isLooping} />
              <div className="text-xs font-mono text-[#949CA6]">
                Terminal Black (#000000)
                <div className="text-[10px] text-[#10B981]">Single-Color Cutout</div>
              </div>
            </div>
          </div>
        </section>

        {/* Wordmark Kerning & Anatomy */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Typographic Anatomy & Kerning</h2>
          <div className="bg-[#161920] border border-[#222733] rounded-xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline gap-6 border-b border-[#222733] pb-6">
              <LogoWordmark size={64} monochrome={isMonochrome} />
              <div className="text-xs font-mono text-[#949CA6] space-y-1">
                <div>Font: Plus Jakarta Sans / system-ui</div>
                <div>Repo: Medium (500) — #F0F3F6</div>
                <div>Roast: Extrabold (800) — #FF5426</div>
                <div>Letter-Spacing: -0.03em</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0C0E12] rounded border border-[#222733]">
                <div className="text-[#FF5426] font-bold">Lockup Gap</div>
                <div className="text-[#949CA6]">0.375x mark size (12px @ 32px)</div>
              </div>
              <div className="p-3 bg-[#0C0E12] rounded border border-[#222733]">
                <div className="text-[#FF5426] font-bold">Font Size Ratio</div>
                <div className="text-[#949CA6]">0.625x mark size (20px @ 32px)</div>
              </div>
              <div className="p-3 bg-[#0C0E12] rounded border border-[#222733]">
                <div className="text-[#FF5426] font-bold">Clear Space Envelope</div>
                <div className="text-[#949CA6]">0.5x mark width on all 4 sides</div>
              </div>
            </div>
          </div>
        </section>

        {/* Static Companion Preview Link */}
        <footer className="text-center pt-8 border-t border-[#222733] text-xs text-[#949CA6]">
          Zero-dependency offline preview available at{' '}
          <code className="text-[#FF5426]">client/design/logo-preview.html</code>.
        </footer>
      </div>
    </div>
  );
};
