import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { LogoMark } from '../components/brand';
import { Card, Button } from '../components/ui';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center relative z-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <Card level={1} className="p-8 sm:p-12 border-border-hairline shadow-2xl backdrop-blur-xl flex flex-col items-center">
          <div className="mb-6 p-4 rounded-2xl bg-surface-secondary border border-border-hairline">
            <LogoMark size={40} />
          </div>

          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-2">
            Status: Route_Not_Found
          </span>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-textPrimary font-sans mb-4">
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
