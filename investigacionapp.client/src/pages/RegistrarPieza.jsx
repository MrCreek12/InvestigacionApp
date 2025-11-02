import React, { useState } from 'react';
import * as piezaService from '../services/piezaService';

// No es necesario modificar tu lógica de estado o el handleSubmit
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
        // 1. Contenedor principal para centrar la tarjeta
        <div className="registrar-pieza-container">
            {/* 2. La tarjeta oscura que contiene todo el formulario */}
            <div className="registrar-pieza-card">
                <h2>Registrar Nueva Pieza</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* 3. El grid para organizar los campos */}
                    <div className="form-grid">
                        {/* Cada campo va dentro de un .form-group */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre de la pieza</label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Ej: Tornillo hexagonal M8"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                                <option value="Nuevo">Nuevo</option>
                                <option value="Usado">Usado</option>
                                <option value="Reciclado">Reciclado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cantidad">Cantidad</label>
                            <input
                                id="cantidad"
                                type="text"
                                placeholder="Ej: 10kg, 5 unidades"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="ubicacion">Ubicación</label>
                            <input
                                id="ubicacion"
                                type="text"
                                placeholder="Ej: Estante A, Caja 3"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                                required
                            />
                        </div>

                        {/* Este campo usará la clase 'full-width' para ocupar las 2 columnas */}
                        <div className="form-group full-width">
                            <label htmlFor="posiblesUsos">Posibles usos (opcional)</label>
                            <textarea
                                id="posiblesUsos"
                                placeholder="Ej: Reparación de motor, ensamblaje de chasis..."
                                value={posiblesUsos}
                                onChange={(e) => setPosiblesUsos(e.target.value)}
                                rows="3" // Puedes ajustar la altura
                            ></textarea>
                        </div>
                    </div>

                    {/* El botón de submit ya tiene el estilo correcto gracias a la regla button[type="submit"] */}
                    <button type="submit">Guardar Pieza</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrarPieza;