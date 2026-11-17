export const springEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const transitionTokens = {
  instant: { duration: 0.08, ease: springEasing },
  fast: { duration: 0.15, ease: springEasing },
  normal: { duration: 0.25, ease: springEasing },
  settle: { duration: 0.4, ease: springEasing },
  scoreReveal: { duration: 0.8, ease: springEasing },
};

export const getPageTransition = (prefersReduced: boolean | null) => {
  if (prefersReduced) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.25, ease: springEasing },
  };
};
