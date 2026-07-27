import { api } from '../lib/api';
import {
	loginAdministrador as loginAdministradorRequest,
	registrarAdministrador as registrarAdministradorRequest,
	type AdminLoginPayload,
	type AdminRegisterPayload,
} from './admin.service';

export async function registrarUsuario(datosUsuario: any) {
	const response = await api.post('/auth/register', datosUsuario);
	return response.data;
}

export async function loginUsuario(datosLogin: any) {
	const response = await api.post('/auth/login', datosLogin);
	return response.data;
}

type AdminLoginResponse = {
	access_token?: string;
	token?: string;
};

export async function loginAdministrador(datosLogin: AdminLoginPayload): Promise<AdminLoginResponse> {
	const payload: AdminLoginPayload = {
		email: datosLogin.email.trim(),
		password: datosLogin.password,
	};

	return loginAdministradorRequest(payload);
}

export async function registrarAdministrador(datosRegistro: AdminRegisterPayload) {
	return registrarAdministradorRequest(datosRegistro);
}

export async function obtenerPerfil() {
	const response = await api.get('/auth/me');
	return response.data;
}
