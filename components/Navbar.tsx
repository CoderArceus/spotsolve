"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "Report Issue", href: "/report" },
    { name: "Live Map", href: "/map" },
    { name: "Community", href: "/community" },
  ];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="glass-card px-4 py-2 rounded-full flex items-center gap-6 shadow-2xl">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white px-2">
          <span className="text-emerald-500">●</span>
          <span className="tracking-tight">Spot&Solve</span>
        </Link>
        
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
