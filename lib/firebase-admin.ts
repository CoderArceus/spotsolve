import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

try {
  if (!getApps().length) {
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n").replace(/^"|"$/g, "");
    }
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

export const adminDb = getFirestore();
try {
  adminDb.settings({ ignoreUndefinedProperties: true });
} catch (e) {
  // Ignore error if settings are already configured (Next.js HMR)
}
export const adminStorage = getStorage();
