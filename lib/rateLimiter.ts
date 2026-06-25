/**
 * Simple in-memory rate limiter for API endpoints
 * Production: Use Vercel KV, Redis, or database for distributed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_STORE = new Map<string, RateLimitEntry>();
const COOLDOWN_STORE = new Map<string, number>();
const CLEANUP_INTERVAL = 60000; // Clean up every 60 seconds
const COOLDOWN_MINUTES = 20;

// Start cleanup interval
if (typeof global !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of RATE_LIMIT_STORE.entries()) {
      if (entry.resetTime < now) {
        RATE_LIMIT_STORE.delete(key);
      }
    }
    
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
    for (const [key, time] of COOLDOWN_STORE.entries()) {
      if (now - time > cooldownMs) {
        COOLDOWN_STORE.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
}

export interface RateLimitConfig {
  maxRequests: number; // Number of requests allowed
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier Unique identifier (IP, user ID, etc.)
 * @param config Rate limit configuration
 * @returns RateLimitResult with status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = RATE_LIMIT_STORE.get(identifier);

  // Check if we need to reset the window
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    RATE_LIMIT_STORE.set(identifier, newEntry);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  // Increment and allow
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cf = request.headers.get("cf-connecting-ip"); // Cloudflare

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cf) {
    return cf;
  }

  return "unknown";
}

export function checkCooldown(identifier: string): { allowed: boolean; remainingSeconds: number } {
  const lastSubmitTime = COOLDOWN_STORE.get(identifier);
  if (!lastSubmitTime) return { allowed: true, remainingSeconds: 0 };

  const now = Date.now();
  const diffMs = now - lastSubmitTime;
  const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

  if (diffMs >= cooldownMs) {
    return { allowed: true, remainingSeconds: 0 };
  }

  return { allowed: false, remainingSeconds: Math.ceil((cooldownMs - diffMs) / 1000) };
}

export function setCooldown(identifier: string) {
  COOLDOWN_STORE.set(identifier, Date.now());
}
