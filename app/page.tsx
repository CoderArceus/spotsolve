"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert, Activity, CheckCircle, MapPin, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function Home() {
  return (
    <div className="min-h-screen pb-32 pt-24">
      {/* Top Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full overflow-hidden bg-emerald-950/80 backdrop-blur-md border-b border-emerald-500/20 py-2 text-xs font-semibold text-emerald-400 tracking-wide uppercase flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
          className="flex whitespace-nowrap w-max"
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 mx-8 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Powered by Gemini 2.5 Flash Autonomous Agents
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm mb-8">
              <Activity className="w-4 h-4 text-emerald-400" /> Spot&Solve V2 is live
            </div>
            
            <h1 className="text-5xl md:text-[64px] font-bold text-white tracking-tight leading-[1.05] mb-6">
              Community issues,<br />
              <span className="text-emerald-400">resolved in seconds.</span>
            </h1>
            
            <p className="text-base md:text-[17px] text-zinc-400 max-w-md leading-relaxed mb-10">
              Snap a photo of a pothole, leak, or hazard. Our AI validates, categorizes, and routes it directly to the right city engineering team — completely autonomously.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/report"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "bg-emerald-500 hover:bg-emerald-400 text-black rounded-full px-8 py-6 text-base font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,220,130,0.3)] gap-2 group w-full sm:w-auto justify-center"
                )}
              >
                Report an Issue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "glass hover:bg-white/10 text-white rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105 gap-2 w-full sm:w-auto justify-center"
                )}
              >
                View Live Map
              </Link>
            </div>
          </motion.div>

          {/* Right Column (Floating Cards/Mock Globe) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative h-[500px] w-full"
          >
            {/* Center Sphere Mock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-center">
              <ShieldAlert className="w-24 h-24 text-emerald-500/20" />
            </div>

            {/* Floating Card 1 */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[10%] right-[10%] glass-card p-4 flex items-center gap-4 border-emerald-500/20"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Issue Verified</p>
                <p className="text-zinc-400 text-xs">Pothole • Sector 9</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-[20%] left-[5%] glass-card p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Team Dispatched</p>
                <p className="text-zinc-400 text-xs">Water Leak • Downtown</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Issues Resolved", value: 1428, color: "text-emerald-400" },
            { label: "Active Heroes", value: 342, color: "text-white" },
            { label: "Avg Response (min)", value: 12, color: "text-white" },
            { label: "City Score", value: 94, color: "text-white" },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center">
              <div className={`text-4xl font-bold tracking-tight mb-2 ${stat.color}`}>
                <CountUp end={stat.value} duration={2.5} separator="," />
              </div>
              <div className="text-sm text-zinc-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* How it Works */}
        <div className="mt-32 text-center">
          <h2 className="text-[30px] font-bold text-white mb-12">Autonomy at scale.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "AI Triage", desc: "Instantly validates and classifies incoming reports with state-of-the-art vision models." },
              { icon: ShieldAlert, title: "Emergency Routing", desc: "Critical infrastructure hazards trigger immediate, automated alerts to city teams." },
              { icon: MapPin, title: "Live Geospatial Map", desc: "Track every open ticket across your neighborhood in real-time with verified coordinates." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glass-card p-8 text-left hover:border-emerald-500/30 group transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
