import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../types';
import { IssueCard } from './IssueCard';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

interface CategorySectionProps {
  category: Category;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  let scoreColor = 'text-[#f85149]'; // danger
  if (category.score >= 80) scoreColor = 'text-[#3fb950]'; // success
  else if (category.score >= 60) scoreColor = 'text-[#d29922]'; // warning
  else if (category.score >= 40) scoreColor = 'text-[#f97316]'; // primary

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-surface/95 rounded-2xl border border-border/50 overflow-hidden shadow-lg hover:border-border transition-colors"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{category.emoji}</span>
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-serif font-bold text-textPrimary tracking-tight">{category.name}</h3>
            <span className={`font-mono font-extrabold mt-1 tracking-wider ${scoreColor}`}>
              {category.score} / 100
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-textSecondary" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0, 
          opacity: isExpanded ? 1 : 0 
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
            <div className="p-6 pt-0 border-t border-border/50">
              <p className="text-lg text-textSecondary italic mb-6 mt-4">
                "{category.summary}"
              </p>

              {category.positives.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-textPrimary uppercase tracking-widest pl-2 mb-4 border-l-2 border-[#3fb950]">What's Good</h4>
                  <ul className="space-y-3">
                    {category.positives.map((positive, i) => (
                      <li key={i} className="flex items-start gap-3 text-textSecondary">
                        <CheckCircle2 className="w-5 h-5 text-[#3fb950] shrink-0 mt-0.5" />
                        <span>{positive}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {category.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-textPrimary uppercase tracking-widest pl-2 mb-4 border-l-2 border-[#f85149]">Areas to Improve</h4>
                  <div className="flex flex-col gap-4">
                    {category.issues.map((issue, i) => (
                      <IssueCard key={i} issue={issue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
      </motion.div>
    </motion.div>
  );
};
