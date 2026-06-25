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

**Spot&Solve** is a civic technology platform that empowers citizens to report community issues—such as potholes, broken streetlights, or illegal dumping—with just a photo. 

Instead of waiting days for human triaging, Spot&Solve uses **Google Gemini Vision AI** to instantly analyze the uploaded photo, categorize the issue, determine its severity, and auto-dispatch tickets. Built with a stunning, motion-rich user interface, Spot&Solve makes community maintenance transparent and engaging.

## 🚀 Key Features

- **🤖 AI Auto-Triage**: Snap a picture, and Gemini AI will automatically generate a description, categorize the issue, and assign a severity level.
- **🗺️ Live Heatmap**: An interactive Mapbox implementation displaying all active tickets in your city in real-time.
- **🏆 Gamification**: Users earn XP, level up, and collect badges (e.g., "First Responder", "Pothole Hunter") for submitting valid reports.
- **🔐 Seamless Auth**: Google and Anonymous Guest sign-in powered by Firebase Authentication.
- **⚡ Real-time Feed**: A stunning "Community" dashboard where users can see and upvote recent reports.
- **📱 Mobile Optimized**: Beautiful, app-like UI with a floating dock, built for taking photos on the go using WebRTC camera integration.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion, Shadcn UI
- **Backend & Database:** Firebase (Firestore, Storage, Admin SDK)
- **Authentication:** Firebase Auth
- **AI Integration:** Google Gen AI SDK (Gemini 1.5 Flash/Pro)
- **Maps:** Mapbox GL JS
- **Rate Limiting:** Upstash Redis

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) installed. You will also need active accounts for Firebase, Mapbox, Google Gemini, and Upstash Redis.

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

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

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

## 📁 Project Structure

Check out the [codemap.md](./codemap.md) for a detailed breakdown of the codebase architecture and directory structure!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
