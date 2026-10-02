# 🚀 PlacementBuddy — Complete System Architecture & Technical Specifications

**PlacementBuddy** is an end-to-end, full-stack, AI-powered placement preparation and technical assessment platform designed for Computer Science and Software Engineering candidates. It delivers automated ATS resume scoring with company tier unlocking, company-curated Online Assessment (OA) practice with code execution simulators, and a live face-to-face AI mock interviewer powered by real-time speech recognition and camera feed integration.

---

## 🛠️ 1. A-to-Z Tech Stack & Application Matrix

| Subsystem / Layer | Technology | Version / Spec | Specific Application & Functionality |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js** | `v16.3.1` (App Router) | Core full-stack web framework. Leverages Client Components (`"use client"`), Server Components, and Next.js Serverless API Routes (`/api/...`). |
| **Backend Engine** | **FastAPI (Python 3.13)** | `v0.115+` | High-throughput backend for ATS binary document parsing (PDF, DOCX, DOC), non-blocking code execution runner, and AI interview evaluation. |
| **Database** | **Neon PostgreSQL** | `Serverless` | High-performance serverless cloud Postgres with autoscaling and connection pooling for resume records, OA code submissions, and interview evaluations. |
| **Backend Hosting** | **Render** | `Python Web Service` | Production containerized Python/FastAPI environment binding to `0.0.0.0:$PORT` with Uvicorn. |
| **Frontend Hosting** | **Vercel** | `Next.js Edge / Serverless` | Global edge CDN hosting Next.js frontend, proxying API requests to Render backend securely. |
| **Language** | **TypeScript & Python** | `TS 5.x / Py 3.13` | Static type safety on frontend & high-performance text/code computation on backend. |
| **UI Rendering** | **React** | `v19.2.8` | Component-driven declarative UI. Manages complex client states (`useState`, `useEffect`, `useRef`, `useContext`). |
| **Document Parsers** | **pypdf & python-docx** | Latest | Binary extraction of text, tables, and sections from uploaded candidate resumes without data loss. |
| **Styling & Design System** | **Tailwind CSS** | `v4.x` | Utility-first responsive styling engine with dark theme tokens (`slate-950`, `indigo`, `cyan`), glassmorphism backdrop blurs, and responsive grid/flex layouts. |
| **Icons & Visual Indicators** | **Lucide React** | `v1.33.0` | Provides scalable vector icons (`Sparkles`, `FileText`, `Code2`, `Video`, `ShieldCheck`, `Lock`, `Target`, `Award`, `TrendingUp`, `Zap`, `Building2`, `Cpu`). |
| **Authentication** | **NextAuth.js** | `v4.24.11` | OAuth authentication provider integrating Google Sign-In with global session persistence (`SessionProvider`). |
| **Route Protection** | **AuthGate Component** | Custom Client Gate | Route-guard wrapper requiring user login before accessing protected tools (Resume Helper, OA Practice, AI Interviewer). |
| **Browser Speech Engine** | **Web Speech API** | Native Browser (`webkitSpeechRecognition`) | Performs real-time speech-to-text transcription during live AI interviews without external cloud API dependencies. |
| **Browser Vision Engine** | **MediaDevices API** | Native Browser (`getUserMedia`) | Streams live webcam feed into HTML5 `<video>` element for realistic face-to-face mock interview practice. |
| **Font System** | **Google Fonts** | `Inter` & `JetBrains Mono` | Optimized via Next.js Font API. `Inter` for crisp UI readability and `JetBrains Mono` for code snippets and technical metrics. |

---

## 🏗️ 2. Repository & Directory Structure Map

