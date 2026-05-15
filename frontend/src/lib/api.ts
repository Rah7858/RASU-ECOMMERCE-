export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiRequestOptions extends RequestInit {
  token?: string;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const requestHeaders: HeadersInit = {
    ...(rest.body ? { "Content-Type": "application/json" } : {}),
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(payload?.message || "Request failed", response.status);
  }

  return payload as T;
}
