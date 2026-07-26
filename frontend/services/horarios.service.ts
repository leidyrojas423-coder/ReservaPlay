import { api } from "../lib/api";

export interface Horario {
	id: string;
	nombre: string;
	descripcion?: string;
	fechaInicio: string;
	fechaFin: string;
	activo?: boolean;
	canchaId: string;

}


export const obtenerHorariosPorCancha = async (
	canchaId: string
): Promise<Horario[]> => {
	const response = await api.get(`/horarios/cancha/${canchaId}`);
	return response.data;
};
