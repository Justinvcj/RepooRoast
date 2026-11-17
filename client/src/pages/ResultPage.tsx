import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getPageTransition } from '../utils/motion';
import { ReviewDashboard } from '../components/ReviewDashboard';
import { StaticAnalysisPanel } from '../components/StaticAnalysisPanel';
import type { ApiResponse } from '../types';
import { useLayout } from '../contexts/layoutState';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { LogoLockup } from '../components/brand';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lazy state initializer for cached data to ensure pure render without Date.now() in body
  const [responseData] = useState<ApiResponse | undefined>(() => {
    if (location.state?.reviewData) {
      return location.state.reviewData as ApiResponse;
    }
    try {
      const cached = localStorage.getItem('reporoast_last_review');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (typeof parsed?.timestamp === 'number' && Date.now() - parsed.timestamp < 86400000) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore cache parse errors
    }
    return undefined;
  });

  const { setIsNavbarVisible, setIsFooterVisible } = useLayout();
  const prefersReduced = useReducedMotion();
  const pageTransition = getPageTransition(prefersReduced);

  useEffect(() => {
    setIsNavbarVisible(false);
    setIsFooterVisible(false);
    return () => {
      setIsNavbarVisible(true);
      setIsFooterVisible(true);
    };
  }, [setIsNavbarVisible, setIsFooterVisible]);

  useEffect(() => {
    if (!responseData || !responseData.success) {
      navigate('/', { replace: true });
    }
  }, [responseData, navigate]);

  if (!responseData) return null;

  const { repo, review, analysis } = responseData;

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-background text-textPrimary pb-24 relative"
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border-hairline">
        <nav
          aria-label="Result Actions"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between"
        >
          <Link
            to="/"
            className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="RepoRoast Home"
          >
            <LogoLockup size={26} />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-textPrimary hover:text-primary transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Roast another
          </Link>
        </nav>
      </header>

      <main className="relative z-10 pt-24">
        <section aria-labelledby="repo-header-title" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="font-mono text-sm text-textSecondary mb-2">{repo.owner} /</p>
              <h1 id="repo-header-title" className="font-display text-4xl sm:text-5xl font-medium tracking-[-0.03em] leading-none text-textPrimary break-words">
                {repo.repo}
              </h1>
              {repo.description && (
                <p className="text-base text-textSecondary max-w-[60ch] mt-3 leading-relaxed">
                  {repo.description}
                </p>
              )}
              <p className="mt-4 text-sm text-textSecondary tabular-nums">
                {repo.stars.toLocaleString()} stars
                <span className="mx-2 text-border-focused" aria-hidden="true">/</span>
                {repo.forks.toLocaleString()} forks
                {repo.language && (
                  <>
                    <span className="mx-2 text-border-focused" aria-hidden="true">/</span>
                    {repo.language}
                  </>
                )}
              </p>
            </div>

            <a
              href={`https://github.com/${repo.owner}/${repo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View on GitHub: ${repo.owner}/${repo.repo}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-textPrimary border border-border-focused hover:border-ink bg-surface px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-textMuted" />
            </a>
          </div>
        </section>

        {/* Static Analysis Dashboard */}
        {analysis && <StaticAnalysisPanel analysis={analysis} />}

        {/* Detailed Review Dashboard */}
        <ReviewDashboard review={review} />
      </main>
    </motion.div>
  );
};
