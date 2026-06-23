"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { GeminiAnalysisResult, Ticket } from "@/types";
import { validateImageFile, compressImage } from "@/lib/imageValidator";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type State = "idle" | "uploading" | "analyzing" | "done" | "error";

export function IssueUploader() {
  const [state, setState] = useState<State>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState<number>(28.6139);
  const [lon, setLon] = useState<number>(77.209);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    ticket: Ticket;
    analysis: GeminiAnalysisResult;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      const validationErrors = await validateImageFile(dropped);
      if (validationErrors.length > 0) {
        setErrorMsg(validationErrors.map((err) => err.message).join(", "));
        return;
      }
      setErrorMsg("");
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));
    }
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const validationErrors = await validateImageFile(f);
      if (validationErrors.length > 0) {
        setErrorMsg(validationErrors.map((err) => err.message).join(", "));
        return;
      }
      setErrorMsg("");
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      () => alert("Location access denied. Enter coordinates manually."),
    );
  };

  const handleSubmit = async () => {
    if (!file) return;
    setState("uploading");
    setErrorMsg("");

    try {
      const fd = new FormData();
      // Compress image before upload to avoid API Payload Too Large errors
      const compressedFile = await compressImage(file, 1024);
      fd.append("image", compressedFile);
      fd.append("latitude", lat.toString());
      fd.append("longitude", lon.toString());
      if (email) fd.append("citizenEmail", email);

      setState("analyzing");
      const res = await fetch("/api/analyze-issue", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 429) {
          const retryAfter = err.retryAfter
            ? Math.ceil(err.retryAfter / 60)
            : 60;
          throw new Error(
            `Rate limit exceeded. Please wait ${retryAfter} minute(s) before trying again.`,
          );
        }
        const errorMessage =
          typeof err.error === "string"
            ? err.error
            : err.error
              ? JSON.stringify(err.error)
              : "Analysis failed";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setResult(data);
      setState("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setPreview(null);
    setFile(null);
    setResult(null);
    setErrorMsg("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (state === "done" && result) {
    return (
      <div className="space-y-6">
        <Card className="rounded-xl border-[#27272a] bg-[#18181b]">
          <CardHeader>
            <div className="flex items-center gap-3">
              {result.analysis.isValidIssue ? (
                <CheckCircle2 className="text-[#10b981] w-6 h-6" />
              ) : (
                <AlertTriangle className="text-amber-400 w-6 h-6" />
              )}
              <CardTitle className="text-lg text-white">
                {result.analysis.isValidIssue
                  ? "Ticket Dispatched"
                  : "Not a Valid Issue"}
              </CardTitle>
              <span className="ml-auto text-xs text-[#71717a] font-mono">
                #{result.ticket.id.slice(0, 8)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.analysis.emergencyTriggered && (
              <div className="flex items-center gap-2 bg-red-950 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Emergency alert dispatched to city engineering team.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">
                  Category
                </p>
                <p className="font-medium text-white">
                  {result.ticket.category}
                </p>
              </div>
              <div>
                <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">
                  Severity
                </p>
                <SeverityBadge severity={result.ticket.severity} />
              </div>
              <div className="col-span-2">
                <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">
                  AI Assessment
                </p>
                <p className="text-zinc-300">{result.ticket.description}</p>
              </div>
              <div>
                <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">
                  Confidence
                </p>
                <p className="font-mono text-[#10b981]">
                  {(result.ticket.aiConfidence * 100).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-[#71717a] text-xs uppercase tracking-wide mb-1">
                  Status
                </p>
                <p className="text-zinc-300">{result.ticket.status}</p>
              </div>
            </div>

            {preview && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden">
                <Image
                  src={preview}
                  alt="Reported issue"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={reset}
          variant="outline"
          className="w-full rounded-xl border-[#27272a] text-zinc-300 hover:bg-[#27272a]"
        >
          Report another issue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#27272a] rounded-xl p-10 text-center cursor-pointer hover:border-[#10b981] hover:bg-emerald-950/10 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
        {preview ? (
          <div className="relative mx-auto rounded-xl overflow-hidden max-h-48 w-fit">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={300}
              className="rounded-xl object-contain"
            />
          </div>
        ) : (
          <>
            <Upload className="mx-auto w-10 h-10 text-[#71717a] mb-3" />
            <p className="text-[#71717a] text-sm">
              Drag a photo here or click to choose
            </p>
            <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WebP</p>
          </>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-[#71717a]">Location</label>
          <button
            onClick={getLocation}
            className="flex items-center gap-1.5 text-xs text-[#10b981] hover:text-emerald-300 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Use my location
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value))}
            placeholder="Latitude"
            className="bg-[#18181b] border-[#27272a] rounded-xl text-sm text-[#fafafa]"
          />
          <Input
            type="number"
            value={lon}
            onChange={(e) => setLon(parseFloat(e.target.value))}
            placeholder="Longitude"
            className="bg-[#18181b] border-[#27272a] rounded-xl text-sm text-[#fafafa]"
          />
        </div>
      </div>

      {/* Email (optional) */}
      <div>
        <label className="text-sm text-[#71717a] block mb-2">
          Email for updates <span className="text-zinc-600">(optional)</span>
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-[#18181b] border-[#27272a] rounded-xl text-sm text-[#fafafa]"
        />
      </div>

      {(state === "error" || errorMsg) && (
        <div className="bg-red-950 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={
          !file || state === "analyzing" || state === "uploading" || !!errorMsg
        }
        className="w-full py-3 rounded-xl bg-[#10b981] hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm"
      >
        {state === "uploading" || state === "analyzing" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {state === "uploading" ? "Uploading..." : "AI is analyzing..."}
          </>
        ) : (
          "Analyze & Dispatch Ticket"
        )}
      </Button>
    </div>
  );
}
