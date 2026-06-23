import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spot&Solve — Hyperlocal Issue Dispatcher",
  description: "Report and track community infrastructure issues powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground min-h-screen font-sans antialiased relative overflow-x-hidden"
        suppressHydrationWarning
      >
        <AuthProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
