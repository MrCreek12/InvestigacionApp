import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'https://localhost:7276/api/pedidos';

export const getPedidos = async () => {
    try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(API_URL, { headers });
        return response.data;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);

        // Mejor mensaje para 401/403
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error('No autorizado. Inicie sesión con una cuenta de administrador.');
            }
            // Si el servidor devuelve un mensaje en JSON
            if (error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
        }

        throw error;
    }
};

export const createPedido = async (pedido) => {
    try {
        const token = getToken(); // Obtener token desde authService (sessionStorage)
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.post(API_URL, pedido, { headers });
        return response.data;
    } catch (error) {
        console.error('Error al crear pedido:', error);
        console.error('Detalles del error:', error.response || error.message);

        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error('No autorizado. Inicie sesión para crear pedidos.');
            }
            if (error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            }
        }

        throw error;
    }
};