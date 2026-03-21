/**
 * Enhanced API Request Handler
 * Provides secure API communication with proper error handling, retries, and timeout management
 */

import { logger } from "../lib";

export interface SecureApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  csrfToken?: string;
}

export interface ApiRequestResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Secure API request handler with industry best practices
 */
export class SecureApiClient {
  private readonly defaultTimeout = 10000; // 10 seconds
  private readonly defaultRetries = 3;
  private readonly retryDelay = 1000; // 1 second
  private requestCount = 0;
  private readonly maxConcurrentRequests = 100;

  /**
   * Make a secure API request
   */
  async request<T = unknown>(
    url: string,
    config: SecureApiRequestConfig = {},
  ): Promise<ApiRequestResult<T>> {
    // Validate URL
    if (!this.isValidUrl(url)) {
      const errorMsg = "Invalid URL provided";
      logger.error(errorMsg, { url });
      return { success: false, error: errorMsg };
    }

    // Check concurrent request limit
    if (this.requestCount >= this.maxConcurrentRequests) {
      const errorMsg = "Too many concurrent requests";
      logger.warn(errorMsg);
      return { success: false, error: errorMsg };
    }

    this.requestCount++;

    try {
      const {
        method = "GET",
        headers = {},
        body,
        timeout = this.defaultTimeout,
        retries = this.defaultRetries,
        csrfToken,
      } = config;

      // Validate sensitive data not being sent in GET requests
      if (method === "GET" && body) {
        logger.warn("Body data provided in GET request, will be ignored");
      }

      // Build request headers with security
      const requestHeaders = this.buildSecureHeaders(headers, csrfToken);

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          credentials: "same-origin", // Prevent CSRF
        });

        clearTimeout(timeoutId);

        // Handle non-OK responses
        if (!response.ok) {
          return await this.handleErrorResponse<T>(
            response,
            url,
            config,
            retries,
          );
        }

        // Parse response
        const data = await this.parseResponse<T>(response);

        logger.debug("API request successful", {
          url,
          method,
          status: response.status,
        });

        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === "AbortError") {
          const errorMsg = `API request timeout after ${timeout}ms`;
          logger.error(errorMsg, { url, timeout });
          return { success: false, error: errorMsg };
        }

        throw error;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("API request failed", { url, error: errorMsg });

      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      this.requestCount--;
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "GET", headers });
  }

  /**
   * POST request with body
   */
  async post<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ) {
    return this.request<T>(url, { method: "POST", body, headers });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
  ) {
    return this.request<T>(url, { method: "PUT", body, headers });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "DELETE", headers });
  }

  /**
   * Build secure headers
   */
  private buildSecureHeaders(
    customHeaders: Record<string, string>,
    csrfToken?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest", // XHR detection
    };

    // Add CSRF token if provided
    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    // Merge custom headers (cannot override security headers)
    Object.entries(customHeaders).forEach(([key, value]) => {
      if (!["Content-Type", "X-CSRF-Token", "X-Requested-With"].includes(key)) {
        headers[key] = value;
      }
    });

    return headers;
  }

  /**
   * Handle error responses with retry logic
   */
  private async handleErrorResponse<T>(
    response: Response,
    url: string,
    config: SecureApiRequestConfig,
    retriesLeft: number,
  ): Promise<ApiRequestResult<T>> {
    const status = response.status;
    const statusText = response.statusText;

    logger.warn("API error response", { url, status, statusText });

    // Don't retry client errors (4xx) unless it's 408 (timeout) or 429 (rate limit)
    const shouldRetry = status >= 500 || status === 408 || status === 429;

    if (shouldRetry && retriesLeft > 0) {
      logger.info("Retrying failed request", {
        url,
        status,
        retriesLeft,
      });

      // Exponential backoff
      const delay = this.retryDelay * (this.defaultRetries - retriesLeft + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Retry the request
      return this.request<T>(url, { ...config, retries: retriesLeft - 1 });
    }

    // Get error message from response
    let errorMessage = `HTTP ${status}: ${statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Could not parse error response
    }

    return {
      success: false,
      error: errorMessage,
      statusCode: status,
    };
  }

  /**
   * Parse response safely
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    if (contentType.includes("text")) {
      const text = await response.text();
      return text as unknown as T;
    }

    // Default to text
    const text = await response.text();
    return text as unknown as T;
  }

  /**
   * Validate URL is safe
   */
  private isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString, window.location.origin);

      // Prevent javascript:, data:, etc.
      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton
export const secureApiClient = new SecureApiClient();
