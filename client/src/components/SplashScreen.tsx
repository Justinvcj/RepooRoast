import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1, 1.4, 1],
          filter: [
            "drop-shadow(0 0 0px rgba(249, 115, 22, 0))",
            "drop-shadow(0 0 40px rgba(249, 115, 22, 0.6))",
            "drop-shadow(0 0 10px rgba(249, 115, 22, 0.2))",
            "drop-shadow(0 0 60px rgba(249, 115, 22, 0.8))",
            "drop-shadow(0 0 0px rgba(249, 115, 22, 0))"
          ]
        }}
        transition={{ 
          duration: 1.5, 
          times: [0, 0.2, 0.5, 0.7, 1],
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.5
        }}
        exit={{ 
          scale: 20, // Reduced scale and removed heavy shadow to fix GPU lag
          opacity: 0,
          filter: "drop-shadow(0 0 0px rgba(249, 115, 22, 0))",
          transition: { duration: 0.5, ease: "easeIn" }
        }}
      >
        <Flame className="w-24 h-24 text-primary" strokeWidth={1.5} />
      </motion.div>
      <motion.div 
        className="mt-8 text-2xl font-serif font-extrabold tracking-widest text-primary/80 uppercase"
        exit={{ opacity: 0, y: 20 }}
      >
        RepoRoast
      </motion.div>
    </motion.div>
  );
};
