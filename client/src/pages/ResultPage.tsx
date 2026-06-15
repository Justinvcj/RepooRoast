import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReviewDashboard } from '../components/ReviewDashboard';
import type { ApiResponse } from '../types';
import Lightfall from '../components/Lightfall';
import { Github, ExternalLink, ArrowLeft, Star, GitFork, Code } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const responseData = location.state?.reviewData as ApiResponse | undefined;

  useEffect(() => {
    // Redirect to home if no data is found in state
    if (!responseData || !responseData.success) {
      navigate('/', { replace: true });
    }
  }, [responseData, navigate]);

  if (!responseData) return null;

  const { repo, review } = responseData;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background text-textPrimary selection:bg-primary/30 pb-20 relative"
    >
      {/* Subtle Continuous Lightfall Background */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none" style={{ mixBlendMode: 'screen' }}>
         <Lightfall 
            colors={['#f97316', '#f85149', '#d29922']}
            backgroundColor="#0d1117"
            speed={0.1}
            streakCount={2}
            streakWidth={1}
            streakLength={1.5}
            glow={0.5}
            density={0.3}
            twinkle={0.5}
            zoom={1.5}
            backgroundGlow={0.1}
            mouseInteraction={false}
            dpr={1}
         />
      </div>

      {/* Floating Navbar */}
      <nav className="sticky top-0 z-50 w-full mb-8 relative">
        <div className="absolute inset-0 bg-surface/95 border-b border-border shadow-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-extrabold tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-400">
                RepoRoast 🔥
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-textPrimary transition-colors bg-surface border border-border px-4 py-2 rounded-full hover:border-[#8b949e]"
            >
              <ArrowLeft className="w-4 h-4" />
              Roast Another
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-6">
        {/* Repo Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-textSecondary mb-2">
                <Github className="w-6 h-6" />
                <span className="text-lg font-medium">{repo.owner}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-extrabold text-textPrimary tracking-tight leading-tight">
                {repo.name}
              </h1>
              {repo.description && (
                <p className="text-base text-textSecondary font-medium max-w-3xl mt-2 leading-relaxed">
                  {repo.description}
                </p>
              )}
              
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                  <Star className="w-4 h-4" />
                  {repo.stars.toLocaleString()} Stars
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                  <GitFork className="w-4 h-4" />
                  {repo.forks.toLocaleString()} Forks
                </div>
                {repo.language && (
                  <div className="flex items-center gap-2 text-sm font-medium text-textSecondary">
                    <Code className="w-4 h-4" />
                    {repo.language}
                  </div>
                )}
              </div>
            </div>

            <a 
              href={`https://github.com/${repo.owner}/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-orange-400 transition-colors bg-primary/10 px-5 py-3 rounded-xl border border-primary/20 hover:bg-primary/15 whitespace-nowrap"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </section>

        {/* Dashboard Content */}
        <ReviewDashboard review={review} />
        
      </main>
    </motion.div>
  );
};
