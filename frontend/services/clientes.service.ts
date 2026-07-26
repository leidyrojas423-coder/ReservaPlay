import { api } from '../lib/api';

export async function obtenerClientes() {
	const response = await api.get('/clientes');
	return response.data;
}

export async function crearCliente(datosCliente: any) {
	const response = await api.post('/clientes', datosCliente);
	return response.data;
}
