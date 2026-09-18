import axios, {
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// 1. Create Axios Instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Outbound Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[API Outbound]: ${
        config.method?.toUpperCase() ?? "GET"
      } request sent to ${config.url}`,
    );

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Inbound Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `[API Inbound]: Success response received from ${response.config.url}`,
    );

    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    }

    return Promise.reject(error);
  },
);

type RequestOptions = AxiosRequestConfig;

// 4. Reusable Request Orchestrator
const request = async <T>(url: string, options: RequestOptions = {}) => {
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      ...options,
    });

    return {
      data: response.data,
      status: response.status,
      config: {
        ...options,
        url,
      },
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `API request failed with status ${error.response.status}`,
        {
          cause: error,
        },
      );
    }

    throw new Error(error instanceof Error ? error.message : "Unknown error", {
      cause: error,
    });
  }
};

// 5. Public API Client
export const apiClient = {
  get: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: "GET",
    }),

  post: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: "POST",
      data,
    }),

  put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: "PUT",
      data,
    }),

  delete: <T = unknown>(url: string, options?: RequestOptions) =>
    request<T>(url, {
      ...options,
      method: "DELETE",
    }),
};
