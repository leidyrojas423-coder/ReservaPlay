'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  isJwtExpired,
  setStoredAuthToken,
} from '../lib/auth';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = getStoredAuthToken();

      if (storedToken && !isJwtExpired(storedToken)) {
        setToken(storedToken);
      } else {
        clearStoredAuthToken();
        setToken(null);
      }
    } catch {
      clearStoredAuthToken();
      setToken(null);
    } finally {
      setIsReady(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    isAuthenticated: Boolean(token),
    isReady,
    login: (nextToken: string) => {
      if (!nextToken || isJwtExpired(nextToken)) {
        clearStoredAuthToken();
        setToken(null);
        return;
      }

      setStoredAuthToken(nextToken);
      setToken(nextToken);
    },
    logout: () => {
      clearStoredAuthToken();
      setToken(null);
    },
  }), [isReady, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