```text
placement-buddy/
├── app/                                # Next.js App Router Root
│   ├── layout.tsx                      # Global Root Layout (Injects Inter/JetBrains fonts, AuthProvider, dark background)
│   ├── page.tsx                        # Home Dashboard (Hero, feature cards, live placement metrics, company tiers)
│   ├── globals.css                     # Tailwind CSS v4 directives, custom scrollbars & glassmorphic utility classes
│   │
│   ├── resume-helper/                  # 📄 FEATURE 1: ATS Resume Scorer & Tier Unlocker
│   │   └── page.tsx                    # Resume text input, role target selection, score gauges, tier cards & rewrite engine
│   │
│   ├── oa-rounds/                      # 💻 FEATURE 2: Online Assessment (OA) Practice Hub
│   │   └── page.tsx                    # Category/company filterable question database, code simulator & OA calendar
│   │
│   ├── ai-interviewer/                 # 🎙️ FEATURE 3: Live Face-to-Face AI HR/Tech Interviewer
│   │   └── page.tsx                    # Webcam stream player, voice transcription log, recruiter persona & evaluation modal
│   │
│   └── api/                            # ⚡ Next.js Serverless API Endpoints
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts            # Google OAuth 2.0 NextAuth handler
│       │
│       ├── resume/
│       │   └── analyze/
│       │       └── route.ts            # POST: ATS scoring formula, keyword scanning, tier unlocks & metric-driven rewrites
│       │
│       └── interview/
│           └── evaluate/
│               └── route.ts            # POST: Speech log evaluation, technical keyword density, detail scoring & hiring verdict
│
├── components/                         # Shared & Reusable UI Components
│   ├── Navbar.tsx                      # Sticky top header with navigation links, live user profile & mobile responsive drawer
│   ├── AuthProvider.tsx                # NextAuth SessionProvider wrapper exposing authentication state to client tree
│   └── AuthGate.tsx                    # Protected route modal overlay enforcing Google Sign-In before accessing tool features
│
├── data/                               # Data Schemas & Static Datasets
│   └── oaQuestions.ts                  # Structured TypeScript database for company questions, insights, and OA calendar events
│
├── .env.local                          # Environment secret keys (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET)
├── next.config.ts                      # Next.js configuration options
├── tailwindcss / postcss config        # Styling build chain configurations
└── package.json                        # Project dependencies and script declarations
```

---

## ⚡ 3. Complete Feature Breakdown & Operational Logic

### 📄 Feature 1: ATS Resume Helper & Company Tier Unlocker
* **Purpose:** Enables candidates to evaluate their resume against real ATS (Applicant Tracking System) criteria and unlock target company placement tiers.
* **Role-based Scanning:** Supports 6 distinct target engineering roles:
  1. *Software Development Engineer (SDE 1)*
  2. *AI / Machine Learning Engineer*
  3. *Full Stack Web Developer*
  4. *Backend Developer*
  5. *Data Analyst*
  6. *DevOps Engineer*
* **Scoring Engine Logic (`/api/resume/analyze`):**
  * **Keyword Match Score (35%):** Scans resume text against role-specific technical keyword libraries.
  * **Quantifiable Impact Score (25%):** Uses regular expressions to detect numbers, percentages, metrics ($\%$, $\$$, latency improvements, user scale).
  * **Structure Score (25%):** Verifies key standard sections (`Education`, `Experience/Projects`, `Skills`, `Contact Links`).
  * **Formatting Score (15%):** Evaluates character density, word counts, and formatting clarity.
* **Company Tier Unlock Thresholds:**
  * **Tier 1 (Product Giants - 18 to 45 LPA):** Unlocked at $\ge 82\%$ ATS Score *(Google, Microsoft, Uber, Amazon)*.
  * **Tier 2 (Unicorns & Fintech - 9 to 18 LPA):** Unlocked at $\ge 68\%$ ATS Score *(Barclays, Razorpay, Zomato, Qualcomm)*.
  * **Tier 3 (IT Services - 4 to 8 LPA):** Unlocked at $\ge 45\%$ ATS Score *(TCS Digital, Infosys, Wipro, Accenture)*.
* **AI Bullet Point Rewriter:** Automatically extracts raw resume bullet points and rewrites them to include quantifiable action verbs, performance metrics, and latency figures.

---

