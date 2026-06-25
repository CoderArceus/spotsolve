"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { GeminiAnalysisResult, Ticket } from "@/types";
import { validateImageFile, compressImage } from "@/lib/imageValidator";
import { reverseGeocode } from "@/lib/reverseGeocode";
import { SeverityBadge } from "./SeverityBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useLocation } from "@/hooks/useLocation";

type State = "idle" | "uploading" | "analyzing" | "done" | "error";

export function IssueUploader() {
  const [state, setState] = useState<State>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { coords, error: locationError, loading: locationLoading } = useLocation();
  const lat = coords?.lat ?? null;
  const lon = coords?.lng ?? null;
  const [address, setAddress] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [result, setResult] = useState<{
    ticket: Ticket;
    analysis: GeminiAnalysisResult;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      reverseGeocode(lat, lon).then(setAddress);
    }
  }, [lat, lon]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = async () => {
    try {
      setCameraError("");
      setIsCameraOpen(true);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setCameraError("Camera access denied or unavailable.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const f = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setFile(f);
            setPreview(URL.createObjectURL(f));
            stopCamera();
            setErrorMsg("");
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
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

  const handleSubmit = async () => {
    if (!file || lat === null || lon === null) {
      setErrorMsg("Image and location are required.");
      return;
    }
    
    if (userDescription.trim().length < 20) {
      setErrorMsg("Please describe the issue in at least 20 characters — include nearby landmarks or street names.");
      return;
    }

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
      if (userDescription) fd.append("userDescription", userDescription);
      if (user) fd.append("citizenUid", user.uid);

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
    setAddress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    stopCamera();
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
      {/* Upload Zone */}
      {isCameraOpen ? (
        <div className="border-2 border-[#27272a] rounded-xl overflow-hidden bg-black relative flex flex-col min-h-[300px]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-[60vh] object-contain bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/60 via-transparent to-black/80">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-lg backdrop-blur-sm">Camera Mode</span>
              <button onClick={stopCamera} className="text-white/80 hover:text-white p-2">
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center pb-2">
              {cameraError && (
                <p className="text-red-400 text-sm mb-4 bg-red-950/80 px-3 py-1.5 rounded-xl">{cameraError}</p>
              )}
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-zinc-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black/10" />
              </button>
              <p className="text-white/70 text-xs mt-3">Tap to capture</p>
            </div>
          </div>
        </div>
      ) : preview ? (
        <div 
          onClick={startCamera}
          className="border-2 border-dashed border-[#27272a] rounded-xl p-4 text-center cursor-pointer hover:border-[#10b981] hover:bg-emerald-950/10 transition-all group"
        >
          <div className="relative mx-auto rounded-xl overflow-hidden max-h-48 w-fit inline-block">
            <Image
              src={preview}
              alt="Preview"
              width={400}
              height={300}
              className="rounded-xl object-contain group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-md">Retake Photo</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {/* Camera Button */}

          <div
            onClick={startCamera}
            className="border-2 border-dashed border-[#27272a] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#10b981] hover:bg-emerald-950/10 transition-all min-h-[140px]"
          >
            <Camera className="w-8 h-8 text-[#71717a] mb-3" />
            <p className="text-zinc-300 text-sm font-medium">Take Photo</p>
            <p className="text-zinc-500 text-xs mt-1">Use camera</p>
          </div>
        </div>
      )}

      {/* Location */}
      {locationLoading ? (
        <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
          <Loader2 className="w-4 h-4 animate-spin" />
          Acquiring location...
        </div>
      ) : locationError ? (
        <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-950/20 p-3 rounded-xl border border-amber-900/30">
          <AlertTriangle className="w-4 h-4" />
          {locationError}
        </div>
      ) : lat !== null && lon !== null && (
        <div className="flex flex-col gap-2 p-3 rounded-xl border border-emerald-900/30 bg-emerald-950/20">
          <div className="flex items-center gap-2 text-sm text-[#10b981]">
            <MapPin className="w-4 h-4" />
            Location acquired automatically
          </div>
          <div className="text-sm text-zinc-300 bg-black/30 p-2 rounded-lg border border-emerald-900/50">
             <span className="mr-2">📍</span> 
             {address ?? `${lat.toFixed(5)}, ${lon.toFixed(5)}`}
          </div>
          {!address && (
            <p className="text-xs text-zinc-500">Could not resolve address — coordinates will still be saved.</p>
          )}
        </div>
      )}

      {/* Description (mandatory) */}
      <div>
        <label className="text-sm text-[#71717a] block mb-2">
          Additional Details <span className="text-red-500">*</span>
        </label>
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          placeholder="Describe the issue and its location. Example: Large pothole on the left side of MG Road, just before the traffic light near State Bank."
          minLength={20}
          maxLength={500}
          required
          rows={3}
          className="w-full bg-[#18181b] border border-[#27272a] rounded-xl text-sm text-[#fafafa] p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 resize-none"
        />
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
        onClick={() => handleSubmit()}
        disabled={
          !file || lat === null || lon === null || state === "analyzing" || state === "uploading" || !!errorMsg
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
