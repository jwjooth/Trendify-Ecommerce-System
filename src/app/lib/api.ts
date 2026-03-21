import { API_CONFIG, logger } from ".";

export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  retryAfter?: number;

  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  retry?: number;
  signal?: AbortSignal;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(
    baseUrl: string = API_CONFIG.BASE_URL,
    timeout: number = API_CONFIG.TIMEOUT,
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      retry = API_CONFIG.RETRY_ATTEMPTS,
      signal,
    } = options;

    const url = new URL(endpoint, this.baseUrl).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    if (signal) {
      if (signal.aborted) controller.abort();
      else
        signal.addEventListener("abort", () => controller.abort(), {
          once: true,
        });
    }

    const hasBody = body !== undefined && body !== null;
    const requestInit: RequestInit = {
      method,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      signal: controller.signal,
    };

    if (hasBody) {
      requestInit.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestInit);

      if (!response.ok) {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfter = retryAfterHeader
          ? Number(retryAfterHeader)
          : undefined;

        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          Number.isFinite(retryAfter) ? retryAfter : undefined,
        );
      }

      if (response.status === 204) {
        return {
          data: undefined as T,
          status: response.status,
        };
      }

      const contentType = response.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : ((await response.text()) as unknown as T);

      logger.debug("API request successful", {
        endpoint,
        status: response.status,
      });

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      logger.error("API request failed", { endpoint, error, retry });

      if (retry > 0 && this.isRetryable(error, method)) {
        const delay = this.getRetryDelay(error, retry);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(endpoint, { ...options, retry: retry - 1 });
      }

      const message = error instanceof Error ? error.message : "Unknown error";

      return {
        data: undefined as T,
        status: error instanceof ApiError ? error.status : 0,
        error: message,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  private isRetryable(error: unknown, method: string): boolean {
    if (!["GET", "HEAD", "OPTIONS", "DELETE"].includes(method)) return false;

    if (error instanceof ApiError) {
      return [429, 500, 502, 503, 504].includes(error.status);
    }

    if (error instanceof Error) {
      return (
        error.name === "AbortError" ||
        error.message.includes("Failed to fetch") ||
        error.message.toLowerCase().includes("timeout")
      );
    }

    return false;
  }

  private getRetryDelay(error: unknown, retry: number): number {
    if (error instanceof ApiError && error.retryAfter) {
      return error.retryAfter * 1000;
    }

    const base = API_CONFIG.RETRY_DELAY;
    const exponential = base * 2 ** (API_CONFIG.RETRY_ATTEMPTS - retry);
    const jitter = Math.floor(Math.random() * 250);

    return exponential + jitter;
  }
}

export const apiService = new ApiService();
