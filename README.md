# SmartWallet AI - NEXORA 2026

**"Your money should explain itself."**

SmartWallet AI is a next-generation personal finance platform that leverages Artificial Intelligence to automatically categorize transactions, analyze bank statements, and provide actionable financial insights to help users manage their money better.

---

## 🌟 Key Features

1. **AI-Powered Bank Statement Import**
   - Upload your bank statements directly.
   - LLMs (Large Language Models) instantly read, parse, and categorize your raw transaction data.
   - Automatically detects upcoming bills and generates auto-pilot budgets based on your spending habits.

2. **Dynamic Dashboard Overview**
   - Real-time "Financial Health" score based on intelligent spending ratios.
   - Interactive Spending Trend Area Chart.
   - Summarized view of recent transactions and upcoming bills.

3. **Smart Budgets System**
   - Predicts and tracks your spending limits per category.
   - Provides predictive warnings if you're on track to overspend.
   - Real-time synchronicity: budget progress bars automatically update as you log or import new expenses.

4. **Actionable AI Insights**
   - Continuously analyzes your spending patterns in the background.
   - Detects spending anomalies and budget overruns.
   - Suggests actionable recommendations (e.g., "Review General Spending").

---

## 🛠️ Tech Stack & Architecture

SmartWallet AI is built on a strict, highly-scalable 3-tier architecture:

### 1. Presentation Layer (Frontend)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with fluid typography and modern glassmorphism design principles)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Hosting**: Vercel (or Cloudflare Pages)

### 2. Application/Business Logic (Backend Edge API)
- **Framework**: Hono (Ultra-fast, lightweight web framework)
- **Environment**: Cloudflare Workers (Edge computing for global low latency)
- **AI Integration**: OpenRouter API (Accessing powerful LLMs for statement parsing and insights)

### 3. Data Access Layer (Database & Storage)
- **Relational Database**: Cloudflare D1 (Serverless SQLite at the edge)
- **Object Storage**: Cloudflare R2 (For storing user receipt metadata and raw statement uploads)

---

## 🚀 Setup Instructions

Follow these instructions to run the project locally.

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- A Cloudflare account (for Wrangler CLI)

### 1. Clone & Install
```bash
# Install dependencies in the root (if a root package.json exists) or within specific folders
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
1. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```
2. Apply local database migrations to create the schema:
   ```bash
   npx wrangler d1 migrations apply DB --local
   ```
3. Start the local backend development server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://127.0.0.1:8787`*

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```
1. Create a `.env.local` file in the frontend directory with the following variables:
   ```env
   # Point this to your backend (use the production URL or localhost depending on your testing)
   NEXT_PUBLIC_API_URL=https://spendly.developerstudio24.workers.dev/api
   
   # Mock Firebase credentials (used for development)
   NEXT_PUBLIC_FIREBASE_API_KEY=mock-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mock-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mock-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mock-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=mock-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=mock-app-id
   ```
2. Start the local frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`*

---

## ☁️ Deployment

### Deploying the Backend to Cloudflare
From the `backend` directory, run:
```bash
# First apply migrations to the remote production database
npx wrangler d1 migrations apply DB --remote

# Then deploy the worker
npx wrangler deploy
```

### Deploying the Frontend
The frontend can be easily deployed to Vercel or Cloudflare pages by connecting your GitHub repository and setting the `NEXT_PUBLIC_API_URL` environment variable to your deployed worker URL.
