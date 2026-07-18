export const AUTH_TOKEN_COOKIE = 'reservaplay_token';
export const AUTH_TOKEN_STORAGE_KEY = 'reservaplay_token';
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

function parseCookieString(cookieString: string, name: string): string | null {
  const cookies = cookieString.split(';').map((part) => part.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    if (typeof atob !== 'function') {
      return null;
    }

    const decoded = atob(normalized);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
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

  const localToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (localToken) {
    return localToken;
  }

  return readTokenFromCookieString(window.document.cookie);
}

export function setStoredAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearStoredAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
