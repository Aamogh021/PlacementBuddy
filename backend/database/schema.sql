-- ====================================================================
-- PlacementBuddy Database Schema for Supabase / PostgreSQL
-- ====================================================================

-- 1. Resumes & ATS Analysis History Table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    file_name TEXT,
    file_type TEXT,
    role TEXT NOT NULL,
    ats_score INTEGER NOT NULL,
    keyword_score INTEGER NOT NULL,
    metrics_score INTEGER NOT NULL,
    structure_score INTEGER NOT NULL,
    formatting_score INTEGER NOT NULL,
    tier_unlocked TEXT NOT NULL,
    tier_name TEXT NOT NULL,
    bullet_rewrites JSONB DEFAULT '[]'::jsonb,
    missing_keywords JSONB DEFAULT '[]'::jsonb,
    detected_keywords JSONB DEFAULT '[]'::jsonb,
    detected_metrics JSONB DEFAULT '[]'::jsonb,
    detected_sections JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_description TEXT;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_match_score INTEGER;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS section_findings JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS improvements JSONB DEFAULT '[]'::jsonb;

-- 2. OA Questions Table (Real company-tagged question bank)
CREATE TABLE IF NOT EXISTS public.oa_questions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    time_limit_mins INTEGER DEFAULT 45,
    description TEXT NOT NULL,
    starter_code JSONB NOT NULL,
    test_cases JSONB NOT NULL,
    solution_code JSONB,
    explanation TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    acceptance_rate NUMERIC DEFAULT 65.0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. OA Submissions & Code Execution History
CREATE TABLE IF NOT EXISTS public.oa_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    question_id TEXT NOT NULL,
    company TEXT,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    tests_passed INTEGER NOT NULL,
    total_tests INTEGER NOT NULL,
    status TEXT NOT NULL,
    runtime_ms NUMERIC,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Interview Scenarios & Role Questions
CREATE TABLE IF NOT EXISTS public.interview_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Technical', 'System Design', 'Behavioral / HR', 'Situation'
    scenario_title TEXT NOT NULL,
    question_text TEXT NOT NULL,
    expected_points JSONB DEFAULT '[]'::jsonb,
    follow_ups JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Interview Sessions & Candidate Evaluation History
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    overall_score INTEGER NOT NULL,
    tech_score INTEGER NOT NULL,
    comm_score INTEGER NOT NULL,
    conf_score INTEGER NOT NULL,
    verdict TEXT NOT NULL,
    feedback JSONB DEFAULT '{}'::jsonb,
    transcript JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_email ON public.resumes(user_email);
CREATE INDEX IF NOT EXISTS idx_oa_questions_company ON public.oa_questions(company);
CREATE INDEX IF NOT EXISTS idx_oa_questions_category ON public.oa_questions(category);
CREATE INDEX IF NOT EXISTS idx_oa_submissions_user ON public.oa_submissions(user_email);
CREATE INDEX IF NOT EXISTS idx_interview_scenarios_role ON public.interview_scenarios(role, company);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON public.interview_sessions(user_email);
