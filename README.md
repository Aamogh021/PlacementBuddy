# 🚀 PlacementBuddy — Next-Gen AI Placement Preparation Suite

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Neon Database](https://img.shields.io/badge/Neon-Serverless_PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)

> **PlacementBuddy** is an end-to-end, AI-powered placement preparation ecosystem designed to help engineering students crack Tier 1 (18–45+ LPA), Tier 2 (9–18 LPA), and Tier 3 (4–8 LPA) campus recruitment drives with confidence.

---

## 🌟 Key Modules & Features

### 📄 Module 01: ATS Resume Scorer & Google XYZ Bullet Engine
* **Target Role ATS Scoring**: Evaluates candidate resumes against real-world job roles (SDE 1, AI/ML Engineer, Full Stack, Backend, Data Analyst, DevOps) using weighted lexical & semantic criteria.
* **Tier Unlock Predictor**: Real-time likelihood gauges for Tier 1 (Google, Microsoft, Amazon), Tier 2 (Barclays, Razorpay, Swiggy), and Tier 3 (TCS, Infosys, Wipro).
* **Google XYZ Format Bullet Rewrites**: Automatically transforms weak resume bullets into high-impact `Accomplished [X] as measured by [Y], by doing [Z]` achievements with real, contextual engineering metrics (latency, throughput, cache hit rates) without bracketed placeholders.
* **PDF Exporter**: Clean single-click export of optimized resume bullets into ATS-friendly PDF format.

---

### 💻 Module 02: Company OA Practice Hub & Multi-Language IDE
* **LeetCode-Style Code Runner**: Interactive problem environment with multi-language support (**Python, JavaScript, C++, Java**), custom test case console, and real-time backend sandbox execution.
* **Filter by Target Company Patterns**: Curated question database mapped to hiring rounds of top tech giants (Google, Amazon, Microsoft, Barclays, and more).
* **Theory & Conceptual Verification**: Dedicated MCQ modes for Aptitude, DBMS, Computer Networks, and Operating Systems without unnecessary code runners.
* **Live Hiring Drive Timers**: Real-time countdowns for upcoming campus recruitment deadlines, registration windows, and eligibility batch tracking.

---

### 🛡️ AI Proctoring & Multi-Layer Anti-Cheat System
* **Browser-Level Tab Switch & Focus Monitoring**: Detects when candidates switch browser tabs (`document.visibilitychange`) or lose window focus (`window.onblur`), instantly logging violations and issuing warning chimes.
* **Lighting-Invariant Gaze & Presence Tracking**: High-performance YCbCr face presence & centroid tracking running client-side across Chrome, Edge, Firefox, and Safari without requiring experimental flags.
* **Clipboard Restrictions**: Enforces test integrity by locking copy, cut, and paste actions during timed rounds.
* **3-Strike Disqualification Engine**: Real-time HUD displaying gaze direction, strike counts, and an automatic disqualification modal upon repeated infractions.

---

### 🎙️ Module 03: Live Voice AI HR & Technical Interview Simulator
* **Interactive Voice Interviewer**: Natural speech synthesis and continuous Web Speech API voice capture simulating a real recruiter persona.
* **Dynamic Role-Specific Questioning**: Dynamically tailored technical and behavioral questions generated for the candidate's chosen stack.
* **Comprehensive Hiring Verdict**: In-depth breakdown evaluating technical knowledge density, communication clarity, and confidence delivery with actionable feedback.

---

## 🏗️ Architecture & Technology Stack

```
PlacementBuddy/
├── frontend/                     # Next.js App Router (Client & Serverless API)
│   ├── app/                      # Application routes
│   │   ├── page.tsx              # Home Dashboard
│   │   ├── resume-helper/        # ATS Resume Scorer & Rewriter
│   │   ├── oa-rounds/            # OA Practice Hub & Timed Arenas
│   │   ├── ai-interviewer/       # Live AI Voice Interviewer
│   │   └── api/                  # NextAuth & Next.js Serverless Routes
│   ├── components/               # Navbar, AuthGate, ProctorTracker, etc.
│   └── lib/data/                 # Curated questions, tests, and calendar data
│
└── backend/                      # High-Performance FastAPI Microservice
    ├── main.py                   # FastAPI entrypoint & CORS middleware
    ├── db.py                     # Neon PostgreSQL connection & pooling
    └── routers/
        ├── resume.py             # ATS scoring algorithm & metric generator
        ├── oa.py                 # Multi-language sandboxed code executor
        └── interview.py          # AI interview evaluator
```

---

## ⚡ Getting Started Locally

### Prerequisites
* **Node.js** 18.x or later
* **Python** 3.11+
* **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/Aamogh021/PlacementBuddy.git
cd PlacementBuddy
```

---

### 2. Configure Environment Variables
Copy the template to create your `.env.local` file:
```bash
cp .env.example .env.local
```

Fill in your respective credentials:
* **Google OAuth**: Client ID & Secret from [Google Cloud Console](https://console.cloud.google.com/)
* **NextAuth**: Random 32-byte secret string (`NEXTAUTH_SECRET`)
* **Neon PostgreSQL**: Connection string from [Neon Console](https://console.neon.tech/)

---

### 3. Start the Backend Server (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
# Windows:
python -m venv .venv
.venv\Scripts\activate
# macOS/Linux:
# python3 -m venv .venv
# source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
> The API server will be live at `http://127.0.0.1:8000`. You can inspect interactive OpenAPI documentation at `http://127.0.0.1:8000/docs`.

---

### 4. Start the Frontend Application (Next.js)

Open a **separate terminal**:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
> The application will be accessible at `http://localhost:3000`.

---

## 🔒 Security & Privacy Notice
* Sensitive keys and credentials (`.env*`, database connection strings, client secrets) are strictly excluded from version control via `.gitignore`.
* Always keep your secret keys stored safely in `.env.local` or your deployment platform's secret manager.

---

## 🤝 Contributing
Contributions, suggestions, and issue reports are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
