# Spot&Solve - Codebase Map

This document outlines the current architecture and directory structure of the **Spot&Solve** application (built with Next.js 14 App Router, Firebase, Mapbox, and Google Gemini).

## 📂 Directory Structure

```text
.
├── app/                      # Next.js App Router (Frontend Pages & Backend APIs)
│   ├── api/                  # Backend Serverless Functions
│   │   ├── analyze-issue/    # POST: Receives images, calls Gemini AI, creates Firestore ticket
│   │   ├── tickets/          # GET: Fetches ticket feed from Firestore
│   │   └── upvote/           # POST: Increments upvote count on a ticket
│   ├── community/            # Community Feed Page (Displays all reported issues)
│   ├── map/                  # Live Map Page (Mapbox integration showing issue locations)
│   ├── profile/              # User Profile Dashboard (Shows stats, badges, and user info)
│   ├── report/               # Issue Reporting Page (Hosts the IssueUploader)
│   ├── layout.tsx            # Root Layout (Wraps app in AuthProvider and renders Navbar)
│   └── page.tsx              # Landing Page (Hero section)
│
├── components/               # React UI Components
│   ├── IssueUploader.tsx     # Complex form for WebRTC camera, file uploads, and submission
│   ├── LoginModal.tsx        # Firebase Auth popup (Google & Anonymous)
│   ├── Navbar.tsx            # Floating bottom dock navigation
│   ├── TicketMapClient.tsx   # Mapbox implementation for rendering issue pins
│   ├── HeroesLeaderboard.tsx # Gamification leaderboard component
│   └── ui/                   # Reusable Shadcn UI components (buttons, cards, progress, etc)
│
├── lib/                      # Utilities and Integrations
│   ├── AuthContext.tsx       # Global React Context tracking Firebase Auth state
│   ├── firebase.ts           # Firebase Client SDK initialization (Auth, Firestore, Storage)
│   ├── firebase-admin.ts     # Firebase Admin SDK for secure backend API operations
│   ├── gemini.ts             # Google Gen AI integration logic
│   ├── imageValidator.ts     # Client-side image compression and validation
│   └── rateLimiter.ts        # Upstash Redis rate limiting for API routes
│
└── types/                    # TypeScript Type Definitions
    └── index.ts              # Interfaces for Tickets, Users, and Analysis Results
```

## 🏗️ Core Architecture Overview

### 1. Authentication (Firebase Auth)
- Handled client-side via `lib/firebase.ts` and `lib/AuthContext.tsx`.
- The `<AuthProvider>` wraps the root layout.
- The `LoginModal.tsx` provides UI for Google and Guest sign-ins. Unauthenticated users are prompted to sign in when accessing protected features like the `/profile` page.

### 2. Issue Reporting Flow (Gemini AI + Storage)
- **Frontend**: Users capture a photo via WebRTC or file upload in `IssueUploader.tsx`. Client-side compression runs (`lib/imageValidator.ts`).
- **Backend API**: The `/api/analyze-issue` route receives the payload.
- **AI Processing**: `lib/gemini.ts` analyzes the image for validity, category, and severity.
- **Database**: If valid, the image is uploaded to Firebase Storage and a ticket document is written to Firestore via `lib/firebase-admin.ts`.

### 3. Data Visualization (Mapbox & Feed)
- The `/community` route fetches the latest issues via `/api/tickets` and renders them in an `InfiniteTicketFeed.tsx`.
- The `/map` route plots the coordinates of these tickets onto a dark-themed Mapbox GL instance via `TicketMapClient.tsx`.
