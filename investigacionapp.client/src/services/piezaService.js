// InvestigacionApp.client/src/services/piezaService.js

const API_URL = "https://localhost:7276/api/Piezas";

export const getPiezas = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};

export const createPieza = async (pieza) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pieza)
    });
    return await response.json();
};

export const updatePieza = async (id, pieza) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pieza)
    });
};

export const deletePieza = async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
};