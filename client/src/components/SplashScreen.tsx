import React from 'react';
import { motion } from 'framer-motion';
import { LogoLockup } from './brand';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[1000] bg-background flex flex-col items-center justify-center pointer-events-none select-none"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
      }}
    >
      <LogoLockup size={56} animated={true} />
    </motion.div>
  );
};
