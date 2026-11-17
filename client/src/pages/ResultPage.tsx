import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReviewDashboard } from '../components/ReviewDashboard';
import { StaticAnalysisPanel } from '../components/StaticAnalysisPanel';
import type { ApiResponse } from '../types';
import { useLayout } from '../contexts/LayoutContext';
import { Github, ExternalLink, ArrowLeft, Star, GitFork, Code } from 'lucide-react';
import { LogoLockup } from '../components/brand';
import { Button } from '../components/ui';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen supports-[height:100dvh]:min-h-[100dvh] bg-background text-textPrimary selection:bg-primary/30 pb-24 relative"
    >
      {/* Floating Action Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
          <nav
            aria-label="Result Actions"
            className="pointer-events-auto bg-surface-secondary/85 backdrop-blur-md border border-border-hairline shadow-lg shadow-black/40 rounded-full px-5 py-2.5 flex items-center justify-between gap-6 sm:gap-12 w-full max-w-7xl transition-all"
          >
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md transition-opacity hover:opacity-90"
              aria-label="RepoRoast Home"
            >
              <LogoLockup size={26} />
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/" tabIndex={-1} className="inline-flex">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Roast Another
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <main className="relative z-10 pt-28">
        {/* Repo Header Section */}
        <section aria-labelledby="repo-header-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-hairline"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-textMuted font-mono text-xs">
                <Github className="w-4 h-4 text-textSecondary" />
                <span className="text-textSecondary font-medium">{repo.owner}</span>
                <span className="text-border-hairline">/</span>
              </div>
              <h1 id="repo-header-title" className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-textPrimary font-sans">
                {repo.repo}
              </h1>
              {repo.description && (
                <p className="text-sm sm:text-base text-textSecondary font-normal max-w-3xl mt-1 leading-relaxed">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-5 mt-4 text-xs font-mono text-textMuted">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-data-warning" />
                  <span className="tabular-nums font-medium text-textSecondary">{repo.stars.toLocaleString()}</span>
                  <span>stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-textMuted" />
                  <span className="tabular-nums font-medium text-textSecondary">{repo.forks.toLocaleString()}</span>
                  <span>forks</span>
                </div>
                {repo.language && (
                  <div className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-primary" />
                    <span className="text-textSecondary font-medium">{repo.language}</span>
                  </div>
                )}
              </div>
            </div>

            <a
              href={`https://github.com/${repo.owner}/${repo.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${repo.owner}/${repo.repo} on GitHub`}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary hover:text-primary-hover bg-primary/10 border border-primary/25 hover:bg-primary/15 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </section>

        {/* Static Analysis Dashboard */}
        {analysis && <StaticAnalysisPanel analysis={analysis} />}

        {/* Detailed Review Dashboard */}
        <ReviewDashboard review={review} />
      </main>
    </motion.div>
  );
};
