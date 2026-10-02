import { NextRequest, NextResponse } from "next/server";
import { OA_QUESTIONS } from "@/lib/data/oaQuestions";

export async function GET(req: NextRequest) {
  const FASTAPI_URL = (process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company") || "";
    const category = searchParams.get("category") || "";

    try {
      const fastApiResponse = await fetch(
        `${FASTAPI_URL}/api/oa/questions?company=${encodeURIComponent(company)}&category=${encodeURIComponent(category)}`
      );
      if (fastApiResponse.ok) {
        const data = await fastApiResponse.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("FastAPI OA questions unreachable, falling back:", e);
    }

    // Fallback to local static dataset
    return NextResponse.json({
      status: "success",
      total: OA_QUESTIONS.length,
      questions: OA_QUESTIONS,
      source: "local_cache"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
