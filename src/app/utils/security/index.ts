import { logger } from "@/app/lib";

export class CSRFTokenManager {
  private static readonly TOKEN_KEY = "x-csrf-token";
  private static readonly HEADER_NAME = "X-CSRF-Token";
  private static token: string | null = null;

  static generateToken(): string {
    if (this.token) {
      return this.token;
    }

    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    this.token = token;
    sessionStorage.setItem(this.TOKEN_KEY, token);

    return token;
  }

  static getToken(): string | null {
    if (this.token) {
      return this.token;
    }

    // Try to retrieve from session
    this.token = sessionStorage.getItem(this.TOKEN_KEY);
    if (!this.token) {
      this.token = this.generateToken();
    }

    return this.token;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    if (!storedToken) {
      return false;
    }
    return this.constantTimeCompare(token, storedToken);
  }

  private static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let mismatch = 0;
    for (let i = 0; i < a.length; i++) {
      mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return mismatch === 0;
  }

  static getHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      logger.warn("CSRF token not available");
      return {};
    }

    return {
      [this.HEADER_NAME]: token,
    };
  }
}

export class SecureSessionStorage {
  private static readonly PREFIX = "app_secure_";

  static setItem(key: string, value: unknown): void {
    const prefixedKey = this.PREFIX + key;
    try {
      const jsonValue = JSON.stringify(value);
      sessionStorage.setItem(prefixedKey, btoa(jsonValue));
      logger.debug("Secure session data stored", { key });
    } catch (error) {
      logger.error("Failed to store secure session data", { key, error });
    }
  }

  static getItem<T = unknown>(key: string): T | null {
    const prefixedKey = this.PREFIX + key;
    try {
      const encoded = sessionStorage.getItem(prefixedKey);
      if (!encoded) {
        return null;
      }
      const jsonValue = atob(encoded);
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      logger.error("Failed to retrieve secure session data", { key, error });
      return null;
    }
  }

  static removeItem(key: string): void {
    const prefixedKey = this.PREFIX + key;
    sessionStorage.removeItem(prefixedKey);
    logger.debug("Secure session data removed", { key });
  }

  static clear(): void {
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(this.PREFIX)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => sessionStorage.removeItem(key));
    logger.debug("Secure session storage cleared");
  }
}

export const XSSProtection = {
  escapeHtml(text: string): string {
    const element = document.createElement("div");
    element.textContent = text;
    return element.innerHTML;
  },
  sanitizeInput(input: string): string {
    if (typeof input !== "string") {
      return "";
    }
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=/gi, "_disabled_")
      .replace(/<iframe/gi, "&lt;iframe")
      .replace(/<object/gi, "&lt;object");

    return this.escapeHtml(sanitized);
  },
  containsXSSPatterns(input: string): boolean {
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /eval\(/i,
      /expression\(/i,
    ];

    return xssPatterns.some((pattern) => pattern.test(input));
  },
};

export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    let attempts = this.attempts.get(identifier) || [];

    attempts = attempts.filter((timestamp) => now - timestamp < this.windowMs);

    if (attempts.length >= this.maxAttempts) {
      logger.warn("Rate limit exceeded", {
        identifier,
        attempts: attempts.length,
      });
      return false;
    }

    attempts.push(now);
    this.attempts.set(identifier, attempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  resetAll(): void {
    this.attempts.clear();
  }
}

export const SecurityHeaders = {
  generateCSPHeader(): string {
    return `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://6872883376a5723aacd50d06.mockapi.io https://69bd41b72bc2a25b22ae1242.mockapi.io;
      frame-src 'none';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, " ");
  },

  getHeaders(): Record<string, string> {
    return {
      "Content-Security-Policy": this.generateCSPHeader(),
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    };
  },
};

export class DataExpirationManager {
  static setWithExpiration(
    key: string,
    value: unknown,
    expirationMs: number = 3600000,
  ): void {
    const data = {
      value,
      expiresAt: Date.now() + expirationMs,
    };

    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      logger.debug("Data stored with expiration", { key, expirationMs });
    } catch (error) {
      logger.error("Failed to store expiring data", { key, error });
    }
  }

  static getWithExpiration<T = unknown>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (!item) {
        return null;
      }

      const data = JSON.parse(item);

      if (data.expiresAt && Date.now() > data.expiresAt) {
        sessionStorage.removeItem(key);
        logger.debug("Expired data removed", { key });
        return null;
      }

      return data.value as T;
    } catch (error) {
      logger.error("Failed to retrieve expiring data", { key, error });
      return null;
    }
  }

  static removeExpiredData(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;

      try {
        const item = sessionStorage.getItem(key);
        if (!item) continue;

        const data = JSON.parse(item);
        if (data.expiresAt && Date.now() > data.expiresAt) {
          keysToRemove.push(key);
        }
      } catch {
        // Ignore parsing errors
      }
    }

    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    logger.debug("Expired data cleanup completed", {
      removed: keysToRemove.length,
    });
  }
}

/**
 * Environment Variables Validation
 * Ensures all required environment variables are present and valid
 */
export const validateEnvironmentVariables = (): void => {
  const requiredVars = [
    "VITE_API_URL",
    "VITE_PRODUCTS_URL",
    "VITE_CATEGORIES_URL",
    "VITE_FAQS_URL",
    "VITE_TESTIMONIALS_URL",
  ];

  const missing: string[] = [];

  requiredVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    logger.warn("Missing environment variables", { missing });
  }

  logger.info("Environment variables validated", {
    present: requiredVars.length - missing.length,
    missing: missing.length,
  });
};
