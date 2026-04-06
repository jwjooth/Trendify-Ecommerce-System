import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { Token } from "./token";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const extractMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unexpected error occurred";
};

export const handleError = (error: unknown) => {
  const message = extractMessage(error);
  console.error("[API ERROR]", error);
  toast.error(message);
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

function getApiInstance() {
  const api = axios.create({
    baseURL: "https://trendify-tcommerce-system.onrender.com/v1",
    timeout: 15000,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = Token.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if ((error.config as any)?.skipGlobalError) {
        return Promise.reject(error);
      }
      if (isAxiosError(error) && error.response?.status === 401) {
        Token.remove();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      handleError(error);
      return Promise.reject(error);
    },
  );
  return api;
}

export const api = getApiInstance();

export interface ResponseProps<T> {
  status_code?: number;
  message?: string;
  page_limit?: number;
  page?: number;
  total_rows?: number;
  total_pages?: number;
  data?: T;
}
