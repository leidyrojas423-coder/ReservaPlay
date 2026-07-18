'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = {
  user: { name: string } | null;
};

const AuthContext = createContext<AuthContextValue>({ user: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState({ name: 'Administrador' });
  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
