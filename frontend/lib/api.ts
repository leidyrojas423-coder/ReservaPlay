import axios, { AxiosHeaders } from "axios";
import { getStoredAuthToken } from "./auth";

export const api = axios.create({
  baseURL: "http://localhost:3000",
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
