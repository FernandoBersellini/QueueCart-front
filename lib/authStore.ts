interface AuthTokens {
  token: string;
  refreshToken: string;
}

type Listener = (tokens: AuthTokens | null) => void;

let tokens: AuthTokens | null = null;
let refreshPromise: Promise<AuthTokens> | null = null;
const listeners = new Set<Listener>();

export function setAuthTokens(next: AuthTokens | null) {
  tokens = next;
  listeners.forEach((listener) => listener(tokens));
}

export function getAuthTokens() {
  return tokens;
}

export function subscribeAuthTokens(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function refreshAuthTokens(
  refresher: (refreshToken: string) => Promise<AuthTokens>
): Promise<AuthTokens> {
  if (!tokens) {
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = refresher(tokens.refreshToken)
      .then((next) => {
        setAuthTokens(next);
        return next;
      })
      .catch((error) => {
        setAuthTokens(null);
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}
