import { api } from "../lib/api";

export interface CrearReservaPayload {
	canchaId: string;
	horarioId: string;
	fechaReserva: string;

}

export const obtenerMisReservas = async () => {
	const response = await api.get("/reservas/mias");
	return response.data;
};

export const crearReserva = async (datosReserva: CrearReservaPayload) => {
	const response = await api.post("/reservas", datosReserva);
	return response.data;
};

export const confirmarReserva = async (id: string) => {
	const response = await api.patch(`/reservas/${id}/confirmar`);
	return response.data;
};

export const cancelarReserva = async (id: string) => {
	const response = await api.patch(`/reservas/${id}/cancelar`);
	return response.data;
};
