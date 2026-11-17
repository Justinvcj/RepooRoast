export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10B981'; // data-success
  if (score >= 60) return '#F59E0B'; // data-warning
  if (score >= 40) return '#E67E22'; // data-flawed
  return '#EF4444'; // data-critical
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
};
