import random
import re
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from db import save_interview_session

router = APIRouter(prefix="/api/interview", tags=["interview"])

# Rich pool of role-specific scenarios and questions
SCENARIO_BANK = {
    "Software Development Engineer (SDE 1)": [
        {
            "id": "sde-sc-1",
            "scenario": "Live Production Memory Leak in Distributed Microservice",
            "question": "A microservice handling payment webhooks suddenly spikes to 95% RAM utilization and starts throwing OutOfMemory errors every 30 minutes. How would you triage this under pressure, identify whether it's an unclosed resource or memory leak, and what steps do you take to mitigate customer downtime?",
            "category": "Technical & Incident Management",
            "expected_concepts": ["Heap dump analysis", "jmap/pprof", "Connection pool leaks", "Rolling restart", "Canary rollback", "Prometheus alerts"]
        },
        {
            "id": "sde-sc-2",
            "scenario": "Designing an Idempotent Payment Processing API",
            "question": "Suppose a network timeout occurs while a user clicks 'Pay Now'. The client retries the request. How do you design your API and database layer to guarantee the user is charged exactly once (Idempotency), even with concurrent retry requests hitting different backend instances?",
            "category": "System Design & Distributed Systems",
            "expected_concepts": ["Idempotency-Key header", "Redis distributed lock", "Database unique constraint", "Two-phase commit", "State machine (PENDING, SUCCESS)"]
        },
        {
            "id": "sde-sc-3",
            "scenario": "Data Structure Selection: LRU vs LFU in High-Read Caching",
            "question": "Walk me through how you would implement an LRU (Least Recently Used) cache from scratch. What data structures give O(1) read and write time complexity, and why isn't an array or plain hash map sufficient?",
            "category": "DSA & Core Fundamentals",
            "expected_concepts": ["Doubly Linked List", "Hash Map", "O(1) get and put", "Pointer updates", "Capacity eviction"]
        },
        {
            "id": "sde-sc-4",
            "scenario": "Cross-Functional Conflict with Product Manager on Technical Debt",
            "question": "Tell me about a situation where a Product Manager wanted to push a feature quickly to meet a deadline, but you knew taking on that technical debt could jeopardize system stability. How did you negotiate and what was the outcome?",
            "category": "Behavioral / Leadership (STAR)",
            "expected_concepts": ["Impact quantification", "Trade-off negotiation", "Phase-wise rollout", "Technical debt backlog", "Stakeholder communication"]
        }
    ],
    "AI / Machine Learning Engineer": [
        {
            "id": "aiml-sc-1",
            "scenario": "Severe Data Drift & Model Performance Degradation in Production",
            "question": "A fraud detection model that achieved 96% accuracy in offline testing has seen its precision drop to 71% three weeks post-deployment. How do you diagnose covariate shift vs concept drift, and what automated pipeline would you establish for retraining?",
            "category": "MLOps & Monitoring",
            "expected_concepts": ["Covariate shift", "Concept drift", "Population Stability Index (PSI)", "Evidently AI / monitoring", "Shadow deployments"]
        },
        {
            "id": "aiml-sc-2",
            "scenario": "RAG Architecture: Hallucinations and Chunking Strategy",
            "question": "In a Retrieval-Augmented Generation (RAG) system for financial reports, the LLM occasionally hallucinates numbers not in the retrieved context. How do you optimize embedding similarity search, chunking strategy, and re-ranking to minimize hallucinations?",
            "category": "Generative AI & LLMs",
            "expected_concepts": ["Semantic chunking", "Hybrid search (BM25 + Dense)", "Cross-Encoder Re-ranking", "Grounding prompts", "Confidence thresholds"]
        },
        {
            "id": "aiml-sc-3",
            "scenario": "Handling High Class Imbalance (1:1000 Ratio)",
            "question": "You are building an intrusion detection classifier where only 0.1% of requests are malicious. Why is accuracy a misleading metric, and how would you adjust loss functions, sampling techniques, and evaluation metrics?",
            "category": "Statistical Learning",
            "expected_concepts": ["PR-AUC vs ROC-AUC", "Focal Loss", "SMOTE / Undersampling", "Precision-Recall trade-off", "Cost-sensitive matrix"]
        }
    ],
    "Full Stack Web Developer": [
        {
            "id": "fs-sc-1",
            "scenario": "Frontend Hydration Mismatch & First Contentful Paint Optimization",
            "question": "Your Next.js dashboard is experiencing a high First Contentful Paint (FCP) of 4.2 seconds and React hydration errors in production. How do you profile client-side bundles, dynamic imports, SSR boundaries, and image optimization to bring Core Web Vitals under 1.2s?",
            "category": "Frontend Architecture & Web Vitals",
            "expected_concepts": ["Dynamic imports (next/dynamic)", "React Server Components", "Bundle analyzer", "SSR hydration error resolution", "LCP/CLS optimization"]
        },
        {
            "id": "fs-sc-2",
            "scenario": "Real-Time Collaborative Editing via WebSockets",
            "question": "How would you design a real-time collaborative document editor like Google Docs or Figma? How do you synchronize state between concurrent browser tabs, handle disconnected network state, and prevent race conditions?",
            "category": "Full Stack System Architecture",
            "expected_concepts": ["WebSockets", "Operational Transformation (OT) or CRDTs", "Heartbeats & reconnection", "Optimistic UI updates", "Redis pub/sub"]
        }
    ],
    "Backend Developer": [
        {
            "id": "be-sc-1",
            "scenario": "Database Connection Pool Exhaustion under Flash Sale Spike",
            "question": "During a flash sale, your PostgreSQL database CPU hits 100% and clients receive 'too many connections' errors. How do you diagnose query locks, configure PgBouncer connection pooling, and implement read-replicas or caching to protect the primary database?",
            "category": "Database Engineering & Scalability",
            "expected_concepts": ["PgBouncer connection pooling", "Slow query logs (EXPLAIN ANALYZE)", "Read replica offloading", "Redis cache layer", "Deadlock resolution"]
        },
        {
            "id": "be-sc-2",
            "scenario": "Event-Driven Microservices with Kafka: Handling Poison Pill Messages",
            "question": "A consumer group in your Kafka pipeline crashes repeatedly when processing a malformed message, blocking the entire topic partition. How do you design a Dead Letter Queue (DLQ) pattern and retry policy to maintain high availability?",
            "category": "Distributed Message Brokers",
            "expected_concepts": ["Dead Letter Queue (DLQ)", "Exponential backoff", "Idempotent consumers", "Partition offset commit", "Schema Registry validation"]
        }
    ],
    "Data Analyst": [
        {
            "id": "da-sc-1",
            "scenario": "A/B Testing Metric Inconsistency: Simpson's Paradox",
            "question": "In an A/B test for a new checkout flow, the overall conversion rate was higher for Variant B, but when segmenting by desktop and mobile users, Variant A won in both segments. Explain what statistical phenomenon this is and how you advise stakeholders.",
            "category": "Statistical Testing & Analysis",
            "expected_concepts": ["Simpson's Paradox", "Lurking variables", "Weighted averages", "Sample size skew", "Segmented decision making"]
        }
    ],
    "DevOps Engineer": [
        {
            "id": "do-sc-1",
            "scenario": "Zero-Downtime Blue/Green Deployment Rollback on Kubernetes",
            "question": "A newly deployed Kubernetes pod release causes a 5xx error spike in ingress traffic. Walk me through the automated health check and readiness probe configuration, traffic redirection, and instant rollback mechanism.",
            "category": "Container Orchestration & CI/CD",
            "expected_concepts": ["Readiness & Liveness probes", "Canary / Blue-Green routing", "kubectl rollout undo", "Service mesh / Ingress weights", "Prometheus alerts"]
        }
    ]
}

