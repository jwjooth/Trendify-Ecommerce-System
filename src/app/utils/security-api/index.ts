import { logger } from "../../lib";

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

export class SecureApiClient {
  private readonly defaultTimeout = 10000;
  private readonly defaultRetries = 3;
  private readonly retryDelay = 1000;
  private requestCount = 0;
  private readonly maxConcurrentRequests = 100;

  async request<T = unknown>(
    url: string,
    config: SecureApiRequestConfig = {},
  ): Promise<ApiRequestResult<T>> {
    if (!this.isValidUrl(url)) {
      const errorMsg = "Invalid URL provided";
      logger.error(errorMsg, { url });
      return { success: false, error: errorMsg };
    }

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

      if (method === "GET" && body) {
        logger.warn("Body data provided in GET request, will be ignored");
      }

      const requestHeaders = this.buildSecureHeaders(headers, csrfToken);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          credentials: "same-origin",
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          return await this.handleErrorResponse<T>(response, url, config, retries);
        }

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

  async get<T = unknown>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "GET", headers });
  }

  async post<T = unknown>(url: string, body: unknown, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "POST", body, headers });
  }

  async put<T = unknown>(url: string, body: unknown, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "PUT", body, headers });
  }

  async delete<T = unknown>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "DELETE", headers });
  }

  private buildSecureHeaders(
    customHeaders: Record<string, string>,
    csrfToken?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };

    if (csrfToken) {
      headers["X-CSRF-Token"] = csrfToken;
    }

    Object.entries(customHeaders).forEach(([key, value]) => {
      if (!["Content-Type", "X-CSRF-Token", "X-Requested-With"].includes(key)) {
        headers[key] = value;
      }
    });

    return headers;
  }

  private async handleErrorResponse<T>(
    response: Response,
    url: string,
    config: SecureApiRequestConfig,
    retriesLeft: number,
  ): Promise<ApiRequestResult<T>> {
    const status = response.status;
    const statusText = response.statusText;

    logger.warn("API error response", { url, status, statusText });

    const shouldRetry = status >= 500 || status === 408 || status === 429;

    if (shouldRetry && retriesLeft > 0) {
      logger.info("Retrying failed request", {
        url,
        status,
        retriesLeft,
      });

      const delay = this.retryDelay * (this.defaultRetries - retriesLeft + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));

      return this.request<T>(url, { ...config, retries: retriesLeft - 1 });
    }

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

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    if (contentType.includes("text")) {
      const text = await response.text();
      return text as unknown as T;
    }

    const text = await response.text();
    return text as unknown as T;
  }

  private isValidUrl(urlString: string): boolean {
    try {
      const url = new URL(urlString, window.location.origin);
      if (!["http:", "https:"].includes(url.protocol)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}

export const secureApiClient = new SecureApiClient();
