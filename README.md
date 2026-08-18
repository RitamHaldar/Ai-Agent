# Axion AI – Full-Stack AI Research Platform

A high-performance, tool-augmented AI search and research platform built with the MERN stack, LangChain, Pinecone, and Socket.IO. Axion AI combines real-time WebSockets streaming, vector RAG (Retrieval-Augmented Generation), live web search via Tavily, and vision model capabilities into a sleek, glassmorphism-inspired UI.

![Demo](https://axion-ai-h2ll.onrender.com)

---

## 📊 Empirical Benchmarks & Performance Metrics

All performance metrics below were empirically measured on local environment benchmarks under reproducible load test scripts.

### ⚡ 1. Socket.IO Streaming vs. REST Baseline (TTFT)
*Measured over 5 full-generation test runs comparing traditional non-streaming REST against Socket.IO streaming:*

| Metric | Measured Value | Description |
| :--- | :--- | :--- |
| **Streaming TTFT (Average)** | **`1,576.02 ms`** | User-perceived time to first generated chunk |
| **Streaming TTFT (P95)** | **`1,734.78 ms`** | 95th percentile first-chunk delivery latency |
| **REST Baseline Duration (Avg)** | **`5,319.93 ms`** | Total execution time required without streaming |
| **Absolute Initial Latency Saved** | **`3,743.91 ms`** | Speedup to first visible output |
| **Time-to-First-Token Reduction** | **`70.38%`** | **`((5319.93 - 1576.02) / 5319.93) * 100`** |

---

### 🔍 2. Pinecone Vector DB & RAG Retrieval Performance
*Measured over 30 semantic search queries against indexed PDF document embeddings (`MistralAIEmbeddings` + Pinecone Metadata Filter):*

| Metric | Measured Value | Description |
| :--- | :--- | :--- |
| **Pinecone DB Query Latency (Avg)** | **`345.64 ms`** | Direct vector index lookup in Pinecone DB |
| **Full Pipeline Avg Retrieval** | **`1,240.75 ms`** | Text embedding generation + Pinecone vector query |
| **Median Pipeline Retrieval** | **`~980.00 ms`** | Median sample duration across 30 query test suite |
| **Full Pipeline P95 Latency** | **`2,359.08 ms`** | 95th percentile retrieval duration |
| **Full Pipeline P99 Latency** | **`3,598.56 ms`** | Maximum sample duration including cold-start spikes |

---

### 🚀 3. Express API Latency & Throughput Load Test
*Measured using Autocannon load tester with 50 concurrent connections over 10 seconds:*

| Metric | Measured Value |
| :--- | :--- |
| **Requests / Second (Average)** | **`27,596.37 req/sec`** |
| **Requests / Second (Peak / P50)** | **`27,999.00 req/sec`** |
| **Average Route Latency** | **`1.17 ms`** |
| **P50 / P97.5 / P99 Latency** | **`1 ms / 2 ms / 2 ms`** |
| **Maximum Latency** | **`22.00 ms`** |
| **Network Throughput** | **`15.00 MB / sec`** |
| **Total Processed Requests** | **`304,000 requests in 11.02s`** |

---

## 🛠️ Architecture & Tech Stack

```
[React 19 + Redux Toolkit + Tailwind v4]
       │
       ├─────────────────────────────────────────┐
       │ (1) POST /api/chat/message              │ (2) Socket.IO Connection
       │     [FormData: message, chatId,         │     ws://server
       │      pdf file, socketId]                │
       ▼                                         ▼
[Express Router /chats.routes.js]         [Socket.IO Server]
       │                                         │
       ├─► Identifyuser Middleware               │
       │     • Cookie-based JWT verification     │
       │     • Redis Token Blacklist check       │
       │                                         │
       ├─► Multer Middleware                     │
       │     • Memory Storage (Buffer)           │
       │                                         │
       ├─► chatController                        │
       │     ├─► [PDF Upload]                    │
       │     │   • pdf-parse & RecursiveSplitter │
       │     │   • MistralAIEmbeddings           │
       │     │   • Pinecone Index ("axionai")    │
       │     │                                   │
       │     ├─► [Image Upload]                  │
       │     │   • Stepfun Vision Model (NVIDIA) │
       │     │                                   │
       │     └─► [LangChain Agent Execution]     │
       │         • ChatMistralAI                 │
       │         • Tools: Pinecone RAG + Tavily  │
       │         │                               │
       │         │ (3) Token Streaming (60-char) │
       │         └──────────────────────────────►│ Emit "message" chunk
       ▼                                         ▼
[MongoDB Storage]                        [React UI Component]
```

### Stack Breakdown

* **Frontend**: React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router 7, Lucide Icons, KaTeX Math.
* **Backend**: Node.js, Express.js 5, Socket.IO, Multer (Memory Storage), `bcryptjs`, JWT, Google Gmail API (`googleapis`).
* **Databases & Cache**: MongoDB (`mongoose`), Redis (`ioredis`), Pinecone Vector DB.
* **AI & Orchestration**: LangChain, Mistral AI (`mistral-medium-latest`, `mistral-embed`), Tavily AI (`@tavily/core`), Stepfun Vision (`stepfun-ai/step-3.7-flash`).

---

## ⚙️ Project Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Instance
* Redis Server
* API Keys: Mistral AI, Tavily, Pinecone, Google Gmail OAuth

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RitamHaldar/Ai-Agent.git
   cd Perplexity
   ```

2. **Configure Environment Variables**:
   Create a `Backend/.env` file:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   MISTRAL_API_KEY=your_mistral_key
   PINECONE_API_KEY=your_pinecone_key
   TAVILY_API_KEY=your_tavily_key
   NVIDIA_API_KEY=your_nvidia_key
   ```

3. **Install Dependencies & Start Backend**:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

4. **Start Frontend**:
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---

## 🧪 Running Benchmarks

Standalone benchmark scripts are included in the repository:

* **Socket.IO Time-To-First-Token (TTFT)**:
  ```bash
  cd Backend
  node benchmarks/benchmark_ttft.js
  ```
* **Pinecone Vector RAG Retrieval Benchmark**:
  ```bash
  cd Backend
  node benchmarks/benchmark_pinecone.js
  ```
* **API Load Test**:
  ```bash
  npx autocannon -c 50 -d 10 -m GET http://localhost:3000/api/auth/getme
  ```

---

## 🌐 Live Demo

🔗 **Live Application**: [https://axion-ai-h2ll.onrender.com](https://axion-ai-h2ll.onrender.com)
