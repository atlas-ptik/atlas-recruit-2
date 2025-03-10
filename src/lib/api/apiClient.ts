// src/lib/api/apiClient.ts - Base API client for Atlas Recruit, handles common request logic and authentication
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Define the standard API response format
export interface ApiResponse<T> {
  sukses: boolean;
  pesan: string;
  data?: T;
  error?: Record<string, unknown>;
}

// Custom error type for API errors
export interface ApiErrorData {
  message: string;
  status: number;
  data?: Record<string, unknown>;
}

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost/3-atlas-recruit/api",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to attach the token if available
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      // Get token from storage on each request to ensure we have the latest
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
          this.token = storedToken;
        }
      }

      if (this.token && config.headers) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }

      return config;
    });
  }

  // Set token manually (e.g., after login)
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  // Clear token (e.g., after logout)
  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  // Generic GET request
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(
        url,
        config
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw this.createApiError(error);
    }
  }

  // Generic POST request
  async post<T>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw this.createApiError(error);
    }
  }

  // Generic PUT request
  async put<T>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw this.createApiError(error);
    }
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(
        url,
        config
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw this.createApiError(error);
    }
  }

  // Error handling
  private handleError(error: unknown): void {
    // Handle unauthorized errors (401)
    if (
      this.isAxiosError(error) &&
      error.response &&
      error.response.status === 401
    ) {
      // Clear invalid token
      this.clearToken();

      // If in browser context, redirect to login
      if (typeof window !== "undefined") {
        // Use window.location instead of router to ensure a full page refresh
        window.location.href = "/login";
      }
    }

    // Log other errors
    if (this.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }

  // Type guard for Axios errors
  private isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
  }

  // Create standardized API error
  private createApiError(error: unknown): ApiErrorData {
    if (this.isAxiosError(error)) {
      const responseData = error.response?.data as
        | Record<string, unknown>
        | undefined;
      return {
        message:
          (responseData?.pesan as string) ||
          error.message ||
          "Unknown API error",
        status: error.response?.status || 500,
        data: responseData || {},
      };
    }

    return {
      message: error instanceof Error ? error.message : "Unknown error",
      status: 500,
    };
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
