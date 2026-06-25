<div align="center">
  <img src="public/globe.svg" alt="Spot&Solve Logo" width="100" />
  <h1>Spot&Solve</h1>
  <p><strong>Hyperlocal, AI-Powered Civic Infrastructure Dispatcher</strong></p>
  <p>
    Report, track, and solve community issues faster with the power of Artificial Intelligence.
  </p>
</div>

<hr />

## 🌟 About

**Spot&Solve** is a civic technology platform developed for a hackathon that empowers citizens to report community issues—such as potholes, broken streetlights, or illegal dumping—with just a photo. 

Instead of waiting days for human triaging, Spot&Solve uses **Google Gemini Vision AI** to instantly analyze the uploaded photo, categorize the issue, determine its severity, and auto-dispatch tickets. Currently, tickets are auto-dispatched by persisting them to Firestore with structured metadata, queued for consumption by a mock municipal admin dashboard or future government APIs.

## 🚀 Key Features

- **🤖 AI Auto-Triage & Gatekeeping**: Snap a picture, and Gemini AI will automatically generate a description, categorize the issue, and assign a severity level. The AI prompt is strictly configured to reject non-civic issues, screenshots, and irrelevant images to maintain database integrity.
- **📍 Reverse Geocoding & City Boundaries**: Automatically captures GPS coordinates and translates them into human-readable addresses using the Nominatim API. It also performs server-side boundary validation to ensure reports are only accepted within supported city limits.
- **🔄 Auto-Clustering & Logarithmic Priority**: Prevents duplicate spam by automatically clubbing reports within 30 meters of each other into the same ticket. Each unique report increments the ticket's confirmation count, which dynamically calculates and scales the Priority Score logarithmically.
- **📸 Camera-Only Uploads**: Bypasses the device gallery and forces real-time WebRTC camera uploads to ensure all photos are genuine and current, drastically reducing spam.
- **🛡️ Spam Prevention & Rate Limiting**: Employs mandatory 20-minute IP cooldowns and requires Google Authenticated accounts to maintain high signal-to-noise ratios.
- **🗺️ Live Heatmap**: An interactive Mapbox implementation displaying all active tickets in your city in real-time.
- **⚡ Real-time Feed**: A "Community" dashboard where users can see recent reports and their statuses.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Shadcn UI
- **Backend & Database:** Firebase (Firestore, Admin SDK)
- **Authentication:** Firebase Auth
- **AI Integration:** Google Gen AI SDK (Gemini 2.5 Flash)
- **Maps:** Mapbox GL JS
- **Geocoding:** Nominatim OpenStreetMap API

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed. You will also need active accounts for Firebase, Mapbox, and Google Gemini.

### 1. Clone the repository
```bash
git clone https://github.com/CoderArceus/spotsolve.git
cd spotsolve
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
