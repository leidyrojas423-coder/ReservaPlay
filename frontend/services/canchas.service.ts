import { api } from "../lib/api";

export interface Cancha {
	id: string;
	nombre: string;
	descripcion?: string;
	ubicacion?: string;
	activo?: boolean;

}

export type CanchasResponse = Cancha[] & { data: Cancha[] };

export const obtenerCanchas = async (): Promise<CanchasResponse> => {
	const response = await api.get<Cancha[]>("/canchas");
	const canchas = response.data as CanchasResponse;
	canchas.data = canchas;
	return canchas;
};
