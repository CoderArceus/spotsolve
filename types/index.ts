export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Category =
  | "Pothole"
  | "Water Leak"
  | "Broken Streetlight"
  | "Waste Management"
  | "Invalid";
export type TicketStatus =
  | "Pending Verification"
  | "Verified"
  | "Dispatched"
  | "Resolved";

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
  citizenEmail?: string;
  aiConfidence: number;
  upvotes: number;
  isValidIssue: boolean;
  emergencyAlertTriggered?: boolean;
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
