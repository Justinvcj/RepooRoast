import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Code2, GitMerge, FileText, Shield, TestTube, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { useRepoReview } from '../hooks/useRepoReview';
import { Hero } from '../components/Hero';
import { LoadingScreen } from '../components/LoadingScreen';

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
  const { analyzeRepo, status, data, error } = useRepoReview();
  const navigate = useNavigate();

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

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.5 } }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-full bg-background text-textPrimary selection:bg-primary/30 pb-32 overflow-hidden flex flex-col"
    >
      <main>
        {/* Pass the analyze function to the Hero component */}
        <Hero onAnalyzeRepo={analyzeRepo} isLoading={false} />

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
                className="bg-surface/90 rounded-3xl p-6 border border-border/50 hover:border-primary/30 transition-all shadow-xl group"
              >
                <div>
                  <span className="inline-flex items-center justify-center p-4 bg-background border border-border rounded-full shadow-inner mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight mb-3">
                  {feature.name}
                </h3>
                <p className="text-base text-textSecondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
};
