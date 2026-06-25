export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Category =
  | "Pothole"
  | "Water Leak"
  | "Broken Streetlight"
  | "Waste Management"
  | "Invalid";
export type TicketStatus =
  | "Reported"
  | "AI Verified"
  | "Community Flagged"
  | "Dispatched"
  | "Resolved"
  | "Rejected";

export interface StatusEvent {
  status: TicketStatus;
  timestamp: string; // ISO string
  note?: string; // optional human-readable reason
}

export interface Ticket {
  id: string;
  createdAt: string; // ISO string
  imageUrl: string;
  latitude: number;
  longitude: number;
  category: Category;
  severity: Severity;
  description: string;
  status: TicketStatus;
  statusHistory: StatusEvent[];
  resolvedAt?: string;
  citizenEmail?: string;
  citizenUid?: string;
  aiConfidence: number;
  upvotes: number;
  isValidIssue: boolean;
  emergencyAlertTriggered?: boolean;
  assignedDepartment?: string;
  assignedWorkerId?: string;
}

export interface GeminiAnalysisResult {
  isValidIssue: boolean;
  category: Category;
  severity: Severity;
  description: string;
  confidenceScore: number;
  emergencyTriggered: boolean;
  emergencyReason?: string;
}
