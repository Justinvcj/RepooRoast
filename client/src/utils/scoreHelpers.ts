export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CC38A'; // data-success
  if (score >= 60) return '#E5B93C'; // data-warning
  if (score >= 40) return '#E88A4A'; // data-flawed
  return '#F0595E'; // data-critical
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
};