# Standard HR Behavioral Questions
BEHAVIORAL_QUESTIONS = [
    {
        "id": "hr-1",
        "scenario": "Candidate Introduction & Technical Trajectory",
        "question": "Tell me about yourself, your core technical focus, and why you are interested in this specific role and engineering culture.",
        "category": "HR & Culture Fit",
        "expected_concepts": ["Clear career narrative", "Relevant project accomplishments", "Company value alignment", "Concise delivery"]
    },
    {
        "id": "hr-2",
        "scenario": "Handling Critical Setbacks and Failures",
        "question": "Describe a project or technical initiative that did not go as planned. What was the core obstacle, what was your personal responsibility, and what did you learn?",
        "category": "Behavioral (STAR Method)",
        "expected_concepts": ["Ownership & accountability", "Problem diagnosis", "Corrective action taken", "Key lessons learned"]
    },
    {
        "id": "hr-3",
        "scenario": "Ambiguity and Self-Directed Learning",
        "question": "Tell me about a time you had to learn a completely new technology, framework, or domain in a tight timeframe to ship a deliverable.",
        "category": "Adaptability & Growth Mindset",
        "expected_concepts": ["Fast learning methodology", "Hands-on prototyping", "Resourcefulness", "Delivered on schedule"]
    }
]

class EvaluationRequest(BaseModel):
    transcript: str
    role: str
    company: str
    question_text: str
    user_email: Optional[str] = None

@router.get("/questions")
def get_interview_questions(
    role: str = Query("Software Development Engineer (SDE 1)"),
    company: str = Query("Google"),
    count: int = Query(5)
):
    role_scenarios = SCENARIO_BANK.get(role, SCENARIO_BANK["Software Development Engineer (SDE 1)"])
    
    # Select a balanced mix of role-specific scenarios and behavioral questions
    selected_scenarios = random.sample(role_scenarios, min(len(role_scenarios), max(1, count - 1)))
    selected_behavioral = random.sample(BEHAVIORAL_QUESTIONS, min(len(BEHAVIORAL_QUESTIONS), 2))
    
    all_questions = selected_scenarios + selected_behavioral
    random.shuffle(all_questions)
    
    return {
        "status": "success",
        "role": role,
        "company": company,
        "total_selected": len(all_questions),
        "questions": all_questions
    }

