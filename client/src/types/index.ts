export interface RepoMetadata {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  createdAt: string;
  updatedAt: string;
  size: number;
  openIssues: number;
  license: string | null;
  topics: string[];
  defaultBranch: string;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
  severity: Severity;
  title: string;
  description: string;
  file: string;
  suggestion: string;
}

export interface Category {
  name: string;
  score: number;
  emoji: string;
  summary: string;
  issues: Issue[];
  positives: string[];
}

export interface ReviewResult {
  overallScore: number;
  overallVerdict: string;
  seniorDevQuote: string;
  categories: Category[];
  topPriorities: string[];
  whatYouDidWell: string[];
  hiringVerdict: string;
  fixPrompt: string;
}

export interface ApiResponse {
  success: boolean;
  repo: RepoMetadata;
  review: ReviewResult;
}

export type ReviewStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReviewState {
  status: ReviewStatus;
  data: ApiResponse | null;
  error: string | null;
}
