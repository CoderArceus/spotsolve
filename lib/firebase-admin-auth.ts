import { getAuth } from "firebase-admin/auth";
import { getApps } from "firebase-admin/app";
import "./firebase-admin"; // Ensure the app is initialized

export const adminAuth = getApps().length ? getAuth() : getAuth();
