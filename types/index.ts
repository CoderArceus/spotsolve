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
  | "Dispatched"
  | "Resolved"
  | "Rejected";

export interface StatusEvent {
  status: TicketStatus;
  timestamp: string; // ISO string
  note?: string; // optional human-readable reason
}

export interface Report {
  id: string;
  userId?: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt: string; // ISO string
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
  imageHash?: string;
  priority: number;
}

export interface GeminiAnalysisResult {
  isValidIssue: boolean;
  category: Category;
  severity: Severity;
  department: string;
  description: string;
  confidenceScore: number;
  emergencyTriggered: boolean;
  emergencyReason?: string;
}
