// 1. Get API URL from env variables (Fallback to localhost for dev)
// Create a .env file in project root: VITE_API_URL=http://192.168.0.9:8000
import { API_URL } from "../config/domains";

type RequestOptions = RequestInit & {
  // Query params to append to the URL
  params?: Record<string, string | number | boolean | undefined | null>;
};

export class ApiClient {
  baseUrl: string;
  defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_URL, defaultHeaders: Record<string, string> = { "Content-Type": "application/json" }) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  private buildUrl(endpoint: string) {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${path}`;
  }

  private buildQueryString(params?: Record<string, any>) {
    if (!params) return "";
    const qs = new URLSearchParams();
    for (const key of Object.keys(params)) {
      const val = params[key];
      if (val === undefined || val === null) continue;
      qs.append(key, String(val));
    }
    const s = qs.toString();
    return s ? `?${s}` : "";
  }

  private async request<T>(method: string, endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    const baseUrl = this.buildUrl(endpoint);
    const query = this.buildQueryString(options.params);
    const url = baseUrl + query;

    const headers = {
      ...this.defaultHeaders,
      ...(options.headers || {}),
    } as Record<string, string>;

    const { params, ...restOptions } = options;

    const init: RequestInit = {
      ...restOptions,
      method,
      headers,
    };

    if (body !== undefined && body !== null && method !== "GET" && method !== "HEAD") {
      init.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => null);
      throw new Error(errorBody || `API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    // Fallback to text for non-JSON responses
    const text = await response.text().catch(() => "");
    return (text as unknown) as T;
  }

  get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  post<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>("POST", endpoint, body, options);
  }

  put<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>("PUT", endpoint, body, options);
  }

  delete<T>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>("DELETE", endpoint, body, options);
  }
}

const defaultClient = new ApiClient();
export default defaultClient;
export { defaultClient as apiClient };