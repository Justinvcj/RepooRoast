import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui';
import { getPageTransition } from '../utils/motion';

export const PrivacyPage: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const pageTransition = getPageTransition(prefersReduced);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <motion.div
        {...pageTransition}
      >
        <Card level={1} className="p-8 sm:p-12 border-border-hairline">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-primary transition-colors mb-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to RepoRoast</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-textPrimary tracking-tight mb-2 font-sans">
            Privacy Policy
          </h1>
          <p className="text-sm text-textMuted mb-10 pb-4 border-b border-border-hairline">
            Measured integrity: here is what we actually do with your data.
          </p>

          <div className="space-y-8 text-xs sm:text-sm text-textSecondary leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">What we collect</h2>
              <p>
                The GitHub repository, pull request, or compare URL you submit. That's it. There are no user accounts, no sign-up, no email collection, and no tracking cookies anywhere on this site.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">What happens to it</h2>
              <p>
                The URL you submit is used to fetch public repository data from GitHub's API, and that data is sent to Google's Gemini API to generate your review. We only process <strong className="text-textPrimary font-semibold">public</strong> repositories — the server explicitly rejects private repos, even ones it technically has access to.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Custom Mode (your own API key)</h2>
              <p>
                If you paste your own Gemini API key into Custom Mode, it is used <strong className="text-textPrimary font-semibold">only in your browser</strong> to call Google's API directly. It never reaches our servers, is never logged, and is never stored anywhere except optionally in your browser's <code className="font-mono text-xs bg-surface-secondary px-1.5 py-0.5 rounded border border-border-hairline text-textPrimary">sessionStorage</code> if you explicitly check "remember this key" — which clears itself when you close the tab.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">What we store</h2>
              <p>
                Reviews are cached in server memory, keyed by repository and commit, so re-requesting the same commit doesn't re-run the AI unnecessarily. This cache resets on every server restart and is never written to disk. Your browser also saves your most recent review in <code className="font-mono text-xs bg-surface-secondary px-1.5 py-0.5 rounded border border-border-hairline text-textPrimary">localStorage</code> so a refresh doesn't lose it — that stays on your device; we don't receive it.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">IP addresses</h2>
              <p>
                Used transiently to enforce rate limits (to keep the service usable for everyone). Not stored long-term, not linked to anything else, and not sold or shared.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Third parties</h2>
              <p>
                Repository data passes through GitHub's API and Google's Gemini API to do its job. Their own privacy policies govern what happens to data once it reaches them. We don't use any analytics or advertising trackers of our own.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Changes</h2>
              <p>
                This is an independent project, not a company with a legal department. This page will be updated if and when what the app actually does changes — the goal is for it to always match reality.
              </p>
            </section>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
