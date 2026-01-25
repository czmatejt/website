// 1. Get API URL from env variables (Fallback to localhost for dev)
// Create a .env file in project root: VITE_API_URL=http://192.168.0.9:8000
import { API_URL } from "../config/domains";

type RequestOptions = RequestInit & {
  // Add any custom options here if needed
};

// 2. Generic Fetch Wrapper
export async function apiClient<T>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<T> {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 3. Centralized Error Handling
  if (!response.ok) {
    // You can parse specific backend error messages here
    const errorBody = await response.text().catch(() => null);
    throw new Error(errorBody || `API Error: ${response.statusText}`);
  }

  // 4. Handle Empty Responses (e.g. 204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}