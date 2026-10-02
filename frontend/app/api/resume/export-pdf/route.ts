import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = (process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const fastApiResponse = await fetch(`${FASTAPI_URL}/api/resume/export-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!fastApiResponse.ok) {
      let errorDetail = "PDF export failed.";
      try {
        const err = await fastApiResponse.json();
        errorDetail = err.detail || err.error || errorDetail;
      } catch {
        errorDetail = await fastApiResponse.text().catch(() => errorDetail);
      }
      return NextResponse.json({ error: errorDetail }, { status: fastApiResponse.status });
    }

    const pdfBuffer = await fastApiResponse.arrayBuffer();
    const filename = body.file_name || "PlacementBuddy_Improved_Resume.pdf";

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[resume/export-pdf] Error generating PDF:", message);
    return NextResponse.json(
      { error: "Failed to generate improved PDF. Please ensure the backend is running." },
      { status: 500 }
    );
  }
}