### 💻 Feature 2: Online Assessment (OA) Practice Hub
* **Purpose:** Prepares candidates for round-1 online coding and technical screening tests conducted by top hiring companies.
* **Category Coverage:**
  1. **DSA & Coding** (Arrays, Trees, Graphs, DP)
  2. **DBMS** (SQL Joins, Indexing, ACID, Transactions)
  3. **Computer Networks** (TCP/IP, HTTP/2, DNS, OSI Layers)
  4. **Operating Systems** (Paging, Thread Sync, Deadlocks, Process Scheduling)
  5. **Aptitude & Logical Reasoning**
  6. **Object-Oriented Programming (OOPs)**
* **Interactive Code Simulator:** Supports live solution code inspection, input test case execution, time complexity analysis ($O(N)$, $O(N \log N)$), and step-by-step technical explanations.
* **Company Intelligence:** Shows company-specific OA frequency, top tested topics, and upcoming on-campus/off-campus hiring dates via the **OA Calendar**.

---

### 🎙️ Feature 3: Face-to-Face AI Mock Interviewer
* **Purpose:** Simulates a realistic HR & Technical face-to-face interview experience with interactive video and voice recognition.
* **Camera Feed Player:** Connects to native HTML5 `navigator.mediaDevices.getUserMedia` to render the user's video stream alongside an animated recruiter avatar.
* **Speech-to-Text Transcription:** Integrates `webkitSpeechRecognition` to convert live user voice answers into transcript logs in real time.
* **Dynamic Recruiter Persona:** Generates HR and technical questions tailored to the selected candidate role and target company (e.g., Google, Barclays, Microsoft).
* **AI Evaluation Engine (`/api/interview/evaluate`):**
  * Evaluates technical keyword density, response length, and communication structure.
  * Outputs detailed metrics: **Technical Knowledge**, **Communication Clarity**, and **Confidence Delivery**.
  * Renders a final **Hiring Verdict** (`Shortlisted / Hired` vs `Improvement Needed`) with targeted advice and company-specific tips.

---

### 🔒 Feature 4: Global Authentication & Route Security
* **NextAuth.js Google Provider:** Allows candidates to sign in securely using their Google Account.
* **`AuthGate` Guard Component:** Wraps protected tool pages. When an unauthenticated user attempts to access protected features, `AuthGate` displays a glassmorphic authorization modal explaining the benefits of signing in before unlocking access.

---

## 🔄 4. System Architecture & Data Flow Diagrams

### End-to-End Platform Architecture Flow

```mermaid
flowchart TD
    Candidate([👤 Candidate User]) -->|Navigates| AppRouter[Next.js App Router]
    
    subgraph Client UI Layer
        AppRouter --> Home[Page / Dashboard]
        AppRouter --> ResumePage[/resume-helper]
        AppRouter --> OAPage[/oa-rounds]
        AppRouter --> InterviewPage[/ai-interviewer]
    end

    subgraph Security & Access Layer
        ResumePage & OAPage & InterviewPage --> AuthGateCheck{AuthGate Component}
        AuthGateCheck -->|Session Active| ToolAccess[Grant Feature Access]
        AuthGateCheck -->|No Session| AuthModal[Display Google Login Gate]
        AuthModal -->|Sign In| GoogleOAuth[NextAuth Google Provider]
        GoogleOAuth -->|Session Token| AuthProvider[AuthProvider Context]
    end

    subgraph Serverless API Engine
        ToolAccess -->|POST Resume & Role| ResumeAPI[/api/resume/analyze]
        ResumeAPI --> ATSFormula[ATS 4-Factor Weighted Algorithm]
        ATSFormula --> TierLogic[Calculate Tier Unlocks 1 / 2 / 3]
        ATSFormula --> RewriteLogic[Generate Metric Bullet Rewrites]

        ToolAccess -->|Fetch Questions| OADataset[(data/oaQuestions.ts)]
        
        ToolAccess -->|Media Stream| WebCam[HTML5 MediaDevices API]
        ToolAccess -->|Voice Input| SpeechEngine[Web Speech Recognition API]
        SpeechEngine -->|POST Speech Log & Role| EvalAPI[/api/interview/evaluate]
        EvalAPI --> TechScorer[Technical Keyword Density Engine]
        EvalAPI --> CommScorer[Communication & Detail Scorer]
        EvalAPI --> VerdictEngine[Hiring Verdict & Advice Generator]
    end

    subgraph Response Payload Layer
        ResumeAPI -->|JSON Payload| ResumePage
        OADataset -->|TypeScript Objects| OAPage
        EvalAPI -->|JSON Evaluation| InterviewPage
    end
```

