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
      <div className="fixed inset-0 z-0 opacity-80 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
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

        {/* Feature Grid Section */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-textPrimary">
              What we roast.
            </h2>
            <p className="mt-4 text-lg text-textSecondary font-medium max-w-2xl mx-auto">
              We leave no stone unturned in our quest to find your bugs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-panel hover:border-white/20 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl p-8 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <span className="absolute top-6 right-8 font-mono text-5xl font-bold text-white/[0.04] select-none" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <feature.icon className="h-6 w-6 text-primary shrink-0" aria-hidden="true" />
                    <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight">
                      {feature.name}
                    </h3>
                  </div>
                  <p className="text-base text-textSecondary leading-relaxed">
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
