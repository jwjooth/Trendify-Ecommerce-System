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
  private readonly isDevelopment = process.env.NODE_ENV === "development";

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

    this.storeError(errorLog);

    if (this.isDevelopment) {
      const consoleMethod = this.getConsoleMethod(level);
      consoleMethod(`[${errorId}] ${message}`, errorLog);
    }

    if (level === "CRITICAL" && !this.isDevelopment) {
      this.reportToExternalService(errorLog);
    }

    return errorId;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log("DEBUG", message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log("INFO", message, context);
  }

  warn(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): void {
    this.log("WARN", message, context, error);
  }

  error(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): string {
    return this.log("ERROR", message, context, error);
  }

  critical(
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): string {
    return this.log("CRITICAL", message, context, error);
  }

  getErrors(): ErrorLog[] {
    const allErrors: ErrorLog[] = [];
    this.errors.forEach((errorLogs) => {
      allErrors.push(...errorLogs);
    });
    return allErrors.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  getErrorsByType(message: string): ErrorLog[] {
    return this.errors.get(message) || [];
  }

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

  clearErrors(): void {
    this.errors.clear();
  }

  exportErrors(): string {
    const errors = this.getErrors();
    return JSON.stringify(errors, null, 2);
  }

  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ERR_${timestamp}_${random}`.toUpperCase();
  }

  private storeError(errorLog: ErrorLog): void {
    const key = errorLog.message;
    const existing = this.errors.get(key) || [];

    if (existing.length >= this.maxErrorsPerType) {
      existing.shift();
    }

    existing.unshift(errorLog);
    this.errors.set(key, existing);

    if (this.errors.size > this.maxErrors) {
      const firstKey = this.errors.keys().next().value;
      if (firstKey) {
        this.errors.delete(firstKey);
      }
    }
  }

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
  private reportToExternalService(errorLog: ErrorLog): void {
    
  }
}

export const errorLogger = new ErrorLogger();

export function setupGlobalErrorHandlers(): void {
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

  window.addEventListener("unhandledrejection", (event) => {
    errorLogger.error(
      "Unhandled promise rejection",
      { reason: event.reason },
      event.reason instanceof Error ? event.reason : undefined,
    );
  });

  if (process.env.NODE_ENV !== "development") {
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      errorLogger.error("Console error", { args });
      originalError.apply(console, args);
    };
  }
}

export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(name: string): void {
    this.marks.set(name, performance.now());
  }

  end(name: string): number {
    const start = this.marks.get(name);
    if (!start) {
      errorLogger.warn(`No start mark found for ${name}`);
      return 0;
    }

    const duration = performance.now() - start;
    this.marks.delete(name);

    if (duration > 1000) {
      errorLogger.warn(`Slow operation detected: ${name} took ${duration}ms`);
    }

    return duration;
  }

  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      return fn();
    } finally {
      this.end(name);
    }
  }

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
