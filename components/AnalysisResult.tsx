"use client";

import { GeminiAnalysisResult } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Brain } from "lucide-react";

interface Props {
  analysis: GeminiAnalysisResult;
}

export function AnalysisResult({ analysis }: Props) {
  return (
    <Card className="rounded-xl border-[#27272a] bg-[#18181b]">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-[#10b981]" />
          <CardTitle className="text-base text-white">AI Analysis Result</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {analysis.isValidIssue ? (
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-sm text-white">
            {analysis.isValidIssue ? "Valid Infrastructure Issue" : "Not a Valid Issue"}
          </span>
        </div>

        {analysis.emergencyTriggered && (
          <div className="flex items-center gap-2 bg-red-950 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-medium">Emergency Alert Triggered</p>
              {analysis.emergencyReason && (
                <p className="text-xs mt-0.5 text-red-400">{analysis.emergencyReason}</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">Category</p>
            <p className="font-medium text-white">{analysis.category}</p>
          </div>
          <div>
            <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">Severity</p>
            <SeverityBadge severity={analysis.severity} />
          </div>
          <div className="col-span-2">
            <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">Description</p>
            <p className="text-zinc-300">{analysis.description}</p>
          </div>
          <div>
            <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">Confidence</p>
            <p className="font-mono text-[#10b981]">{(analysis.confidenceScore * 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
