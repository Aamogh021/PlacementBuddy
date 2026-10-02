import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routers.resume import router as resume_router
from routers.oa import router as oa_router
from routers.interview import router as interview_router
from db import init_db, close_db, is_database_connected

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Neon PostgreSQL connection pool
    await init_db()
    yield
    # Cleanup connection pool
    await close_db()

app = FastAPI(
    title="PlacementBuddy AI Backend",
    description="High-performance backend for ATS resume parsing, real-time code runner, and AI mock interview evaluations with Neon Serverless PostgreSQL.",
    version="2.1.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
# ALLOWED_ORIGINS env var: comma-separated list of allowed origins
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")
if _raw_origins:
    if _raw_origins.strip() == "*":
        CORS_ORIGINS = ["*"]
    else:
        CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]
else:
    CORS_ORIGINS = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# If wildcard is used, allow_credentials must be False per CORS spec, otherwise True
allow_creds = CORS_ORIGINS != ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$" if CORS_ORIGINS != ["*"] else None,
    allow_credentials=allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resume_router)
app.include_router(oa_router)
app.include_router(interview_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": "PlacementBuddy Full-Stack Engine",
        "database": "Neon PostgreSQL (Serverless)",
        "database_connected": is_database_connected(),
        "version": "2.1.0",
        "endpoints": [
            "/health",
            "/api/health",
            "/api/resume/analyze",
            "/api/oa/questions",
            "/api/oa/companies",
            "/api/oa/execute",
            "/api/oa/submit",
            "/api/oa/calendar",
            "/api/interview/questions",
            "/api/interview/evaluate"
        ]
    }

@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "Neon PostgreSQL",
        "database_connected": is_database_connected()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
