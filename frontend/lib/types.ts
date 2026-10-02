/**
 * PlacementBuddy - Shared Frontend Types & Interfaces
 */

export interface ResumeAnalysisResult {
  atsScore: number;
  grammarScore: number;
  impactScore: number;
  totalScore: number;
  fileName?: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  metricsMissing: string[];
  rewrittenBullets: Array<{
    original: string;
    improved: string;
    rationale: string;
  }>;
  recommendedKeywords: string[];
  roleFitPercentage: number;
  backendEngine?: string;
}

export interface CodeExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  error?: string;
}

export interface InterviewEvaluationResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keyMissingConcepts: string[];
  modelAnswerSummary: string;
  sentiment: string;
  backendEngine?: string;
}
