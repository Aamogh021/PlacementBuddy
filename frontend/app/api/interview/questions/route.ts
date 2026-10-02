import { NextRequest, NextResponse } from "next/server";
import {
  ROLE_QUESTION_MAP,
  COMPANY_SPECIFIC_QUESTIONS,
  BEHAVIORAL_QUESTIONS,
  seededShuffle,
  InterviewQuestion,
  InterviewRole,
} from "@/lib/data/interviewQuestions";

export async function GET(req: NextRequest) {
  const FASTAPI_URL = (process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "Software Development Engineer (SDE 1)";
    const company = searchParams.get("company") || "Google";
    const count = searchParams.get("count") || "6";

    // 1. Try pulling dynamic randomized scenarios directly from FastAPI backend
    try {
      const fastApiResponse = await fetch(
        `${FASTAPI_URL}/api/interview/questions?role=${encodeURIComponent(role)}&company=${encodeURIComponent(company)}&count=${count}`
      );
      if (fastApiResponse.ok) {
        const data = await fastApiResponse.json();
        if (data.questions && data.questions.length > 0) {
          // Adapt to frontend InterviewQuestion format
          const formattedQuestions: InterviewQuestion[] = data.questions.map((q: any, idx: number) => ({
            id: q.id || `sc-${idx}`,
            role: role as InterviewRole,
            type: q.category?.includes("HR") ? "Behavioral HR" : "Technical",
            category: q.category || "Core Engineering",
            question: q.question || q.question_text,
            hint: q.scenario ? `Scenario: ${q.scenario}` : undefined,
            expectedConcepts: q.expected_concepts || ["Clear explanation", "System trade-offs", "Complexity analysis"],
            companies: [company],
            timeLimit: 120,
          }));

          return NextResponse.json({
            questions: formattedQuestions,
            role,
            company,
            total: formattedQuestions.length,
            source: "fastapi_backend"
          });
        }
      }
    } catch (e) {
      console.warn("FastAPI unreachable, falling back to local dataset:", e);
    }

    // 2. Fallback to local question pool
    const roleKey = (role.includes("SDE") ? "Software Engineer (SDE)" : role) as InterviewRole;
    const rolePool: InterviewQuestion[] = ROLE_QUESTION_MAP[roleKey] || ROLE_QUESTION_MAP["Software Engineer (SDE)"];
    const seed = Date.now();
    const shuffled = seededShuffle(rolePool, seed);

    return NextResponse.json({
      questions: shuffled.slice(0, parseInt(count, 10)),
      role,
      company,
      total: Math.min(shuffled.length, parseInt(count, 10)),
      source: "local_cache"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate interview questions.", details: error.message },
      { status: 500 }
    );
  }
}
