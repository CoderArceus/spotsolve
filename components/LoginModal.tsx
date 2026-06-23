"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, User as UserIcon, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState<"google" | "anonymous" | null>(null);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(null);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLoading("anonymous");
      setError("");
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to continue as guest.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#111113] border border-[#27272a] rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
                  <ShieldAlert className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Join Spot&Solve</h2>
                <p className="text-zinc-400 text-sm mt-2">Sign in to earn XP, track your reports, and become a community hero.</p>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-500/50 text-red-300 text-xs px-3 py-2 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={!!loading}
                  className="w-full bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl p-3 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
                >
                  {loading === "google" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-[1px] bg-[#27272a]" />
                  <span className="text-xs text-zinc-500 font-medium">OR</span>
                  <div className="flex-1 h-[1px] bg-[#27272a]" />
                </div>

                <button
                  onClick={handleAnonymousSignIn}
                  disabled={!!loading}
                  className="w-full bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-zinc-300 rounded-xl p-3 flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
                >
                  {loading === "anonymous" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                  Continue as Guest
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
