import { ApiError, ApiErrorBody } from "./apiError";
import { getAuthTokens, refreshAuthTokens } from "@/lib/authStore";
import { AuthResponseDTO } from "@/types/auth";

const BASE_URL = "http://localhost:8080";

async function refresher(refreshToken: string) {
  const res = await fetch(`${BASE_URL}/user/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new ApiError("Session expired", res.status, "UNAUTHORIZED", new Date().toISOString());
  }

  const auth: AuthResponseDTO = await res.json();
  return { token: auth.token, refreshToken: auth.refreshToken };
}

async function doFetch(endpoint: string, options: RequestInit | undefined, token?: string) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
}

async function parseError(res: Response): Promise<ApiError> {
  let body: ApiErrorBody;

  try {
    body = await res.json();
  } catch {
    return new ApiError(res.statusText || "Erro desconhecido", res.status, "UNKNOWN", new Date().toISOString());
  }

  return new ApiError(body.message, res.status, body.errorCode, body.timestamp);
}

export async function api<T>(endpoint: string, options?: RequestInit, token?: string): Promise<T | undefined> {
  let res = await doFetch(endpoint, options, token);

  if (res.status === 401 && token) {
    const error = await parseError(res.clone());

    if (error.message === "Token expired" && getAuthTokens()) {
      const refreshed = await refreshAuthTokens(refresher).catch(() => null);

      if (refreshed) {
        res = await doFetch(endpoint, options, refreshed.token);
      }
    }
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined;
  }

  return res.json();
}