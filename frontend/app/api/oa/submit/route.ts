import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const FASTAPI_URL = (process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  try {
    const body = await req.json();

    try {
      const fastApiResponse = await fetch(`${FASTAPI_URL}/api/oa/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (fastApiResponse.ok) {
        const data = await fastApiResponse.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("FastAPI oa submit unreachable, falling back to local success:", e);
    }

    return NextResponse.json({
      status: "saved",
      submission: {
        ...body,
        status: body.tests_passed === body.total_tests ? "Accepted" : "Failed",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
