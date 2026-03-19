import { API_CONFIG, logger } from "../config";

export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  retry?: number;
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

  /**
   * Make an API request with retry logic and error handling
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      retry = API_CONFIG.RETRY_ATTEMPTS,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestInit: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestInit);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
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

      if (retry > 0 && this.isRetryable(error)) {
        // Exponential backoff
        const delay =
          API_CONFIG.RETRY_DELAY * (API_CONFIG.RETRY_ATTEMPTS - retry + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(endpoint, { ...options, retry: retry - 1 });
      }

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        data: undefined as unknown as T,
        status: 0,
        error: errorMessage,
      };
    }
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  /**
   * DELETE request
   */
  delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(error: unknown): boolean {
    if (error instanceof Error) {
      // Retry on network errors, timeouts, and 5xx server errors
      return (
        error.message.includes("Failed to fetch") ||
        error.message.includes("timeout") ||
        error.message.includes("HTTP 5")
      );
    }
    return false;
  }
}

export const apiService = new ApiService();