@router.post("/evaluate")
async def evaluate_interview_response(req: EvaluationRequest):
    transcript = req.transcript.strip()
    words = transcript.split()
    word_count = len(words)
    
    if word_count < 10:
        return {
            "status": "incomplete",
            "overall_score": 35,
            "tech_score": 30,
            "comm_score": 40,
            "conf_score": 35,
            "verdict": "⚠️ Needs Improvement",
            "feedback": {
                "summary": "Your spoken response was too brief (under 10 words). In technical and HR interviews, provide a structured answer with context and rationale.",
                "strengths": ["Attempted to answer the prompt"],
                "improvements": ["Elaborate on technical choices", "Use the STAR method for scenarios", "Provide measurable outcomes"],
                "detected_keywords": []
            }
        }

    lower_text = transcript.lower()
    
    # 1. Technical Knowledge Density Evaluation
    tech_patterns = [
        "architecture", "latency", "algorithm", "complexity", "database", "cache",
        "redis", "sql", "microservice", "testing", "metric", "scalability", "concurrency",
        "throughput", "api", "pipeline", "docker", "model", "index", "trade-off"
    ]
    detected_tech = [t for t in tech_patterns if t in lower_text]
    tech_density_ratio = min(1.0, len(detected_tech) / 4.0)
    tech_score = int(40 + (tech_density_ratio * 55))
    tech_score = min(96, tech_score)

    # 2. Communication Clarity Evaluation
    # Check for structured transition phrases (STAR method markers)
    structure_markers = ["first", "initially", "because", "as a result", "therefore", "for example", "we implemented", "the outcome was"]
    detected_markers = [m for m in structure_markers if m in lower_text]
    
    comm_score = 55
    if word_count >= 50: comm_score += 15
    if word_count >= 100: comm_score += 10
    if len(detected_markers) >= 2: comm_score += 15
    comm_score = min(95, comm_score)

    # 3. Confidence & Delivery (avoiding filler words, good length)
    fillers = re.findall(r'\b(um|uh|like|you know|basically|sort of|i guess)\b', lower_text)
    filler_count = len(fillers)
    conf_score = max(40, 88 - (filler_count * 5))
    if word_count > 60:
        conf_score = min(92, conf_score + 10)

    # Weighted Overall Formula
    overall_score = int((0.40 * tech_score) + (0.30 * comm_score) + (0.30 * conf_score))

    # Determine Verdict
    if overall_score >= 70:
        verdict = "🎉 Shortlisted / Strong Hire"
        summary = (
            f"Impressive articulation for {req.role} at {req.company}. "
            f"You demonstrated strong domain familiarity ({len(detected_tech)} key engineering concepts detected) "
            f"and structured communication."
        )
    elif overall_score >= 55:
        verdict = "⚖️ Borderline / Consider with Feedback"
        summary = (
            f"Solid attempt for {req.role}. Your explanation communicates the general idea, "
            f"but needs deeper architectural specifics and fewer conversational filler words."
        )
    else:
        verdict = "⚠️ Needs Improvement"
        summary = (
            f"Response lacked sufficient technical depth for {req.company}. "
            f"Focus on explaining edge cases, trade-offs, and metrics to reach the target hiring bar."
        )

    strengths = []
    if len(detected_tech) >= 3:
        strengths.append(f"Strong technical vocabulary: {', '.join(detected_tech[:4])}")
    if word_count >= 60:
        strengths.append(f"Substantive answer depth ({word_count} spoken words)")
    if len(detected_markers) >= 1:
        strengths.append("Used logical sequencing and cause-and-effect transitions")
    if not strengths:
        strengths.append("Clear audio delivery and vocal recognition")

    improvements = []
    if filler_count >= 2:
        improvements.append(f"Reduce speech hesitation fillers (detected {filler_count} instances)")
    if len(detected_tech) < 3:
        improvements.append("Incorporate more system-level terminology and performance metrics")
    if word_count < 50:
        improvements.append("Expand on trade-offs and alternative solutions you considered")
    if not improvements:
        improvements.append("Practice timing: Aim for crisp 90 to 120-second delivery")

    result = {
        "status": "evaluated",
        "overall_score": overall_score,
        "tech_score": tech_score,
        "comm_score": comm_score,
        "conf_score": conf_score,
        "verdict": verdict,
        "feedback": {
            "summary": summary,
            "word_count": word_count,
            "strengths": strengths,
            "improvements": improvements,
            "detected_keywords": detected_tech
        }
    }

    # Save to Supabase (or in-memory store)
    session_record = {
        "user_email": req.user_email,
        "role": req.role,
        "company": req.company,
        "overall_score": overall_score,
        "tech_score": tech_score,
        "comm_score": comm_score,
        "conf_score": conf_score,
        "verdict": verdict,
        "feedback": result["feedback"],
        "transcript": [{"question": req.question_text, "response": transcript}]
    }
    await save_interview_session(session_record)

    return result
