/**
 * Error Tracking and Logging Utility
 * Provides centralized error tracking, logging, and reporting
 * Following industry best practices for error management
 */

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL";
  message: string;
  context?: Record<string, unknown>;
  stack?: string;
  url?: string;
  userAgent?: string;
}

export interface ErrorReport {
  errorId: string;
  totalErrors: number;
  lastOccurrence: Date;
  context: Record<string, unknown>;
}

class ErrorLogger {
  private errors: Map<string, ErrorLog[]> = new Map();
  private readonly maxErrors = 1000;
  private readonly maxErrorsPerType = 100;
  private readonly isDevelopment = import.meta.env.DEV;

  /**
   * Log an error with context
   */
  log(
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL",
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): string {
    const errorId = this.generateErrorId();
    const timestamp = new Date();

    const errorLog: ErrorLog = {
      id: errorId,
      timestamp,
      level,
      message,
      context: {
        ...context,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
      stack: error?.stack,
    };

    // Store error
    this.storeError(errorLog);

    // Log to console in development
    if (this.isDevelopment) {
      const consoleMethod = this.getConsoleMethod(level);
      consoleMethod(`[${errorId}] ${message}`, errorLog);
    }

    // Log critical errors to external service (in production)
    if (level === "CRITICAL" && !this.isDevelopment) {
      this.reportToExternalService(errorLog);
    }

    return errorId;
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log("DEBUG", message, context);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log("INFO", message, context);
  }

  /**
   * Warning level logging
   */
  warn(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("WARN", message, context, error);
  }

  /**
   * Error level logging
   */
  error(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): string {
    return this.log("ERROR", message, context, error);
  }

  /**
   * Critical error logging
   */
  critical(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): string {
    return this.log("CRITICAL", message, context, error);
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLog[] {
    const allErrors: ErrorLog[] = [];
    this.errors.forEach((errorLogs) => {
      allErrors.push(...errorLogs);
    });
    return allErrors.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  /**
   * Get errors by type/message
   */
  getErrorsByType(message: string): ErrorLog[] {
    return this.errors.get(message) || [];
  }

  /**
   * Get error report by type
   */
  getErrorReport(message: string): ErrorReport | null {
    const logs = this.getErrorsByType(message);
    if (logs.length === 0) return null;

    return {
      errorId: logs[0].id,
      totalErrors: logs.length,
      lastOccurrence: logs[0].timestamp,
      context: logs[0].context || {},
    };
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors.clear();
  }

  /**
   * Export errors as JSON
   */
  exportErrors(): string {
    const errors = this.getErrors();
    return JSON.stringify(errors, null, 2);
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ERR_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Store error with deduplication
   */
  private storeError(errorLog: ErrorLog): void {
    const key = errorLog.message;
    const existing = this.errors.get(key) || [];

    // Prevent storing too many of the same error
    if (existing.length >= this.maxErrorsPerType) {
      existing.shift();
    }

    existing.unshift(errorLog);
    this.errors.set(key, existing);

    // Prevent memory leaks
    if (this.errors.size > this.maxErrors) {
      const firstKey = this.errors.keys().next().value;
      if (firstKey) {
        this.errors.delete(firstKey);
      }
    }
  }

  /**
   * Get appropriate console method
   */
  private getConsoleMethod(
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL",
  ): (...args: unknown[]) => void {
    switch (level) {
      case "DEBUG":
        return console.debug;
      case "INFO":
        return console.info;
      case "WARN":
        return console.warn;
      case "ERROR":
      case "CRITICAL":
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Report error to external service (e.g., Sentry, LogRocket)
   */
  private reportToExternalService(errorLog: ErrorLog): void {
    // This would be implemented in production
    // Example with Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorLog.message), {
    //     level: errorLog.level.toLowerCase(),
    //     contexts: { app: errorLog.context },
    //   });
    // }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Global error handler
 * Catches unhandled errors and promise rejections
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled errors
  window.addEventListener("error", (event) => {
    errorLogger.error(
      "Uncaught error",
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      event.error,
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.error(
      "Unhandled promise rejection",
      { reason: event.reason },
      event.reason instanceof Error ? event.reason : undefined,
    );
  });

  // Handle console errors in production
  if (!import.meta.env.DEV) {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogger.error("Console error", { args });
      originalError.apply(console, args);
    };
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  /**
   * Start timing a operation
   */
  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * End timing and log duration
   */
  end(name: string): number {
    const start = this.marks.get(name);
    if (!start) {
      errorLogger.warn(`No start mark found for ${name}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(name);

    // Log if operation took too long
    if (duration > 1000) {
      errorLogger.warn(`Slow operation detected: ${name} took ${duration}ms`);
    }

    return duration;
  }

  /**
   * Measure and log operation
   */
  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Async version of measure
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      return await fn();
    } finally {
      this.end(name);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
