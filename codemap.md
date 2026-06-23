# Spot&Solve — Hyperlocal Issue Dispatcher (Code Map)

Welcome to the Spot&Solve codebase! This document provides a high-level overview of the architecture and key files to help agents (and humans) swiftly understand the repository.

## Overview
Spot&Solve is a Next.js 14 App Router application that allows citizens to report public infrastructure issues (like potholes or broken streetlights) by uploading photos. The app uses **Google Gemini 1.5 Flash** (via the `@google/genai` SDK) to automatically analyze the photo, determine the issue category, assign a severity level, and autonomously dispatch critical alerts if a life-safety hazard is detected.

The backend relies on **Firebase Firestore** for database records and **Firebase Storage** (currently bypassed for Base64 Data URIs to avoid billing limits, though the code supports it).

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **AI Model:** Gemini 1.5 Flash (Multimodal + Tool Calling)
- **Database:** Firebase Firestore
- **Validation:** Zod

---

## Directory Structure

```
community-hero/
├── app/
│   ├── layout.tsx                     # Root layout, dark theme navbar
│   ├── page.tsx                       # Landing page -> redirects to /report
│   ├── report/
│   │   └── page.tsx                   # Citizen portal (Submit an issue)
│   ├── dashboard/
│   │   └── page.tsx                   # City dashboard (Live ticket feed & map)
│   ├── api/
│   │   ├── analyze-issue/
│   │   │   └── route.ts               # Core AI logic (Gemini analysis)
│   │   └── upvote/
│   │       └── route.ts               # Upvote an existing ticket
├── components/
│   ├── ui/                            # shadcn/ui components (Buttons, inputs, tabs)
│   ├── IssueUploader.tsx              # Main drag-and-drop report component
│   ├── TicketFeed.tsx                 # Live ticket list with severity badges
│   ├── TicketMap.tsx                  # react-leaflet interactive map (client-only)
│   └── StatsDashboard.tsx             # City-wide impact numbers
├── lib/
│   ├── firebase.ts                    # Firebase client initialization
│   ├── firebase-admin.ts              # Firebase Admin SDK (server-side writes)
│   ├── gemini.ts                      # Gemini client, system prompts, schemas, tools
│   └── schemas.ts                     # Zod schemas (Validation for UI & API)
├── types/
│   └── index.ts                       # Core TypeScript interfaces (Severity, Category, Ticket)
└── .env.local                         # API keys (Gemini, Firebase)
```

---

## Core File Deep Dive

### 1. `app/api/analyze-issue/route.ts`
The heart of the application. When a user submits an image:
1. Converts the image file to a Base64 string for Gemini inline data.
2. Uses `gemini-1.5-flash` in a **first pass** to evaluate the image against the `CRITICAL_ALERT_TOOL`. If it's a life-safety issue, Gemini autonomously triggers the tool.
3. Makes a **second pass** requesting `application/json` output matching `RESPONSE_SCHEMA`.
4. Parses the text, validates it via Zod (`GeminiResponseSchema`), and writes the final `Ticket` to Firestore via `adminDb`.
5. *Note: Features a try/catch fallback to mock data if the API hits a 429 Quota Exceeded error.*

### 2. `lib/gemini.ts`
Configuration for the Gemini API.
- Defines the `SYSTEM_PROMPT` guiding the AI to evaluate images and assign hazard severity (Low, Medium, High, Critical).
- Defines the `CRITICAL_ALERT_TOOL` declaration.
- Contains the `handleToolCall` function which closes the agentic loop when Gemini requests an emergency dispatch.

### 3. `components/IssueUploader.tsx`
Client component for the `/report` page.
- Handles HTML5 drag-and-drop for images.
- Captures geolocation (Latitude/Longitude).
- Submits `FormData` to `/api/analyze-issue`.
- Renders the resulting AI analysis, severity badge, and emergency dispatch notifications.

### 4. `types/index.ts` & `lib/schemas.ts`
These files are the source of truth for the data model.
- `Category` must be one of: `"Pothole", "Water Leak", "Broken Streetlight", "Waste Management", "Invalid"`.
- `Severity` must be one of: `"Low", "Medium", "High", "Critical"`.
- Zod schemas ensure that the API and UI are always dealing with strictly typed and valid data from the AI.
