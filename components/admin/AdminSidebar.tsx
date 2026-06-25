"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  HardHat, 
  BarChart3, 
  ShieldAlert, 
  Users, 
  Shield, 
  LogOut 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Workers", href: "/admin/workers", icon: HardHat },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Moderation", href: "/admin/moderation", icon: ShieldAlert },
  { name: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 glass border-r border-white/5 flex flex-col z-50">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <Shield className="w-8 h-8 text-emerald-500" />
        <span className="font-bold tracking-tight text-white">Civic Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
                isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
