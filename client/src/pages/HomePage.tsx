import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, useReducedMotion } from 'framer-motion';
import { getPageTransition } from '../utils/motion';

import { useRepoReview } from '../hooks/useRepoReview';
import { useCustomReview } from '../hooks/useCustomReview';
import { useLayout } from '../contexts/layoutState';
import { Hero } from '../components/Hero';
import { LoadingScreen } from '../components/LoadingScreen';
import { CustomModeModal } from '../components/CustomModeModal';

const CUSTOM_MODE_SESSION_KEY = 'reporoast_custom_api_key';

const features = [
  {
    name: 'Code Quality',
    description: 'We analyze readability, naming conventions, and best practices.',
  },
  {
    name: 'Architecture',
    description: 'Evaluating project structure, modularity, and scalability.',
  },
  {
    name: 'Documentation',
    description: 'Checking READMEs, inline comments, and API explanations.',
  },
  {
    name: 'Security',
    description: 'Identifying vulnerabilities, exposed secrets, and bad patterns.',
  },
  {
    name: 'Testing',
    description: 'Reviewing test coverage, mocked data logic, and CI/CD setup.',
  },
  {
    name: 'Performance',
    description: 'Finding slow loops, memory leaks, and inefficient algorithms.',
  },
  {
    name: 'Scalability',
    description: 'Assessing if the codebase can handle 10x growth without collapsing.',
  },
];

export const HomePage: React.FC = () => {
  const defaultReview = useRepoReview();
  const customReview = useCustomReview();
  const navigate = useNavigate();

  // Lazy initializer to read persisted key from sessionStorage without setState-in-effect
  const [customApiKey, setCustomApiKey] = useState(() => {
    return sessionStorage.getItem(CUSTOM_MODE_SESSION_KEY) || '';
  });
  const [customModeEnabled, setCustomModeEnabled] = useState(() => {
    return Boolean(sessionStorage.getItem(CUSTOM_MODE_SESSION_KEY));
  });
  const [rememberKey, setRememberKey] = useState(() => {
    return Boolean(sessionStorage.getItem(CUSTOM_MODE_SESSION_KEY));
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveSettings = (enabled: boolean, apiKey: string, remember: boolean) => {
    setCustomModeEnabled(enabled);
    setCustomApiKey(apiKey);
    setRememberKey(remember);
    if (remember && apiKey) {
      sessionStorage.setItem(CUSTOM_MODE_SESSION_KEY, apiKey);
    } else {
      sessionStorage.removeItem(CUSTOM_MODE_SESSION_KEY);
    }
  };

  const handleAnalyze = (repoUrl: string) => {
    if (customModeEnabled) {
      customReview.analyzeRepo(repoUrl, customApiKey);
    } else {
      defaultReview.analyzeRepo(repoUrl);
    }
  };

  const { status, data, error, stage } = customModeEnabled ? customReview : defaultReview;

  // Handle successful review generation
  useEffect(() => {
    if (status === 'success' && data) {
      navigate('/result', { state: { reviewData: data } });
    }
  }, [status, data, navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const { setIsNavbarVisible, setIsFooterVisible } = useLayout();

  useEffect(() => {
    if (status === 'loading') {
      setIsNavbarVisible(false);
      setIsFooterVisible(false);
    } else {
      setIsNavbarVisible(true);
      setIsFooterVisible(true);
    }
    return () => {
      setIsNavbarVisible(true);
      setIsFooterVisible(true);
    };
  }, [status, setIsNavbarVisible, setIsFooterVisible]);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const prefersReduced = useReducedMotion();
  const pageTransition = getPageTransition(prefersReduced);

  if (status === 'loading') {
    return <LoadingScreen stage={stage} mode={customModeEnabled ? 'custom' : 'default'} />;
  }

  return (
    <motion.div
      {...pageTransition}
      className="min-h-full bg-background text-textPrimary pb-16 flex flex-col relative z-10"
    >
      <main className="relative z-10">
        <Hero
          onAnalyzeRepo={handleAnalyze}
          isLoading={false}
          customModeEnabled={customModeEnabled}
          onOpenCustomMode={() => setIsSettingsOpen(true)}
        />

        <CustomModeModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          enabled={customModeEnabled}
          apiKey={customApiKey}
          rememberKey={rememberKey}
          onSave={handleSaveSettings}
        />

        <section aria-labelledby="what-we-roast-title" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-border-hairline">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-16">
            <div>
              <h2 id="what-we-roast-title" className="font-display text-3xl font-semibold tracking-tight text-textPrimary">
                What gets marked
              </h2>
              <p className="mt-2 text-base text-textSecondary max-w-[32ch]">
                Seven categories on every repo, each scored out of 100.
              </p>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
              {features.map((feature) => (
                <div key={feature.name} className="py-4 border-t border-border-hairline first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
                  <dt className="font-display text-lg font-semibold tracking-tight text-textPrimary">{feature.name}</dt>
                  <dd className="mt-1 text-[15px] text-textSecondary leading-relaxed">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
