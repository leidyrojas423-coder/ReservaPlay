export const AUTH_TOKEN_COOKIE = 'reservaplay_token';
export const AUTH_TOKEN_STORAGE_KEY = 'reservaplay_token';
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type JwtPayload = {
  exp?: number;
  role?: string;
  [key: string]: unknown;
};

function parseCookieString(cookieString: string, name: string): string | null {
  const cookies = cookieString.split(';').map((part) => part.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return null;
  }
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    let decoded = '';

    if (typeof atob === 'function') {
      decoded = atob(normalized);
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(normalized, 'base64').toString('utf-8');
    } else {
      return null;
    }

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getJwtRole(token: string): string | null {
  const payload = parseJwtPayload(token);
  if (!payload?.role || typeof payload.role !== 'string') {
    return null;
  }

  return payload.role.toLowerCase();
}

export function isAdminJwt(token: string): boolean {
  return getJwtRole(token) === 'admin';
}

export function isJwtExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
}

export function readTokenFromCookieString(cookieString: string | null | undefined): string | null {
  if (!cookieString) {
    return null;
  }

  return parseCookieString(cookieString, AUTH_TOKEN_COOKIE);
}

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const localToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (localToken) {
      return localToken;
    }
  } catch {
    // Ignorar errores de acceso a storage y continuar con cookie.
  }

  try {
    return readTokenFromCookieString(window.document.cookie);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignorar errores de storage para no romper el flujo de autenticacion.
  }

  window.document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearStoredAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // Ignorar errores de storage para asegurar limpieza de cookie.
  }

  window.document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
