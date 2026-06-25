import { z } from "zod";

export const GeminiResponseSchema = z.object({
  isValidIssue: z.boolean(),
  category: z.enum([
    "Pothole",
    "Water Leak",
    "Broken Streetlight",
    "Waste Management",
    "Invalid",
  ]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  department: z.enum([
    "Roads & Highways",
    "Water & Sanitation",
    "Electricity Board",
    "Parks & Recreation",
    "Traffic Authority",
    "Emergency Services",
    "General Maintenance"
  ]),
  description: z.string().min(10),
  confidenceScore: z.number().min(0).max(1),
});

export const SubmitIssueSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  citizenEmail: z.string().email().optional(),
});

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
