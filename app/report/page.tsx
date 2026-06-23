import { IssueUploader } from "@/components/IssueUploader";

export default function ReportPage() {
  return (
    <div className="max-w-xl mx-auto pb-32">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Report an Issue</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Upload a photo of a community problem. Our AI will classify, assess severity, and dispatch a ticket automatically.
        </p>
      </div>
      <IssueUploader />
    </div>
  );
}
