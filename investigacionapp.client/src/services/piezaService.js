// InvestigacionApp.client/src/services/piezaService.js

const API_URL = "https://localhost:7276/api/Piezas";

const getHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('Token para headers:', token); // Debug
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('Headers construidos:', headers); // Debug
    return headers;
};

export const getPiezas = async () => {
    try {
        console.log('Iniciando getPiezas...'); // Debug
        
        const headers = getHeaders();
        console.log('Haciendo fetch a:', API_URL, 'con headers:', headers); // Debug
        
        const response = await fetch(API_URL, {
            headers: headers
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText); // Debug
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType); // Debug
        
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Error 401 - No autorizado'); // Debug
                throw new Error('No autorizado. Por favor inicia sesión.');
            }
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                console.error('Error del servidor (JSON):', error); // Debug
                throw new Error(error.message || 'Error al obtener las piezas');
            } else {
                const errorText = await response.text();
                console.error('Error del servidor (texto):', errorText); // Debug
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }
        
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('Respuesta no es JSON:', responseText); // Debug
            throw new Error('El servidor no devolvió una respuesta JSON válida');
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data); // Debug
        return data;
    } catch (error) {
        console.error('Error en getPiezas:', error); // Debug
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor. Verifica que el servidor esté corriendo.');
        }
        throw error;
    }
};

export const createPieza = async (pieza) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(pieza)
        });
        
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('No autorizado. Por favor inicia sesión.');
            }
            if (response.status === 403) {
                throw new Error('No tienes permisos para realizar esta acción.');
            }
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al crear la pieza');
            } else {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor.');
        }
        throw error;
    }
};

export const updatePieza = async (id, pieza) => {
    try {
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
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al actualizar la pieza');
            } else {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor.');
        }
        throw error;
    }
};

export const deletePieza = async (id) => {
    try {
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
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al eliminar la pieza');
            } else {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor.');
        }
        throw error;
    }
};