---

## 🧮 5. Core Algorithmic Formulas & Logic

### 1. ATS Resume Overall Score Calculation
$$\text{ATS Score} = \Big(0.35 \times S_{\text{Keyword}}\Big) + \Big(0.25 \times S_{\text{Metrics}}\Big) + \Big(0.25 \times S_{\text{Structure}}\Big) + \Big(0.15 \times S_{\text{Formatting}}\Big)$$

Where:
* $S_{\text{Keyword}} = \min\left(100, \left\lfloor \frac{\text{Detected Role Keywords}}{\text{Target Keyword Threshold}} \times 100 \right\rfloor\right)$
* $S_{\text{Metrics}} = \min(100, \max(35, \text{Metric Regex Matches} \times 8))$
* $S_{\text{Structure}} = \text{Education (25)} + \text{Experience/Projects (35)} + \text{Skills (25)} + \text{Contact Links (15)}$

---

### 2. Interview Overall Evaluation Score
$$\text{Overall Score} = \Big(0.40 \times S_{\text{Tech}}\Big) + \Big(0.30 \times S_{\text{Comm}}\Big) + \Big(0.30 \times S_{\text{Conf}}\Big)$$

* **Hiring Threshold:** Overall Score $\ge 68\%$ triggers **🎉 Shortlisted / Hired** status.

---

## ⚙️ 6. Environment Setup & Execution Specifications

### Required Environment Variables (`.env.local`)
```env
# Google OAuth 2.0 Credentials (From Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_generated_random_secret_32_chars
NEXTAUTH_URL=http://localhost:3000
```

### Development & Production Commands
```bash
# 1. Install Dependencies
npm install

# 2. Run Local Development Server
npm run dev

# 3. Production Build Validation
npm run build

# 4. Start Production Server
npm start
```

---

## 🌐 7. Production Deployment Architecture

```text
┌────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
│     Vercel Edge        │  HTTPS  │     Render Web Svc     │ TCP/SSL │    Neon PostgreSQL     │
│  Next.js 16 (React 19) ├────────►│     FastAPI (Python)   ├────────►│   Serverless Cluster   │
│  app.vercel.app        │         │  backend.onrender.com  │         │  ep-*.neon.tech/neondb │
└────────────────────────┘         └────────────────────────┘         └────────────────────────┘
```

### Production Environment Variables Summary

| Target Host | Variable Name | Purpose | Example Value |
| :--- | :--- | :--- | :--- |
| **Vercel** | `FASTAPI_URL` | Backend URL for Next.js BFF proxy routes | `https://placementbuddy-backend.onrender.com` |
| **Vercel** | `NEXT_PUBLIC_API_URL` | Client-accessible backend URL | `https://placementbuddy-backend.onrender.com` |
| **Vercel** | `NEXTAUTH_SECRET` | Cryptographic secret for session cookies | `openssl rand -base64 32` |
| **Vercel** | `NEXTAUTH_URL` | Canonical frontend origin | `https://placementbuddy.vercel.app` |
| **Vercel** | `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console | `*.apps.googleusercontent.com` |
| **Vercel** | `GOOGLE_CLIENT_SECRET` | OAuth Client Secret | Standard Google OAuth secret |
| **Render** | `DATABASE_URL` | Neon PostgreSQL pooled connection string | `postgresql://user:pass@ep-pooler.neon.tech/neondb?sslmode=require` |
| **Render** | `ALLOWED_ORIGINS` | Comma-separated permitted frontend domains | `https://placementbuddy.vercel.app` |
| **Render** | `PORT` | Auto-assigned web service port | Provided by Render (`10000` / `$PORT`) |
| **Render** | `GEMINI_API_KEY` | Optional Gemini API key for advanced AI | Google AI Studio API key |


