import { api } from "../lib/api";
import { getStoredAuthToken } from "../lib/auth";

export interface CrearReservaPayload {
	canchaId: string;
	horarioId: string;
	fechaReserva: string;

}

function buildAuthConfig() {
	const token = getStoredAuthToken();

	if (!token) {
		throw new Error("Debes iniciar sesión para crear una reserva.");
	}

	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
}

export const obtenerMisReservas = async () => {
	const response = await api.get("/reservas/mias", buildAuthConfig());
	return response.data;
};

export const crearReserva = async (datosReserva: CrearReservaPayload) => {
	const response = await api.post("/reservas", datosReserva, buildAuthConfig());
	return response.data;
};

export const confirmarReserva = async (id: string) => {
	const response = await api.patch(`/reservas/${id}/confirmar`, undefined, buildAuthConfig());
	return response.data;
};

export const cancelarReserva = async (id: string) => {
	const response = await api.patch(`/reservas/${id}/cancelar`, undefined, buildAuthConfig());
	return response.data;
};
