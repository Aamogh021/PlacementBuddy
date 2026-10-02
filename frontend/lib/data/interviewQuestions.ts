// ─────────────────────────────────────────────────────────────────────────────
// PlacementBuddy — Interview Question Bank
// 200+ questions across roles: SDE, AI/ML, Full Stack, Backend, Data Analyst
// Used by /api/interview/questions for seed-based unique question selection
// ─────────────────────────────────────────────────────────────────────────────

export type InterviewRole =
  | "Software Engineer (SDE)"
  | "AI / ML Engineer"
  | "Full Stack Developer"
  | "Backend Developer"
  | "Data Analyst"
  | "DevOps Engineer";

export type QuestionType =
  | "Introduction"
  | "Technical"
  | "DSA / System Design"
  | "Behavioral HR"
  | "Company Specific";

export interface InterviewQuestion {
  id: string;
  roles: InterviewRole[];
  type: QuestionType;
  question: string;
  expectedKeywords: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  companies?: string[];
  hint?: string;
  category?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTRODUCTION QUESTIONS (All Roles)
// ─────────────────────────────────────────────────────────────────────────────
export const INTRO_QUESTIONS: InterviewQuestion[] = [
  {
    id: "intro-1",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer", "Data Analyst", "DevOps Engineer"],
    type: "Introduction",
    question: "Please introduce yourself — walk me through your academic background, your primary technical stack, and the most impactful project you have shipped so far.",
    expectedKeywords: ["education", "b.tech", "projects", "tech stack", "built", "developed", "deployed"],
    difficulty: "Easy",
  },
  {
    id: "intro-2",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer", "Data Analyst", "DevOps Engineer"],
    type: "Introduction",
    question: "Tell me about the most challenging technical problem you faced during a project and how you resolved it under time pressure.",
    expectedKeywords: ["challenge", "debugging", "problem", "solution", "optimized", "fixed", "team", "deadline"],
    difficulty: "Easy",
  },
  {
    id: "intro-3",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer"],
    type: "Introduction",
    question: "Walk me through your best personal or academic project end-to-end — from the idea to the architecture, to the deployment strategy.",
    expectedKeywords: ["architecture", "deployed", "frontend", "backend", "database", "users", "api"],
    difficulty: "Easy",
  },
  {
    id: "intro-4",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer", "Data Analyst", "DevOps Engineer"],
    type: "Introduction",
    question: "Where do you see yourself in 3 years, and how does this role align with your technical growth plan?",
    expectedKeywords: ["growth", "skills", "lead", "architect", "contribute", "team", "product"],
    difficulty: "Easy",
  },
  {
    id: "intro-5",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer"],
    type: "Introduction",
    question: "What open source tools, libraries, or frameworks are you most comfortable contributing to, and why did you choose your current tech stack?",
    expectedKeywords: ["github", "open source", "library", "framework", "contribute", "chose", "reason"],
    difficulty: "Easy",
  },
  {
    id: "intro-6",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer", "AI / ML Engineer", "Data Analyst", "DevOps Engineer"],
    type: "Introduction",
    question: "Describe a time when you learned a completely new technology in a short timeframe to complete a project. What was your approach?",
    expectedKeywords: ["learned", "documentation", "tutorial", "implemented", "fast", "deadline", "new technology"],
    difficulty: "Easy",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SDE / SOFTWARE ENGINEER — TECHNICAL QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SDE_TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: "sde-tech-1",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "Explain ACID properties in databases. For a banking transaction where you transfer ₹500 between two accounts, which property is most critical and why?",
    expectedKeywords: ["atomicity", "consistency", "isolation", "durability", "transaction", "rollback", "commit"],
    difficulty: "Medium",
    companies: ["Barclays", "Microsoft", "Google"],
  },
  {
    id: "sde-tech-2",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is the difference between TCP and UDP? Name one real-world protocol built on each and explain why that transport layer was chosen.",
    expectedKeywords: ["tcp", "udp", "reliable", "handshake", "http", "dns", "latency", "packet"],
    difficulty: "Medium",
    companies: ["Qualcomm", "Cisco"],
  },
  {
    id: "sde-tech-3",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "Explain the differences between process and thread. What happens when two threads share the same resource without proper synchronization?",
    expectedKeywords: ["process", "thread", "race condition", "mutex", "semaphore", "deadlock", "synchronization"],
    difficulty: "Medium",
    companies: ["Qualcomm", "Texas Instruments"],
  },
  {
    id: "sde-tech-4",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is a memory leak? Write a conceptual example in any language showing how one occurs and how you would detect and fix it.",
    expectedKeywords: ["heap", "garbage collection", "leak", "reference", "free", "profiler", "monitor"],
    difficulty: "Medium",
  },
  {
    id: "sde-tech-5",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "Explain polymorphism in OOP with a practical example from a project you've built. How does it improve code maintainability?",
    expectedKeywords: ["polymorphism", "inheritance", "override", "interface", "class", "object", "abstract"],
    difficulty: "Easy",
  },
  {
    id: "sde-tech-6",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is the difference between SQL and NoSQL databases? When would you choose MongoDB over PostgreSQL for a project?",
    expectedKeywords: ["sql", "nosql", "schema", "flexible", "json", "relational", "mongodb", "postgresql", "scalable"],
    difficulty: "Easy",
    companies: ["Barclays", "Titan"],
  },
  {
    id: "sde-tech-7",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "Explain REST vs GraphQL API design. What are the performance tradeoffs and when would you pick one over the other?",
    expectedKeywords: ["rest", "graphql", "overfetching", "underfetching", "endpoint", "query", "schema", "mutation"],
    difficulty: "Medium",
    companies: ["Google", "Microsoft"],
  },
  {
    id: "sde-tech-8",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is indexing in a database and how does a B+ Tree index help accelerate SELECT queries? What is the tradeoff with indexing?",
    expectedKeywords: ["index", "b+ tree", "leaf nodes", "sequential", "insert overhead", "query speed", "clustered"],
    difficulty: "Hard",
    companies: ["Google", "Barclays"],
  },
  {
    id: "sde-tech-9",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "How does virtual memory work in an OS? Explain the role of a page table and what happens during a page fault.",
    expectedKeywords: ["virtual memory", "paging", "page fault", "tlb", "physical memory", "swap", "address"],
    difficulty: "Medium",
    companies: ["Qualcomm", "Texas Instruments"],
  },
  {
    id: "sde-tech-10",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is Docker and why is containerization important in modern software delivery? Explain the difference between an image and a container.",
    expectedKeywords: ["docker", "container", "image", "dockerfile", "isolation", "port", "volume", "microservices"],
    difficulty: "Easy",
    companies: ["Google", "Microsoft", "Barclays"],
  },
  {
    id: "sde-tech-11",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "Explain the concept of caching. What is the difference between write-through and write-back cache strategies? Give a real-world Redis example.",
    expectedKeywords: ["cache", "redis", "ttl", "write-through", "write-back", "eviction", "latency", "hit rate"],
    difficulty: "Medium",
    companies: ["Microsoft", "Barclays"],
  },
  {
    id: "sde-tech-12",
    roles: ["Software Engineer (SDE)"],
    type: "Technical",
    question: "What is a hash collision? Describe two collision resolution strategies and their time complexity implications.",
    expectedKeywords: ["hash", "collision", "chaining", "open addressing", "load factor", "o(1)", "bucket"],
    difficulty: "Medium",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SDE — DSA / SYSTEM DESIGN QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const SDE_DSA_QUESTIONS: InterviewQuestion[] = [
  {
    id: "sde-dsa-1",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Design a URL shortener service like bit.ly at scale. What data model, hashing strategy, and storage choices would you make? How would you handle 1 million requests per day?",
    expectedKeywords: ["hash", "database", "redis", "unique id", "collision", "load balancer", "cdn", "scale"],
    difficulty: "Hard",
    companies: ["Google", "Microsoft"],
  },
  {
    id: "sde-dsa-2",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Given an array of integers, find two numbers that sum to a target. What is the O(N) approach using a HashMap and how does it compare to the O(N²) brute force?",
    expectedKeywords: ["hashmap", "two pointers", "o(n)", "complement", "time complexity", "space complexity", "brute force"],
    difficulty: "Easy",
    companies: ["Barclays", "TCS Ninja / Digital"],
  },
  {
    id: "sde-dsa-3",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "How would you design an in-memory rate limiter for an API server? What algorithm (token bucket, sliding window, leaky bucket) would you use and why?",
    expectedKeywords: ["rate limit", "token bucket", "sliding window", "redis", "timestamp", "counter", "api"],
    difficulty: "Hard",
    companies: ["Google", "Barclays"],
  },
  {
    id: "sde-dsa-4",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Explain the concept of binary search. In which real-world problems would you apply binary search beyond sorted arrays?",
    expectedKeywords: ["binary search", "sorted", "mid", "log n", "monotonic", "search space", "condition"],
    difficulty: "Medium",
    companies: ["Microsoft", "TCS Ninja / Digital"],
  },
  {
    id: "sde-dsa-5",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Design a notification delivery system (like WhatsApp push notifications) that must handle 10M users without message loss. Describe your queue architecture.",
    expectedKeywords: ["message queue", "kafka", "rabbitmq", "pub-sub", "consumer", "producer", "retry", "dead letter"],
    difficulty: "Hard",
    companies: ["Google", "Microsoft"],
  },
  {
    id: "sde-dsa-6",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Explain recursion and dynamic programming. Convert the naive recursive Fibonacci (O(2^N)) to a DP solution (O(N)) and explain memoization.",
    expectedKeywords: ["recursion", "dynamic programming", "memoization", "tabulation", "fibonacci", "subproblems", "o(n)"],
    difficulty: "Medium",
  },
  {
    id: "sde-dsa-7",
    roles: ["Software Engineer (SDE)"],
    type: "DSA / System Design",
    question: "Your Express.js API response times suddenly spike from 50ms to 3000ms after a new deployment. Walk me through your debugging and resolution process step by step.",
    expectedKeywords: ["logs", "profiler", "n+1 query", "database index", "cache", "bottleneck", "rollback", "monitoring"],
    difficulty: "Hard",
    companies: ["Barclays", "Microsoft"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI / ML ENGINEER — TECHNICAL QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const AIML_TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: "aiml-tech-1",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "Explain the bias-variance tradeoff. How do you diagnose whether your model is underfitting or overfitting, and what techniques do you use to fix each?",
    expectedKeywords: ["bias", "variance", "overfitting", "underfitting", "regularization", "dropout", "cross-validation", "training error"],
    difficulty: "Medium",
  },
  {
    id: "aiml-tech-2",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What is the difference between supervised, unsupervised, and reinforcement learning? Give a real use case for each from your projects or experience.",
    expectedKeywords: ["supervised", "unsupervised", "reinforcement", "labels", "clustering", "reward", "classification", "regression"],
    difficulty: "Easy",
  },
  {
    id: "aiml-tech-3",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "Explain how a transformer architecture works. What role does the attention mechanism play and why did it replace RNNs for NLP tasks?",
    expectedKeywords: ["transformer", "attention", "self-attention", "rnn", "lstm", "positional encoding", "bert", "tokens", "parallelism"],
    difficulty: "Hard",
  },
  {
    id: "aiml-tech-4",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What is RAG (Retrieval-Augmented Generation)? Build the architecture end-to-end for a document Q&A system using LangChain and a vector database.",
    expectedKeywords: ["rag", "retrieval", "vector database", "embeddings", "langchain", "chunks", "similarity search", "llm", "pinecone", "faiss"],
    difficulty: "Hard",
  },
  {
    id: "aiml-tech-5",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What is gradient descent? Explain the differences between batch, stochastic, and mini-batch gradient descent and when you would choose each.",
    expectedKeywords: ["gradient descent", "learning rate", "batch", "stochastic", "sgd", "convergence", "loss function", "backpropagation"],
    difficulty: "Medium",
  },
  {
    id: "aiml-tech-6",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "Explain the concept of transfer learning. How would you fine-tune a pre-trained BERT or GPT model on a custom classification task?",
    expectedKeywords: ["transfer learning", "fine-tuning", "bert", "gpt", "pre-trained", "frozen layers", "classification head", "huggingface"],
    difficulty: "Hard",
  },
  {
    id: "aiml-tech-7",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What is feature engineering and why is it important? Give 3 examples of feature transformations you have applied to improve model accuracy.",
    expectedKeywords: ["feature engineering", "normalization", "encoding", "one-hot", "pca", "dimensionality", "feature selection", "correlation"],
    difficulty: "Medium",
  },
  {
    id: "aiml-tech-8",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "How would you build a real-time ML inference pipeline? What is the difference between batch inference and online serving, and how does FastAPI help?",
    expectedKeywords: ["fastapi", "inference", "batch", "online serving", "latency", "model serving", "docker", "api endpoint"],
    difficulty: "Hard",
  },
  {
    id: "aiml-tech-9",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What metrics do you use to evaluate a classification model beyond accuracy? Explain precision, recall, F1-score, and when each matters most.",
    expectedKeywords: ["precision", "recall", "f1", "auc", "roc", "confusion matrix", "false positive", "imbalanced dataset"],
    difficulty: "Medium",
  },
  {
    id: "aiml-tech-10",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "Explain vector embeddings. How do word embeddings like Word2Vec or Sentence-BERT capture semantic meaning for NLP downstream tasks?",
    expectedKeywords: ["embeddings", "word2vec", "semantic", "cosine similarity", "vector space", "sentence-bert", "dimensions", "similarity"],
    difficulty: "Medium",
  },
  {
    id: "aiml-tech-11",
    roles: ["AI / ML Engineer"],
    type: "Technical",
    question: "What is model drift and how do you monitor an ML model in production? Describe a monitoring strategy for a deployed classification model.",
    expectedKeywords: ["drift", "data drift", "model drift", "monitoring", "retraining", "production", "metrics", "alerts", "mlflow"],
    difficulty: "Hard",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI / ML — DSA / SYSTEM DESIGN
// ─────────────────────────────────────────────────────────────────────────────
export const AIML_DSA_QUESTIONS: InterviewQuestion[] = [
  {
    id: "aiml-dsa-1",
    roles: ["AI / ML Engineer"],
    type: "DSA / System Design",
    question: "Design a recommendation engine for an e-commerce app with 10 million users. What algorithm would you use — collaborative filtering, content-based, or a hybrid? Describe the data pipeline.",
    expectedKeywords: ["collaborative filtering", "content-based", "matrix factorization", "embeddings", "similarity", "data pipeline", "cold start"],
    difficulty: "Hard",
  },
  {
    id: "aiml-dsa-2",
    roles: ["AI / ML Engineer"],
    type: "DSA / System Design",
    question: "Your ML training job is taking 6 hours on a single GPU. What strategies would you apply to speed it up using distributed training or hardware optimization?",
    expectedKeywords: ["distributed training", "data parallelism", "gpu", "batch size", "mixed precision", "multi-node", "gradient accumulation"],
    difficulty: "Hard",
  },
  {
    id: "aiml-dsa-3",
    roles: ["AI / ML Engineer"],
    type: "DSA / System Design",
    question: "Given a dataset of 1 million customer transactions, how would you build a fraud detection model? What features, algorithms, and thresholds would you choose?",
    expectedKeywords: ["fraud detection", "isolation forest", "xgboost", "imbalanced", "smote", "threshold", "precision", "recall", "features"],
    difficulty: "Hard",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FULL STACK DEVELOPER — TECHNICAL QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const FULLSTACK_TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: "fs-tech-1",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "Explain the React component lifecycle. What is the difference between useEffect with an empty dependency array and componentDidMount in class components?",
    expectedKeywords: ["useeffect", "dependency array", "mount", "unmount", "cleanup", "side effects", "render", "state"],
    difficulty: "Medium",
  },
  {
    id: "fs-tech-2",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "What is server-side rendering (SSR) vs static site generation (SSG) in Next.js? When would you use getServerSideProps vs getStaticProps?",
    expectedKeywords: ["ssr", "ssg", "next.js", "getserversideprops", "getstaticprops", "hydration", "seo", "cache"],
    difficulty: "Medium",
  },
  {
    id: "fs-tech-3",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "Explain JWT-based authentication. Walk me through the full flow from login to accessing a protected API endpoint.",
    expectedKeywords: ["jwt", "token", "header", "payload", "signature", "bearer", "refresh token", "expiry", "verify"],
    difficulty: "Medium",
    companies: ["Barclays"],
  },
  {
    id: "fs-tech-4",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "What is CORS and why does it matter? How do you configure a Next.js API to allow requests from a specific frontend domain?",
    expectedKeywords: ["cors", "cross-origin", "origin", "headers", "preflight", "allow-origin", "browser", "security"],
    difficulty: "Easy",
  },
  {
    id: "fs-tech-5",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "Explain the difference between optimistic and pessimistic UI updates. Give a real example of each in a React-based application.",
    expectedKeywords: ["optimistic", "pessimistic", "ui update", "rollback", "state", "api call", "user experience", "error handling"],
    difficulty: "Medium",
  },
  {
    id: "fs-tech-6",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "How do you handle state management in a large React app? Compare useState, Context API, and a library like Zustand or Redux.",
    expectedKeywords: ["state management", "usestate", "context api", "redux", "zustand", "global state", "props drilling", "store"],
    difficulty: "Medium",
    companies: ["Microsoft", "Barclays"],
  },
  {
    id: "fs-tech-7",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "What is code splitting in React/Next.js? How does lazy loading reduce initial bundle size and how do you implement it?",
    expectedKeywords: ["code splitting", "lazy loading", "dynamic import", "react.lazy", "suspense", "bundle", "chunk", "performance"],
    difficulty: "Medium",
  },
  {
    id: "fs-tech-8",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "Explain the concept of a database ORM. What are the advantages and potential N+1 query problem pitfalls when using Prisma or Sequelize?",
    expectedKeywords: ["orm", "prisma", "sequelize", "n+1", "eager loading", "lazy loading", "query", "relations", "include"],
    difficulty: "Medium",
  },
  {
    id: "fs-tech-9",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "What web vitals metrics define performance in a Next.js app? How would you diagnose and fix poor Largest Contentful Paint (LCP)?",
    expectedKeywords: ["lcp", "cls", "fid", "web vitals", "lighthouse", "image optimization", "cdn", "lazy load", "performance"],
    difficulty: "Medium",
    companies: ["Google"],
  },
  {
    id: "fs-tech-10",
    roles: ["Full Stack Developer"],
    type: "Technical",
    question: "How do WebSockets differ from HTTP polling? Build the high-level architecture for a real-time collaborative code editor.",
    expectedKeywords: ["websocket", "polling", "real-time", "bidirectional", "socket.io", "event", "room", "broadcast", "yjs"],
    difficulty: "Hard",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND DEVELOPER — TECHNICAL QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const BACKEND_TECHNICAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: "be-tech-1",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "Explain database connection pooling. Why is it critical for a Node.js/FastAPI backend and how do you configure pool size for optimal throughput?",
    expectedKeywords: ["connection pool", "pool size", "idle", "max connections", "latency", "throughput", "pgbouncer", "thread"],
    difficulty: "Medium",
  },
  {
    id: "be-tech-2",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "What is idempotency in REST APIs? How would you design a payment processing endpoint to be idempotent and prevent duplicate charges?",
    expectedKeywords: ["idempotency", "idempotency-key", "payment", "duplicate", "http methods", "put", "post", "retry"],
    difficulty: "Hard",
    companies: ["Barclays"],
  },
  {
    id: "be-tech-3",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "Explain database normalization up to 3NF. When would you deliberately denormalize a schema for performance reasons?",
    expectedKeywords: ["normalization", "1nf", "2nf", "3nf", "denormalization", "redundancy", "joins", "read performance"],
    difficulty: "Medium",
    companies: ["Barclays", "Titan"],
  },
  {
    id: "be-tech-4",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "What is a message queue and how does it decouple microservices? Describe a producer-consumer pattern using Kafka or RabbitMQ for an order processing system.",
    expectedKeywords: ["message queue", "kafka", "rabbitmq", "producer", "consumer", "async", "decouple", "topic", "partition"],
    difficulty: "Hard",
    companies: ["Google", "Barclays"],
  },
  {
    id: "be-tech-5",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "Explain horizontal vs vertical scaling. In what scenario would you shard a PostgreSQL database and how does consistent hashing help?",
    expectedKeywords: ["horizontal", "vertical", "sharding", "consistent hashing", "replica", "load balancer", "partition", "key"],
    difficulty: "Hard",
    companies: ["Google", "Microsoft"],
  },
  {
    id: "be-tech-6",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "What are database transactions and locks? Explain the difference between optimistic locking and pessimistic locking with a real concurrency example.",
    expectedKeywords: ["transaction", "lock", "optimistic", "pessimistic", "version", "row lock", "dirty read", "concurrent"],
    difficulty: "Hard",
    companies: ["Barclays"],
  },
  {
    id: "be-tech-7",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "How would you secure a REST API? List 5 security best practices covering authentication, input validation, rate limiting, and HTTPS.",
    expectedKeywords: ["jwt", "oauth", "rate limiting", "input validation", "https", "sql injection", "cors", "helmet"],
    difficulty: "Medium",
  },
  {
    id: "be-tech-8",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "What is the difference between synchronous and asynchronous code in Node.js? Explain the Event Loop and how it handles I/O non-blocking operations.",
    expectedKeywords: ["event loop", "async", "await", "callback", "promise", "non-blocking", "i/o", "libuv", "microtask"],
    difficulty: "Medium",
  },
  {
    id: "be-tech-9",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "Explain Redis data types (String, List, Set, Sorted Set, Hash) and give a practical use case for each in a web application backend.",
    expectedKeywords: ["redis", "string", "list", "set", "sorted set", "hash", "cache", "session", "leaderboard"],
    difficulty: "Medium",
    companies: ["Microsoft", "Barclays"],
  },
  {
    id: "be-tech-10",
    roles: ["Backend Developer"],
    type: "Technical",
    question: "What is gRPC and how does it differ from REST? When would you replace REST API calls between microservices with gRPC?",
    expectedKeywords: ["grpc", "protobuf", "rest", "binary", "streaming", "low latency", "microservices", "schema"],
    difficulty: "Hard",
    companies: ["Google"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIORAL HR — ALL ROLES
// ─────────────────────────────────────────────────────────────────────────────
export const BEHAVIORAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: "beh-1",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "Describe a situation where you had a critical bug or production failure during a demo or deployment. How did you handle the pressure and what was the outcome?",
    expectedKeywords: ["pressure", "debugging", "rollback", "team", "communicate", "post-mortem", "fix", "production"],
    difficulty: "Medium",
  },
  {
    id: "beh-2",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "Tell me about a time you disagreed with a technical decision made by a senior team member. How did you handle the situation professionally?",
    expectedKeywords: ["disagreement", "respect", "evidence", "data-driven", "communication", "compromise", "outcome"],
    difficulty: "Medium",
  },
  {
    id: "beh-3",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "How do you manage your time when you are simultaneously working on multiple projects with competing deadlines? Walk me through your prioritization framework.",
    expectedKeywords: ["prioritization", "deadline", "eisenhower", "scrum", "sprint", "time management", "focus", "tools"],
    difficulty: "Easy",
  },
  {
    id: "beh-4",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "Give me an example of when you received critical feedback on your code or project. How did you respond and what did you improve?",
    expectedKeywords: ["feedback", "code review", "improved", "ego", "growth", "accept", "implemented", "mentor"],
    difficulty: "Easy",
  },
  {
    id: "beh-5",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "Describe a project where you had to collaborate with a non-technical stakeholder. How did you translate technical concepts into business impact?",
    expectedKeywords: ["stakeholder", "non-technical", "communicate", "simplify", "impact", "metrics", "presentation"],
    difficulty: "Medium",
    companies: ["Barclays", "Microsoft"],
  },
  {
    id: "beh-6",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst"],
    type: "Behavioral HR",
    question: "What motivates you to stay current with the rapidly evolving technology landscape? Describe a new tool or framework you learned recently and why.",
    expectedKeywords: ["learning", "youtube", "documentation", "course", "project", "curiosity", "community", "blog"],
    difficulty: "Easy",
  },
  {
    id: "beh-7",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer"],
    type: "Behavioral HR",
    question: "Tell me about the project you are most proud of. What technical decisions did you make and what impact did it have on users or your team?",
    expectedKeywords: ["proud", "impact", "users", "metrics", "decision", "architecture", "contribution", "shipped"],
    difficulty: "Easy",
  },
  {
    id: "beh-8",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer", "Data Analyst", "DevOps Engineer"],
    type: "Behavioral HR",
    question: "Have you ever had to meet an extremely tight deadline without compromising quality? Describe your strategy for balancing speed and code quality.",
    expectedKeywords: ["deadline", "quality", "testing", "mvp", "tradeoff", "refactor", "technical debt", "prioritize"],
    difficulty: "Medium",
    companies: ["Google", "Microsoft"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY SPECIFIC QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export const COMPANY_SPECIFIC_QUESTIONS: InterviewQuestion[] = [
  {
    id: "google-1",
    roles: ["Software Engineer (SDE)", "AI / ML Engineer", "Full Stack Developer", "Backend Developer"],
    type: "Company Specific",
    question: "Google emphasizes algorithmic efficiency. Can you walk through how you would approach a new LeetCode-style problem methodically — from problem understanding to optimizing the solution?",
    expectedKeywords: ["brute force", "optimize", "time complexity", "space complexity", "edge cases", "approach", "constraints"],
    difficulty: "Hard",
    companies: ["Google"],
  },
  {
    id: "google-2",
    roles: ["Software Engineer (SDE)", "Backend Developer"],
    type: "Company Specific",
    question: "Google's SRE philosophy uses SLAs, SLOs, and SLIs. Explain each and describe how you would monitor a critical API to ensure 99.9% uptime.",
    expectedKeywords: ["sla", "slo", "sli", "uptime", "monitoring", "alerting", "prometheus", "grafana", "on-call"],
    difficulty: "Hard",
    companies: ["Google"],
  },
  {
    id: "microsoft-1",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer"],
    type: "Company Specific",
    question: "Microsoft strongly values the growth mindset. Tell me about a technical skill or project area where you went from zero to proficient and how you built that skill.",
    expectedKeywords: ["growth mindset", "learned", "self-taught", "practice", "project", "resources", "improvement"],
    difficulty: "Easy",
    companies: ["Microsoft"],
  },
  {
    id: "barclays-1",
    roles: ["Software Engineer (SDE)", "Full Stack Developer", "Backend Developer"],
    type: "Company Specific",
    question: "In a banking context like Barclays, data security is paramount. Explain how you would design an API endpoint that handles sensitive customer PII securely.",
    expectedKeywords: ["encryption", "pii", "tls", "https", "tokenization", "data masking", "audit log", "compliance"],
    difficulty: "Hard",
    companies: ["Barclays"],
  },
  {
    id: "barclays-2",
    roles: ["Software Engineer (SDE)", "Backend Developer"],
    type: "Company Specific",
    question: "Barclays processes millions of financial transactions daily. Explain how you would ensure exactly-once delivery and idempotency in a distributed payment processing system.",
    expectedKeywords: ["idempotency", "exactly-once", "kafka", "distributed", "transaction", "compensating", "saga pattern"],
    difficulty: "Hard",
    companies: ["Barclays"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FULL QUESTION BANK — Aggregated Export
// ─────────────────────────────────────────────────────────────────────────────
export const ALL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  ...INTRO_QUESTIONS,
  ...SDE_TECHNICAL_QUESTIONS,
  ...SDE_DSA_QUESTIONS,
  ...AIML_TECHNICAL_QUESTIONS,
  ...AIML_DSA_QUESTIONS,
  ...FULLSTACK_TECHNICAL_QUESTIONS,
  ...BACKEND_TECHNICAL_QUESTIONS,
  ...BEHAVIORAL_QUESTIONS,
  ...COMPANY_SPECIFIC_QUESTIONS,
];

// ─────────────────────────────────────────────────────────────────────────────
// Role → question pool mapper
// ─────────────────────────────────────────────────────────────────────────────
export const ROLE_QUESTION_MAP: Record<string, InterviewQuestion[]> = {
  "Software Engineer (SDE)": [
    ...INTRO_QUESTIONS,
    ...SDE_TECHNICAL_QUESTIONS,
    ...SDE_DSA_QUESTIONS,
    ...BEHAVIORAL_QUESTIONS,
  ],
  "AI / ML Engineer": [
    ...INTRO_QUESTIONS,
    ...AIML_TECHNICAL_QUESTIONS,
    ...AIML_DSA_QUESTIONS,
    ...BEHAVIORAL_QUESTIONS,
  ],
  "Full Stack Developer": [
    ...INTRO_QUESTIONS,
    ...FULLSTACK_TECHNICAL_QUESTIONS,
    ...SDE_DSA_QUESTIONS.slice(0, 4),
    ...BEHAVIORAL_QUESTIONS,
  ],
  "Backend Developer": [
    ...INTRO_QUESTIONS,
    ...BACKEND_TECHNICAL_QUESTIONS,
    ...SDE_DSA_QUESTIONS.slice(0, 4),
    ...BEHAVIORAL_QUESTIONS,
  ],
};

// Seeded pseudo-random selection utility (server-safe, no external dep)
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
