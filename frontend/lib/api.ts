/**
 * PlacementBuddy - Centralized Frontend API Client
 * Provides typed methods for communication with backend services.
 */

import { CodeExecutionResult, InterviewEvaluationResult, ResumeAnalysisResult } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")
  : "";

/**
 * Upload and analyze resume (.pdf, .docx, .doc, or text)
 */
export async function analyzeResume(formData: FormData): Promise<ResumeAnalysisResult> {
  const response = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Resume analysis failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Execute code snippet (Python, C++, Java, JS) in real-time
 */
export async function executeCode(
  code: string,
  language: string,
  stdin: string = ""
): Promise<CodeExecutionResult> {
  const response = await fetch(`${API_BASE}/api/oa/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, language, stdin }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Code execution failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Evaluate mock interview response
 */
export async function evaluateInterviewAnswer(payload: {
  questionId: string;
  question: string;
  role: string;
  userAnswer: string;
  expectedKeywords?: string[];
}): Promise<InterviewEvaluationResult> {
  const response = await fetch(`${API_BASE}/api/interview/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Interview evaluation failed with status ${response.status}`);
  }

  return response.json();
}
