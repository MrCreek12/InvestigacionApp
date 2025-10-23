// InvestigacionApp.client/src/services/piezaService.js

const API_URL = "https://localhost:7276/api/Piezas";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const getPiezas = async () => {
    const response = await fetch(API_URL, {
        headers: getHeaders()
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('No autorizado. Por favor inicia sesión.');
        }
        throw new Error('Error al obtener las piezas');
    }
    
    return await response.json();
};

export const createPieza = async (pieza) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(pieza)
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('No autorizado. Por favor inicia sesión.');
        }
        if (response.status === 403) {
            throw new Error('No tienes permisos para realizar esta acción.');
        }
        throw new Error('Error al crear la pieza');
    }
    
    return await response.json();
};

export const updatePieza = async (id, pieza) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(pieza)
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('No autorizado. Por favor inicia sesión.');
        }
        if (response.status === 403) {
            throw new Error('No tienes permisos para realizar esta acción.');
        }
        throw new Error('Error al actualizar la pieza');
    }
};

export const deletePieza = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('No autorizado. Por favor inicia sesión.');
        }
        if (response.status === 403) {
            throw new Error('No tienes permisos para realizar esta acción.');
        }
        throw new Error('Error al eliminar la pieza');
    }
};};