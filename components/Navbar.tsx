"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map, PlusCircle, Users, User, ShieldAlert } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Live Map", href: "/map", icon: Map },
    { name: "Report", href: "/report", icon: PlusCircle },
    { name: "Community", href: "/community", icon: Users },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="h-[64px] glass flex items-center gap-2 px-2 rounded-[32px] shadow-2xl">
        <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-colors mx-2 group">
          <ShieldAlert className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
        </Link>
        
        <div className="w-[1px] h-8 bg-white/10 mx-1" />
        
        <div className="flex items-center gap-1 px-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors group ${
                  isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="dock-indicator"
                    className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              </Link>
            );
          })}
        </div>

        <div className="w-[1px] h-8 bg-white/10 mx-1" />
        
        <button className="flex items-center justify-center w-12 h-12 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors mx-2 group">
          <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </nav>
    </div>
  );
}
