"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthResponseDTO, SignInDTO, SignUpDTO } from "@/types/auth";
import { useSignIn } from "@/hooks/auth/useSignIn";
import { useSignUp } from "@/hooks/auth/useSignUp";
import { useLogout } from "@/hooks/auth/useLogout";
import { setAuthTokens, subscribeAuthTokens } from "@/lib/authStore";

const STORAGE_KEY = "auth";

interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: AuthResponseDTO["role"];
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  signIn: (credentials: SignInDTO) => Promise<void>;
  signUp: (newUser: SignUpDTO) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function persist(auth: AuthResponseDTO) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

function readStored(): AuthResponseDTO | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function clearPersisted() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const logoutMutation = useLogout();

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setUser({ userId: stored.userId, email: stored.email, name: stored.name, role: stored.role });
      setToken(stored.token);
      setAuthTokens({ token: stored.token, refreshToken: stored.refreshToken });
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    return subscribeAuthTokens((tokens) => {
      if (tokens) {
        const stored = readStored();
        if (stored) persist({ ...stored, token: tokens.token, refreshToken: tokens.refreshToken });
        setToken(tokens.token);
      } else {
        clearPersisted();
        setUser(null);
        setToken(null);
      }
    });
  }, []);

  function applyAuthResponse(auth: AuthResponseDTO) {
    persist(auth);
    setUser({ userId: auth.userId, email: auth.email, name: auth.name, role: auth.role });
    setToken(auth.token);
    setAuthTokens({ token: auth.token, refreshToken: auth.refreshToken });
  }

  async function signIn(credentials: SignInDTO) {
    const auth = await signInMutation.mutateAsync(credentials);
    if (auth) applyAuthResponse(auth);
  }

  async function signUp(newUser: SignUpDTO) {
    const auth = await signUpMutation.mutateAsync(newUser);
    if (auth) applyAuthResponse(auth);
  }

  async function logout() {
    const refreshToken = readStored()?.refreshToken;

    try {
      if (token && refreshToken) {
        await logoutMutation.mutateAsync({ token, refreshToken });
      }
    } finally {
      setAuthTokens(null);
      window.location.href = "/";
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, isReady, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
