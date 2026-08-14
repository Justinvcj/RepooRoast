export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#3fb950'; // success
  if (score >= 60) return '#d29922'; // warning
  if (score >= 40) return '#f97316'; // primary/orange
  return '#f85149'; // danger
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
};
