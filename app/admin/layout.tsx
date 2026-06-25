import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) {
    redirect("/");
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Check Firestore for role
    const userDoc = await adminDb.collection("users").doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      redirect("/");
    }
    
    const role = userDoc.data()?.role;
    
    if (role !== "admin" && role !== "super_admin") {
      redirect("/");
    }

  } catch (error) {
    console.error("[AdminLayout] Auth error:", error);
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
