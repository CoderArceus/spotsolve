# Spot&Solve - Architecture Overview

This document provides a comprehensive overview of the current state of the Spot&Solve codebase, reflecting all recent fixes and architectural decisions.

## 1. System Architecture

Spot&Solve is a hyperlocal issue dispatcher built on **Next.js 14 (App Router)**. It leverages **Google's Gemini 2.5 Flash** for multimodal AI analysis and **Firebase Firestore** for database persistence.

### High-Level Flow
1. **Client (Browser):** User uploads an image and provides their location on the `/report` page.
2. **Client-side Compression:** The image is instantly compressed in the browser via an HTML `<canvas>` to a maximum dimension of 1024px. This prevents hitting the 4MB Gemini API payload limit and the 1MB Firestore document limit.
3. **API Endpoint (`/api/analyze-issue`):** The Next.js backend receives the request.
4. **Rate Limiter:** A memory-based sliding window rate limiter protects the API (currently relaxed to 100 requests/hour for hackathon testing).
5. **AI Pass 1 (Tool Calling):** The image is sent to `gemini-2.5-flash` with the `CRITICAL_ALERT_TOOL`. The model decides if the issue requires immediate emergency dispatch.
6. **AI Pass 2 (Structured Extraction):** The same model is asked to extract the category, severity, and description according to a strict Zod schema.
7. **Database Persistence:** The finalized `Ticket` (containing the Base64 image URL) is stored in Firebase Firestore. This step is non-blocking to prevent UI crashes if the database is uninitialized.
8. **Client Update:** The AI's parsed response is returned to the user, and the issue appears on the `/dashboard`.

## 2. Core Technologies

*   **Framework:** Next.js 14 (React 19)
*   **Styling:** Tailwind CSS 4 + Shadcn/ui
*   **AI Engine:** `@google/genai` (v2.9.0) using `gemini-2.5-flash`
*   **Database:** Firebase Admin SDK (Firestore)
*   **Validation:** Zod

## 3. Directory Structure

```text
spotsolve-anti/
├── app/
│   ├── api/
│   │   └── analyze-issue/
│   │       └── route.ts        # The core AI orchestrator
│   ├── dashboard/
│   │   └── page.tsx            # Live city feed and Map
│   ├── report/
│   │   └── page.tsx            # Submission portal
│   ├── layout.tsx              # Root layout & Navbar
│   └── page.tsx                # Gamified Landing Page
├── components/
│   ├── IssueUploader.tsx       # Handles Drag & Drop, Compression, Submission
│   ├── CityDashboard.tsx       # Fetches from Firestore & renders the map
│   ├── SeverityBadge.tsx       # UI primitive
│   └── ui/                     # Shadcn components (Button, Input, Card, etc)
├── lib/
│   ├── firebase.ts             # Client-side Firebase init
│   ├── firebase-admin.ts       # Server-side Admin init (HMR safe)
│   ├── gemini.ts               # Prompts, schemas, and tool definitions
│   ├── imageValidator.ts       # Client-side file size/MIME validation & Compression
│   ├── rateLimiter.ts          # In-memory IP-based rate limiting
│   └── schemas.ts              # Zod schemas for the API
└── types/
    └── index.ts                # TypeScript interfaces (Ticket, AnalysisResult)
```

## 4. Key Fixes Implemented

*   **Firestore 1MB Limit:** User photos are now compressed locally. For the backend, if a Base64 string somehow still exceeds 800KB, it is safely swapped for a placeholder instead of crashing the server.
*   **Gemini 4MB Payload Limit:** By compressing the image on the client-side *before* it hits the API, the system avoids throwing a `413 Payload Too Large` error, which previously caused the backend to fall back to the hardcoded mock data.
*   **HMR Safety:** `adminDb.settings()` in `firebase-admin.ts` is now wrapped in a try/catch to prevent the Next.js dev server from crashing upon hot-reloading.
*   **Non-blocking DB Writes:** If the user hasn't yet initialized Firestore in their Google Cloud Console (throwing a `NOT_FOUND` error), the app gracefully logs a warning and still returns the Gamification / Ticket data to the UI.
*   **Model Upgrades:** Successfully migrated from `gemini-1.5-flash` to `gemini-2.5-flash` to align with the new Google AI Studio API key capabilities.

## 5. Phase 4 Roadmap
The next iteration of the project focuses on an ultra-modern UI, zero clutter, and deep gamification loops. Please reference the dedicated [PHASE_4_UX.md](file:///Users/aryan/spotsolve-anti/PHASE_4_UX.md) document for the complete vision, including the transition to Linear/Arc-level aesthetics, shadcn/ui components, and the new `/heroes` and `/community` layers.
