# Bus Compliance Platform

## Overview
Bus Compliance is an enterprise-grade SaaS platform designed to automate regulatory compliance analysis using Agentic AI. The system ingests documents (PDF/Word), performs semantic analysis against regulatory frameworks using RAG (Retrieval-Augmented Generation), and generates professional compliance reports.

## System Architecture
This project follows a strict Monorepo structure separating the NestJS backend and React frontend.

### Tech Stack
- **Backend**: NestJS, TypeScript, PostgreSQL, TypeORM
- **AI & RAG**: LangChain, Pinecone, OpenAI/Anthropic (Claude)
- **Async Processing**: BullMQ (Redis-based queues)
- **Real-time**: Socket.IO with Redis Adapter
- **Billing**: Stripe (Subscription & Webhooks)
- **Storage**: AWS S3 (Presigned URLs)
- **Frontend**: React, Tailwind CSS

## Directory Structure

```text
backend/
├── src/
│   ├── analysis/       # RAG Engine, Queues, and Gateways
│   ├── auth/           # JWT, Role Guards, and Stripe Registration
│   ├── billing/        # Stripe Webhooks and Checkout
│   ├── organizations/  # Multi-tenancy logic
│   ├── pdf/            # Puppeteer Report Generation
│   └── storage/        # S3 Integration

frontend/
├── src/
│   ├── components/     # Dashboard, Admin, and Upload UI
│   └── services/       # API Clients and Interceptors
```

## Key Features

1.  **Multi-Tenant Architecture**: Organization-based data isolation with Stripe subscription enforcement (Basic/Pro/Enterprise tiers).
2.  **AI Analysis Pipeline**: 
    - Uploads are secured via S3 Presigned URLs.
    - Documents are vector-embedded via Pinecone.
    - `AnalysisWorker` processes files asynchronously, emitting real-time progress via WebSockets.
3.  **Professional Reporting**: Generates downloadable PDF reports with charts and QR codes using Puppeteer.
4.  **Admin Oversight**: specialized dashboards for tracking AI token usage and MRR (Monthly Recurring Revenue).

## Setup

1.  **Environment Variables**: Configure `.env` in `backend/` with Stripe keys, AWS credentials, Pinecone Index, and AI API keys.
2.  **Dependencies**: Run `npm install` in both `backend` and `frontend` directories.
3.  **Infrastructure**: Ensure Redis and PostgreSQL are running locally or via Docker.
4.  **Start**: 
    - Backend: `npm run start:dev`
    - Frontend: `npm run dev`
