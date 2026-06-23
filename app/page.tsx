"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-10 relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center max-w-3xl relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md shadow-2xl shadow-emerald-900/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Powered by Gemini 2.5 Flash
          </div>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
          Community issues,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            dispatched in seconds.
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-10">
          Snap a photo of a pothole, leak, or hazard. Our AI validates, categorizes, and routes it to the right team — completely autonomously.
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/report"
            className={cn(
              buttonVariants({ variant: "default" }),
              "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] gap-2 group"
            )}
          >
            Report an issue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/map"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "glass hover:bg-white/10 text-white rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 gap-2"
            )}
          >
            View live map
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full pt-16 z-10"
      >
        {[
          { icon: Zap, title: "AI Triage", desc: "Instantly validates and classifies incoming reports with state-of-the-art vision models." },
          { icon: Shield, title: "Emergency Routing", desc: "Critical infrastructure hazards trigger immediate, automated alerts to city engineering teams." },
          { icon: Map, title: "Live Geospatial Map", desc: "Track every open ticket across your neighborhood in real-time with verified coordinates." },
        ].map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Card className="glass-card p-6 text-left h-full group hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="font-semibold text-white text-lg mb-2">{title}</p>
              <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated Counter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="pt-12 z-10"
      >
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-2">Total Issues Resolved</p>
          <div className="text-4xl font-mono font-bold text-white tracking-tighter">
            <CountUp end={1428} duration={2.5} separator="," />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
