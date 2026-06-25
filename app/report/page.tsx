import { IssueUploader } from "@/components/IssueUploader";
import { CheckCircle2, ShieldAlert, Camera, XCircle } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="max-w-5xl mx-auto pb-32 pt-10 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Report an Issue</h1>
        <p className="text-[#a1a1aa] text-sm mt-2 max-w-xl">
          Upload a clear photo of a community problem. Our AI will validate it, assess severity, and automatically dispatch a ticket to the correct municipal team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <IssueUploader />
        </div>

        {/* User Guide Side Panel */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 rounded-3xl sticky top-6">
            <h3 className="text-base font-bold text-white mb-4">Reporting Guide</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-[13px] font-bold text-emerald-400 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid Issues
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                    Potholes, leaks, fallen trees
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                    Broken streetlights or signals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                    Severe illegal dumping
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-red-400 flex items-center gap-2 mb-2">
                  <XCircle className="w-3.5 h-3.5" /> Invalid Issues
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                    Blurry or unclear photos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                    Private property issues
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                    People, faces, or license plates
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <h4 className="text-[13px] font-bold text-emerald-300 flex items-center gap-2 mb-1">
                  <Camera className="w-3.5 h-3.5" /> Photo Tips
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Ensure the issue is well-lit and centered. Include enough background so the AI can understand the context and scale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
