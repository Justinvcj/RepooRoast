import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card level={1} className="p-8 sm:p-12 border-border-hairline shadow-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-textSecondary hover:text-primary transition-colors mb-8 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to RepoRoast</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-textPrimary tracking-tight mb-2 font-sans">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-textMuted font-mono mb-10 pb-4 border-b border-border-hairline">
            Short, readable, and free of legalese.
          </p>

          <div className="space-y-8 text-xs sm:text-sm text-textSecondary leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">What this is</h2>
              <p>
                RepoRoast is a free tool that generates an AI-written, opinionated code review of a public GitHub repository, pull request, or comparison. It's provided as-is, with no warranty of any kind — this is an independent project, not a commercial product with an SLA.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Public repos only</h2>
              <p>
                Only submit repositories you have the right to share publicly. The service already refuses to process private repositories server-side, but you're responsible for not routing around that in spirit — don't submit someone else's confidential code.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">The review is an opinion, not advice</h2>
              <p>
                The score, the "brutal" commentary, and every issue flagged come from a language model doing its best with the data it's given. It's entertaining and often useful, but it can be wrong, miss things, or flag something that isn't actually a problem for your situation. Treat it as a fast second opinion, not professional, legal, or security advice — verify anything important before acting on it.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Custom Mode and your own API key</h2>
              <p>
                If you use Custom Mode with your own Gemini API key, any usage costs are between you and your API provider — RepoRoast never sees that key and has no visibility into or responsibility for your provider billing.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Fair use</h2>
              <p>
                Rate limits exist to keep this usable and affordable for everyone. Please don't try to script around them or hammer the service — that just makes it worse for the next person.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">No guarantee of availability</h2>
              <p>
                This runs on free/low-cost infrastructure and depends on third-party APIs (GitHub, Google Gemini) that can rate-limit or go down independently of anything we control. Expect occasional hiccups.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-textPrimary mb-2 font-sans">Questions or issues</h2>
              <p>
                Open an issue on the{' '}
                <a
                  href="https://github.com/Justinvcj/RepooRoast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-mono"
                >
                  GitHub repository
                </a>.
              </p>
            </section>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
