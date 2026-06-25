"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Ticket } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { SeverityBadge } from "@/components/SeverityBadge";
import { MapPin, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function IssueTableClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [department, setDepartment] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDispatch = async () => {
    if (!selectedTicket || !department) return;
    setIsDispatching(true);
    
    try {
      const res = await fetch("/api/admin/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selectedTicket.id, department }),
      });

      if (!res.ok) throw new Error("Failed to dispatch");
      
      setSelectedTicket(null);
      setDepartment("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to dispatch issue.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Photo</th>
              <th className="px-6 py-4 font-medium">Category & Severity</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Reported</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {initialTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  {ticket.imageUrl ? (
                    <img src={ticket.imageUrl} alt="Issue" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <ImageIcon className="w-5 h-5 text-zinc-500" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white mb-1">{ticket.category}</div>
                  <SeverityBadge severity={ticket.severity} />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-flex items-center justify-center ${
                    ticket.status === "Dispatched" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    ticket.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    ticket.status === "Reported" ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {ticket.assignedDepartment || "Unassigned"}
                </td>
                <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                  {ticket.createdAt ? formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true }) : "Unknown"}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-xs bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20"
                  >
                    View & Dispatch
                  </button>
                </td>
              </tr>
            ))}
            {initialTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      {mounted && selectedTicket && createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111113] border border-[#27272a] rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
            
            <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
              <h2 className="text-xl font-bold text-white">Dispatch Issue</h2>
              <button onClick={() => setSelectedTicket(null)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
              <div className="flex gap-4">
                {selectedTicket.imageUrl && (
                  <img src={selectedTicket.imageUrl} alt="Issue" className="w-32 h-32 rounded-xl object-cover border border-white/10" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{selectedTicket.category}</h3>
                  <SeverityBadge severity={selectedTicket.severity} />
                  <div className="mt-3 text-sm text-zinc-400 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{selectedTicket.latitude.toFixed(4)}, {selectedTicket.longitude.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-sm text-zinc-300">{selectedTicket.description}</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300">Assign Department</label>
                <select 
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="" disabled>Select a department...</option>
                  <option value="Roads & Highways">Roads & Highways</option>
                  <option value="Water & Sanitation">Water & Sanitation</option>
                  <option value="Electricity Board">Electricity Board</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                  <option value="Traffic Authority">Traffic Authority</option>
                  <option value="Emergency Services">Emergency Services</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDispatch}
                disabled={isDispatching || !department || selectedTicket.status === "Dispatched" || selectedTicket.status === "Resolved"}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                {isDispatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                {selectedTicket.status === "Dispatched" ? "Already Dispatched" : "Dispatch Now"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
