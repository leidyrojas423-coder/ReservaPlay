import axios from 'axios';
import { api } from '../lib/api';

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminRegisterPayload = {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  password: string;
  telefono: string;
};

export type AdminCancha = {
  id: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  capacidad?: number;
  precio?: number;
  activo?: boolean;
};

export type AdminHorario = {
  id: string;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
  canchaId: string;
  cancha?: {
    id?: string;
    nombre?: string;
  };
};

export type AdminReservaEstado =
  | 'Pendiente'
  | 'Confirmada'
  | 'Pagada'
  | 'Finalizada'
  | 'Cancelada';

export type AdminReserva = {
  id: string;
  fechaReserva?: string;
  fecha?: string;
  estado?: string;
  canchaId?: string;
  horarioId?: string;
  cancha?: { nombre?: string } | string;
  horario?:
    | {
        nombre?: string;
        horaInicio?: string;
        horaFin?: string;
        fechaInicio?: string;
        fechaFin?: string;
      }
    | string;
  cliente?:
    | {
        nombre?: string;
        apellido?: string;
        email?: string;
      }
    | string;
  total?: number;
  precio?: number;
  monto?: number;
};

type DashboardPayload = {
  message?: string;
};

function normalizeArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const value = payload as Record<string, unknown>;

    if (Array.isArray(value.data)) {
      return value.data as T[];
    }

    if (Array.isArray(value.items)) {
      return value.items as T[];
    }

    if (Array.isArray(value.reservas)) {
      return value.reservas as T[];
    }

    if (Array.isArray(value.results)) {
      return value.results as T[];
    }
  }

  return [];
}

async function tryGet<T>(paths: string[]): Promise<T> {
  let lastError: unknown;

  for (const path of paths) {
    try {
      const response = await api.get<T>(path);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!axios.isAxiosError(error) || (error.response?.status && error.response.status < 500 && error.response.status !== 404)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error('No se pudo completar la consulta.');
}

async function tryPatch<T>(paths: string[], body?: unknown): Promise<T> {
  let lastError: unknown;

  for (const path of paths) {
    try {
      const response = await api.patch<T>(path, body);
      return response.data;
    } catch (error) {
      lastError = error;
      if (!axios.isAxiosError(error) || (error.response?.status && error.response.status < 500 && error.response.status !== 404)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error('No se pudo completar la operación.');
}

export async function loginAdministrador(datosLogin: AdminLoginPayload) {
  const response = await api.post('/auth/admin/login', datosLogin);
  return response.data as { access_token?: string; token?: string };
}

export async function registrarAdministrador(datos: AdminRegisterPayload) {
  const payload = {
    ...datos,
    name: `${datos.nombre} ${datos.apellido}`.trim(),
    profile: 'Administrador',
  };

  const response = await api.post('/auth/register', payload);
  return response.data;
}

export async function obtenerAdminDashboard() {
  const response = await api.get<DashboardPayload>('/auth/admin/dashboard');
  return response.data;
}

export async function listarCanchas() {
  const response = await api.get('/canchas');
  return normalizeArray<AdminCancha>(response.data);
}

export async function crearCancha(payload: Omit<AdminCancha, 'id'>) {
  const response = await api.post('/canchas', payload);
  return response.data as AdminCancha;
}

export async function actualizarCancha(id: string, payload: Partial<AdminCancha>) {
  const response = await api.put(`/canchas/${id}`, payload);
  return response.data as AdminCancha;
}

export async function desactivarCancha(id: string) {
  const response = await api.patch(`/canchas/${id}/desactivar`);
  return response.data as AdminCancha;
}

export async function listarHorarios() {
  const response = await api.get('/horarios');
  return normalizeArray<AdminHorario>(response.data);
}

export async function crearHorario(payload: Omit<AdminHorario, 'id' | 'cancha'>) {
  const response = await api.post('/horarios', payload);
  return response.data as AdminHorario;
}

export async function desactivarHorario(id: string) {
  const response = await api.patch(`/horarios/${id}/desactivar`);
  return response.data as AdminHorario;
}

export async function listarReservasAdmin() {
  const payload = await tryGet<unknown>(['/reservas', '/reservas/mias']);
  return normalizeArray<AdminReserva>(payload);
}

export async function confirmarReservaAdmin(id: string) {
  const response = await api.patch(`/reservas/${id}/confirmar`);
  return response.data;
}

export async function cancelarReservaAdmin(id: string, motivo?: string) {
  const response = await api.patch(`/reservas/${id}/cancelar`, motivo ? { motivo } : {});
  return response.data;
}

export async function registrarPagoManualAdmin(id: string) {
  return tryPatch([
    `/reservas/${id}/pago-manual`,
    `/reservas/${id}/pagar`,
    `/reservas/${id}/confirmar`,
  ]);
}