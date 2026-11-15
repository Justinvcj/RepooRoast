import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Code2, GitMerge, FileText, Shield, TestTube, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { useRepoReview } from '../hooks/useRepoReview';
import { useCustomReview } from '../hooks/useCustomReview';
import { useLayout } from '../contexts/LayoutContext';
import { Hero } from '../components/Hero';
import { LoadingScreen } from '../components/LoadingScreen';
import { CustomModeModal } from '../components/CustomModeModal';
import Lightfall from '../components/Lightfall';

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

  const [customModeEnabled, setCustomModeEnabled] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [rememberKey, setRememberKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // A remembered key only ever lives in sessionStorage (cleared when the tab
  // closes), never localStorage -- see CustomModeModal's trust statement.
  useEffect(() => {
    const saved = sessionStorage.getItem(CUSTOM_MODE_SESSION_KEY);
    if (saved) {
      setCustomApiKey(saved);
      setCustomModeEnabled(true);
      setRememberKey(true);
    }
  }, []);

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
    // Cleanup function to ensure they are visible if component unmounts
    return () => {
      setIsNavbarVisible(true);
      setIsFooterVisible(true);
    };
  }, [status, setIsNavbarVisible, setIsFooterVisible]);

  // Force scroll to top on mount (e.g. page refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (status === 'loading') {
    return <LoadingScreen stage={stage} mode={customModeEnabled ? 'custom' : 'default'} />;
  }

  return (
    <>
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none mix-blend-screen">
         <Lightfall 
            colors={['#f97316', '#f85149', '#d29922']}
            backgroundColor="#0d1117"
            speed={0.5}
            streakCount={3}
            streakWidth={1.2}
            streakLength={1.5}
            glow={0.7}
            density={0.8}
            twinkle={0.8}
            zoom={2.5}
            backgroundGlow={0.2}
            mouseInteraction={false}
            dpr={1}
         />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.5 } }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-full bg-transparent text-textPrimary selection:bg-primary/30 pb-32 flex flex-col relative z-10"
      >
        <main className="relative z-10">
        {/* Pass the analyze function to the Hero component */}
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

        {/* What we roast - a quiet list, not a grid of identical cards */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-textPrimary">
              What we roast
            </h2>
            <p className="mt-3 text-lg text-textSecondary font-medium">
              Seven categories, every repo, no exceptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                className="flex items-start gap-4 py-6 border-t border-border/50 md:odd:pr-8 md:even:pl-8"
              >
                <feature.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-serif font-semibold text-textPrimary tracking-tight mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-textSecondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      </motion.div>
    </>
  );
};
