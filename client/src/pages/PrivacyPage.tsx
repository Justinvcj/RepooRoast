import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="content-panel rounded-[2rem] p-8 md:p-12"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-textSecondary hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to RepoRoast
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-textPrimary tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-textSecondary mb-10">
          Last updated: this is a real page now, not a joke toast. Here's what we actually do with your data.
        </p>

        <div className="space-y-8 text-textSecondary leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">What we collect</h2>
            <p>
              The GitHub repository, pull request, or compare URL you submit. That's it. There are no user accounts,
              no sign-up, no email collection, and no tracking cookies anywhere on this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">What happens to it</h2>
            <p>
              The URL you submit is used to fetch public repository data from GitHub's API, and that data is sent to
              Google's Gemini API to generate your review. We only process <strong className="text-textPrimary">public</strong> repositories —
              the server explicitly rejects private repos, even ones it technically has access to.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">Custom Mode (your own API key)</h2>
            <p>
              If you paste your own Gemini API key into Custom Mode, it is used <strong className="text-textPrimary">only in your browser</strong> to
              call Google's API directly. It never reaches our servers, is never logged, and is never stored anywhere
              except optionally in your browser's <code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">sessionStorage</code> if
              you explicitly check "remember this key" — which clears itself when you close the tab.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">What we store</h2>
            <p>
              Reviews are cached in server memory, keyed by repository and commit, so re-requesting the same commit
              doesn't re-run the AI unnecessarily. This cache resets on every server restart and is never written to
              disk. Your browser also saves your most recent review in <code className="font-mono text-xs bg-background px-1.5 py-0.5 rounded">localStorage</code> so
              a refresh doesn't lose it — that stays on your device; we don't receive it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">IP addresses</h2>
            <p>
              Used transiently to enforce rate limits (to keep the service usable for everyone). Not stored
              long-term, not linked to anything else, and not sold or shared.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">Third parties</h2>
            <p>
              Repository data passes through GitHub's API and Google's Gemini API to do its job. Their own privacy
              policies govern what happens to data once it reaches them. We don't use any analytics or advertising
              trackers of our own.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-textPrimary mb-2">Changes</h2>
            <p>
              This is an independent project, not a company with a legal department. This page will be updated if
              and when what the app actually does changes — the goal is for it to always match reality.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
