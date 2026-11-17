import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Code2, GitMerge, FileText, Shield, TestTube, Zap, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getPageTransition } from '../utils/motion';

import { useRepoReview } from '../hooks/useRepoReview';
import { useCustomReview } from '../hooks/useCustomReview';
import { useLayout } from '../contexts/LayoutContext';
import { Hero } from '../components/Hero';
import { LoadingScreen } from '../components/LoadingScreen';
import { CustomModeModal } from '../components/CustomModeModal';

const CUSTOM_MODE_SESSION_KEY = 'reporoast_custom_api_key';

const features = [
  {
    name: 'Code Quality',
    description: 'We analyze readability, naming conventions, and best practices.',
    icon: Code2,
  },
  {
    name: 'Architecture',
    description: 'Evaluating project structure, modularity, and scalability.',
    icon: GitMerge,
  },
  {
    name: 'Documentation',
    description: 'Checking READMEs, inline comments, and API explanations.',
    icon: FileText,
  },
  {
    name: 'Security',
    description: 'Identifying vulnerabilities, exposed secrets, and bad patterns.',
    icon: Shield,
  },
  {
    name: 'Testing',
    description: 'Reviewing test coverage, mocked data logic, and CI/CD setup.',
    icon: TestTube,
  },
  {
    name: 'Performance',
    description: 'Finding slow loops, memory leaks, and inefficient algorithms.',
    icon: Zap,
  },
  {
    name: 'Scalability',
    description: 'Assessing if the codebase can handle 10x growth without collapsing.',
    icon: TrendingUp,
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
      className="min-h-full bg-background text-textPrimary selection:bg-primary/30 pb-32 flex flex-col relative z-10"
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

        {/* What we roast - a quiet, high-craft list instead of identical cards */}
        <section aria-labelledby="what-we-roast-title" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-border-hairline">
          <div className="mb-10">
            <h2 id="what-we-roast-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-textPrimary font-sans">
              What we roast
            </h2>
            <p className="mt-2 text-base text-textSecondary font-normal">
              Seven categories, every repo, no exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.24) }}
                className="flex items-start gap-3.5 py-5 border-t border-border-hairline"
              >
                <div className="p-2 rounded-lg bg-surface-secondary border border-border-hairline text-primary shrink-0 mt-0.5">
                  <feature.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-textPrimary tracking-tight mb-1 font-sans">
                    {feature.name}
                  </h3>
                  <p className="text-xs text-textSecondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
};
