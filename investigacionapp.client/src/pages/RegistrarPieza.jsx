import React, { useState } from 'react';
import * as piezaService from '../services/piezaService';

const RegistrarPieza = () => {
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('Nuevo');
    const [cantidad, setCantidad] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [posiblesUsos, setPosiblesUsos] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaPieza = {
            nombre,
            estado,
            cantidad,
            ubicacion,
            posiblesUsos: posiblesUsos || null
        };

        try {
            await piezaService.createPieza(nuevaPieza);
            setNombre('');
            setEstado('Nuevo');
            setCantidad('');
            setUbicacion('');
            setPosiblesUsos('');
            setError('');
        } catch (error) {
            console.error("Error al guardar la pieza:", error);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Registrar Nueva Pieza</h2>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit} className="pieza-form">
                <input
                    type="text"
                    placeholder="Nombre de la pieza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                    <option value="Reciclado">Reciclado</option>
                </select>
                <input
                    type="text"
                    placeholder="Cantidad (ej. 10kg, 5 unidades)"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Ubicación"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Posibles usos (opcional)"
                    value={posiblesUsos}
                    onChange={(e) => setPosiblesUsos(e.target.value)}
                ></textarea>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default RegistrarPieza;