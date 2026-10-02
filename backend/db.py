import os
import json
import logging
from typing import Optional, Dict, Any, List
import asyncpg
from dotenv import load_dotenv

load_dotenv()
# Also load from root .env.local if present
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env.local"))

logger = logging.getLogger("placement_buddy.db")

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("NEON_DATABASE_URL") or os.getenv("POSTGRES_URL")

_pool: Optional[asyncpg.Pool] = None

# Resilient in-memory storage fallback for offline / key pending states
IN_MEMORY_DB: Dict[str, List[Dict[str, Any]]] = {
    "resumes": [],
    "oa_submissions": [],
    "interview_sessions": [],
    "oa_questions": []
}

def get_clean_database_url() -> Optional[str]:
    if not DATABASE_URL or "your_neon" in DATABASE_URL or "placeholder" in DATABASE_URL:
        return None
    url = DATABASE_URL
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url

async def init_db():
    global _pool
    clean_url = get_clean_database_url()
    if not clean_url:
        logger.info("DATABASE_URL not configured. Running with in-memory database store.")
        return

    try:
        _pool = await asyncpg.create_pool(
            dsn=clean_url,
            min_size=1,
            max_size=10,
            command_timeout=60,
            ssl="require" if "sslmode=require" in clean_url or "neon.tech" in clean_url else None
        )
        logger.info("Connected to Neon PostgreSQL database pool.")

        # Run schema migrations automatically
        schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database", "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            async with _pool.acquire() as conn:
                await conn.execute(schema_sql)
            logger.info("Neon PostgreSQL schema initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to Neon PostgreSQL ({e}). Using in-memory fallback.")
        _pool = None

async def close_db():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None

async def save_resume_analysis(record: Dict[str, Any]) -> Dict[str, Any]:
    global _pool
    if _pool:
        try:
            async with _pool.acquire() as conn:
                await conn.execute("""
                    ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_description TEXT;
                    ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_match_score INTEGER;
                    ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS section_findings JSONB DEFAULT '[]'::jsonb;
                    ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS improvements JSONB DEFAULT '[]'::jsonb;
                """)
                query = """
                INSERT INTO public.resumes (
                    user_email, file_name, file_type, role, ats_score,
                    keyword_score, metrics_score, structure_score, formatting_score,
                    tier_unlocked, tier_name, bullet_rewrites, missing_keywords,
                    detected_keywords, detected_metrics, detected_sections, summary,
                    job_description, job_match_score, section_findings, improvements
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
                RETURNING id, created_at;
                """
                row = await conn.fetchrow(
                    query,
                    record.get("user_email"),
                    record.get("file_name"),
                    record.get("file_type"),
                    record.get("role", "Software Development Engineer (SDE 1)"),
                    record.get("ats_score", 0),
                    record.get("keyword_score", 0),
                    record.get("metrics_score", 0),
                    record.get("structure_score", 0),
                    record.get("formatting_score", 0),
                    record.get("tier_unlocked", "tier_3"),
                    record.get("tier_name", ""),
                    json.dumps(record.get("bullet_rewrites", [])),
                    json.dumps(record.get("missing_keywords", [])),
                    json.dumps(record.get("detected_keywords", [])),
                    json.dumps(record.get("detected_metrics", [])),
                    json.dumps(record.get("detected_sections", {})),
                    record.get("summary", ""),
                    record.get("job_description"),
                    record.get("job_match_score"),
                    json.dumps(record.get("section_findings", [])),
                    json.dumps(record.get("improvements", []))
                )
                if row:
                    record["id"] = str(row["id"])
                    record["created_at"] = str(row["created_at"])
                    return record
        except Exception as e:
            logger.error(f"Error persisting resume to Neon PostgreSQL: {e}")

    # In-memory store fallback
    IN_MEMORY_DB["resumes"].append(record)
    return record

async def save_oa_submission(record: Dict[str, Any]) -> Dict[str, Any]:
    global _pool
    if _pool:
        try:
            async with _pool.acquire() as conn:
                query = """
                INSERT INTO public.oa_submissions (
                    user_email, question_id, company, code, language,
                    tests_passed, total_tests, status, runtime_ms, error_message
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id, created_at;
                """
                row = await conn.fetchrow(
                    query,
                    record.get("user_email"),
                    record.get("question_id"),
                    record.get("company"),
                    record.get("code"),
                    record.get("language"),
                    record.get("tests_passed", 0),
                    record.get("total_tests", 0),
                    record.get("status", "Accepted"),
                    record.get("runtime_ms"),
                    record.get("error_message")
                )
                if row:
                    record["id"] = str(row["id"])
                    return record
        except Exception as e:
            logger.error(f"Error persisting OA submission to Neon PostgreSQL: {e}")

    IN_MEMORY_DB["oa_submissions"].append(record)
    return record

async def save_interview_session(record: Dict[str, Any]) -> Dict[str, Any]:
    global _pool
    if _pool:
        try:
            async with _pool.acquire() as conn:
                query = """
                INSERT INTO public.interview_sessions (
                    user_email, role, company, overall_score, tech_score,
                    comm_score, conf_score, verdict, feedback, transcript
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id, created_at;
                """
                row = await conn.fetchrow(
                    query,
                    record.get("user_email"),
                    record.get("role"),
                    record.get("company"),
                    record.get("overall_score", 0),
                    record.get("tech_score", 0),
                    record.get("comm_score", 0),
                    record.get("conf_score", 0),
                    record.get("verdict", ""),
                    json.dumps(record.get("feedback", {})),
                    json.dumps(record.get("transcript", []))
                )
                if row:
                    record["id"] = str(row["id"])
                    return record
        except Exception as e:
            logger.error(f"Error persisting interview session to Neon PostgreSQL: {e}")

    IN_MEMORY_DB["interview_sessions"].append(record)
    return record

async def get_user_resumes(user_email: str) -> List[Dict[str, Any]]:
    global _pool
    if _pool and user_email:
        try:
            async with _pool.acquire() as conn:
                rows = await conn.fetch(
                    "SELECT * FROM public.resumes WHERE user_email = $1 ORDER BY created_at DESC",
                    user_email
                )
                return [dict(r) for r in rows]
        except Exception as e:
            logger.error(f"Error fetching resumes from Neon PostgreSQL: {e}")

    return [r for r in IN_MEMORY_DB["resumes"] if r.get("user_email") == user_email]

def is_database_connected() -> bool:
    return _pool is not None
