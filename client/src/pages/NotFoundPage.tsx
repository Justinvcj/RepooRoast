import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Home } from 'lucide-react';
import { LogoMark } from '../components/brand';
import { Card, Button } from '../components/ui';
import { getPageTransition } from '../utils/motion';

export const NotFoundPage: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const pageTransition = getPageTransition(prefersReduced);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center relative z-10 select-none">
      <motion.div
        {...pageTransition}
        className="w-full max-w-lg"
      >
        <Card level={1} className="p-8 sm:p-12 border-border-hairline flex flex-col items-center">
          <div className="mb-6 p-4 rounded-lg bg-surface-secondary border border-border-hairline">
            <LogoMark size={40} />
          </div>

          <span className="text-sm font-semibold text-primary mb-2">
            Page not found
          </span>

          <h1 className="text-5xl sm:text-6xl font-medium tracking-tight leading-[1.1] text-textPrimary font-sans mb-4">
            404
          </h1>

          <p className="text-sm sm:text-base text-textSecondary font-normal leading-relaxed mb-8 max-w-sm">
            This page got roasted out of existence. Even our AST parser couldn't find anything redeeming about this URL.
          </p>

          <Link to="/" tabIndex={-1}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Back to safety
            </Button>
          </Link>
        </Card>
      </motion.div>
    </div>
  );
};
