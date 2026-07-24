import { ApiError, ApiErrorBody } from "./apiError";

const BASE_URL = "http://localhost:8080";

export async function api<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T | undefined> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let body:ApiErrorBody

    try {
      body = await res.json();
    } catch {
      throw new ApiError(res.statusText || "Erro desconhecido", res.status, "UNKNOWN", new Date().toISOString());
    }

    throw new ApiError(body.message, res.status, body.errorCode, body.timestamp);
  }

  if (res.status === 204) {
    return undefined;
  }

  return res.json();
}