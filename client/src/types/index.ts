export interface RepoMetadata {
  owner: string;
  repo: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

export interface StaticAnalysis {
  repoMetrics: {
    totalFiles: number;
    totalLOC: number;
    commentLOC: number;
    blankLOC: number;
    languageBreakdown: Record<string, number>;
    totalFunctions: number;
    filesWithZeroComments: string[];
    todoCount: number;
    fixmeCount: number;
    commentToCodeRatio: number;
  };
  dependencyGraph: {
    metrics: {
      hubs: string[];
      orphans: string[];
      circularPaths: string[];
    };
  };
  fileAnalyses: any[];
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
  analysis?: StaticAnalysis;
  review: ReviewResult;
}

export type ReviewStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReviewState {
  status: ReviewStatus;
  data: ApiResponse | null;
  error: string | null;
}
