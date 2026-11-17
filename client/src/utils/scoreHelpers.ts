export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#17794A'; // data-success
  if (score >= 60) return '#946000'; // data-warning
  if (score >= 40) return '#B4480A'; // data-flawed
  return '#C62A1B'; // data-critical
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
};
