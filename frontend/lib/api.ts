import axios, { type AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const toData = <T>(request: Promise<AxiosResponse<T>>): Promise<T> =>
  request.then((response) => response.data);

type ApiPayload = Record<string, unknown>;

export const authApi = {
  login<TResponse = unknown, TBody extends ApiPayload = ApiPayload>(payload: TBody) {
    return toData(apiClient.post<TResponse>("/auth/login", payload));
  },
};

export const clientesApi = {
  create<TResponse = unknown, TBody extends ApiPayload = ApiPayload>(payload: TBody) {
    return toData(apiClient.post<TResponse>("/clientes", payload));
  },
  getAll<TResponse = unknown>() {
    return toData(apiClient.get<TResponse>("/clientes"));
  },
};

export const canchasApi = {
  getAll<TResponse = unknown>() {
    return toData(apiClient.get<TResponse>("/canchas"));
  },
  getDisponibles<TResponse = unknown>() {
    return toData(apiClient.get<TResponse>("/canchas/disponibles"));
  },
};

export const horariosApi = {
  getByCancha<TResponse = unknown>(canchaId: string | number) {
    return toData(apiClient.get<TResponse>(`/horarios/cancha/${canchaId}`));
  },
};

export const reservasApi = {
  create<TResponse = unknown, TBody extends ApiPayload = ApiPayload>(payload: TBody) {
    return toData(apiClient.post<TResponse>("/reservas", payload));
  },
  getMias<TResponse = unknown>() {
    return toData(apiClient.get<TResponse>("/reservas/mias"));
  },
  confirmar<TResponse = unknown>(id: string | number) {
    return toData(apiClient.patch<TResponse>(`/reservas/${id}/confirmar`));
  },
  cancelar<TResponse = unknown>(id: string | number) {
    return toData(apiClient.patch<TResponse>(`/reservas/${id}/cancelar`));
  },
};
