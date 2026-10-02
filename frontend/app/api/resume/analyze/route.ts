import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = (process.env.FASTAPI_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  try {
    const forwardForm = new FormData();

    if (contentType.includes("multipart/form-data")) {
      const incomingForm = await req.formData();

      const fieldMap: Record<string, string> = {
        targetRole: "role",
        role: "role",
        targetCompany: "target_company",
        company: "target_company",
        userEmail: "user_email",
        user_email: "user_email",
        resumeText: "resume_text",
        resume_text: "resume_text",
        jobDescription: "job_description",
        job_description: "job_description",
      };

      for (const [key, value] of incomingForm.entries()) {
        const backendKey = fieldMap[key] ?? key;
        if (value instanceof File) {
          forwardForm.append("file", value, value.name);
        } else {
          forwardForm.append(backendKey, value as string);
        }
      }
    } else {
      const body = await req.json();
      const roleVal = body.targetRole || body.role || "Software Development Engineer (SDE 1)";
      const emailVal = body.userEmail || body.user_email || "";
      const textVal = body.resumeText || body.resume_text || "";
      const compVal = body.targetCompany || body.company || "";
      const jdVal = body.jobDescription || body.job_description || "";

      forwardForm.append("role", roleVal);
      if (textVal) forwardForm.append("resume_text", textVal);
      if (emailVal) forwardForm.append("user_email", emailVal);
      if (compVal) forwardForm.append("target_company", compVal);
      if (jdVal) forwardForm.append("job_description", jdVal);
    }

    let fastApiResponse: Response;
    try {
      fastApiResponse = await fetch(`${FASTAPI_URL}/api/resume/analyze`, {
        method: "POST",
        body: forwardForm,
      });
    } catch (networkErr: any) {
      console.error("[resume/analyze] FastAPI backend unreachable:", networkErr?.message);
      return NextResponse.json(
        {
          error: "Resume analysis backend is offline. Please ensure the Python backend is running.",
          detail: `Could not connect to ${FASTAPI_URL}`,
        },
        { status: 503 }
      );
    }

    if (!fastApiResponse.ok) {
      let errorDetail = "Analysis failed.";
      try {
        const errBody = await fastApiResponse.json();
        errorDetail = errBody.detail || errBody.error || errorDetail;
      } catch {
        errorDetail = await fastApiResponse.text().catch(() => errorDetail);
      }
      console.error(`[resume/analyze] FastAPI returned ${fastApiResponse.status}: ${errorDetail}`);
      return NextResponse.json({ error: errorDetail }, { status: fastApiResponse.status });
    }

    const data = await fastApiResponse.json();

    // Map into frontend friendly typed response
    const response = {
      analysisId: data.analysis_id,
      fileName: data.file_name,
      fileType: data.file_type,
      role: data.role,
      targetCompany: data.target_company || "",
      wordCount: data.word_count,

      overallScore: data.overall_score,
      jobMatchScore: data.job_match_score,
      hasJobDescription: data.has_job_description,
      jobMatchDetails: data.job_match_details,

      scoreBreakdown: data.score_breakdown,
      tierUnlocked: data.tier_unlocked,
      tierName: data.tier_name,
      tierVerdict: data.tier_verdict,

      summary: data.summary,
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      missingOrUnclear: data.missing_or_unclear || [],

      sectionFindings: data.section_findings || [],
      bulletRewrites: data.bullet_rewrites || [],

      skillsAnalysis: {
        detectedSkills: data.detected_keywords || [],
        missingTargetSkills: data.missing_keywords || [],
        roleKeywordCoverage: `${(data.detected_keywords || []).length} of ${
          (data.detected_keywords || []).length + (data.missing_keywords || []).length
        } target skills detected`,
      },

      detectedMetrics: data.detected_metrics || [],
      rawText: data.raw_text || "",
      aiEnhanced: data.ai_enhanced,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[resume/analyze] Unexpected error:", message);
    return NextResponse.json(
      { error: "Unexpected server error during resume analysis. Please try again." },
      { status: 500 }
    );
  }
}
