import axios, { AxiosHeaders } from "axios";
import { getStoredAuthToken } from "./auth";

export const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (!token) {
    return config;
  }

  if (config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  }

  config.headers = AxiosHeaders.from({
    ...(config.headers ?? {}),
    Authorization: `Bearer ${token}`,
  });

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(
        error instanceof Error ? error : new Error("No se pudo completar la solicitud."),
      );
    }

    if (!error.response) {
      return Promise.reject(
        new Error(
          `No se pudo conectar con el backend (${API_BASE_URL}). Verifica que el backend esté ejecutándose en http://localhost:3000 y que sea accesible desde el navegador.`,
        ),
      );
    }

    const payload = error.response.data as
      | {
          message?: string | string[];
          error?: string;
        }
      | undefined;

    if (Array.isArray(payload?.message)) {
      return Promise.reject(new Error(payload.message.join(", ")));
    }

    if (typeof payload?.message === "string" && payload.message.trim().length > 0) {
      return Promise.reject(new Error(payload.message));
    }

    if (typeof payload?.error === "string" && payload.error.trim().length > 0) {
      return Promise.reject(new Error(payload.error));
    }

    return Promise.reject(
      new Error(`Error ${error.response.status}: ${error.response.statusText || "Solicitud fallida."}`),
    );
  },
);
