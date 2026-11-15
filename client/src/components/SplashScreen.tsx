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
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
        exit={{
          scale: 20,
          opacity: 0,
          transition: { duration: 0.5, ease: "easeIn" }
        }}
      >
        <Flame className="w-20 h-20 text-primary" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="mt-8 text-xl font-serif font-semibold tracking-tight text-textPrimary"
        exit={{ opacity: 0, y: 20 }}
      >
        Repo<span className="text-primary">Roast</span>
      </motion.div>
    </motion.div>
  );
};
