import React, { useEffect, useState } from 'react';
import * as piezaService from '../services/piezaService';
import * as boxService from '../services/boxService';
import { isAdmin } from '../services/authService';

const ListadoPiezas = () => {
    const [piezas, setPiezas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPiezas();
    }, []);

    const cargarPiezas = async () => {
        try {
            const data = await piezaService.getPiezas();
            setPiezas(data);
            setError('');
        } catch (error) {
            console.error("Error al cargar piezas:", error);
            setError(error.message);
        }
    };

    // La función de borrar se mantiene, aunque el botón ya no está en la card.
    const handleBorrar = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta pieza?')) {
            return;
        }

        try {
            await piezaService.deletePieza(id);
            setError('');
            cargarPiezas();
        } catch (error) {
            console.error("Error al borrar la pieza:", error);
            setError(error.message);
        }
    };

    const handleAgregarAlBox = (pieza) => {
        boxService.addToBox(pieza);
        alert(`Pieza "${pieza.nombre}" agregada al box.`);
    };

    return (
        <div className="content-area">
            {/* Mensaje de bienvenida y título de la sección actualizados */}
            <h1>¡Hola Melbert!, ¿Listo para Reciclar?</h1>
            <h2 className="section-title">Piezas</h2>

            {error && <div className="error-banner">{error}</div>}
            {piezas.length === 0 ? (
                <p className="no-data">No hay piezas registradas</p>
            ) : (
                <div className="piezas-grid">
                    {piezas.map(pieza => (
                        <div key={pieza.id} className="pieza-card">
                            {/* Placeholder de la imagen con botón y overlay de cantidad */}
                            <div className="card-image-placeholder">
                                <div className="cantidad-overlay">
                                    <p>Cantidad:</p>
                                    <p>{pieza.cantidad}</p>
                                </div>
                                <button
                                    onClick={() => handleAgregarAlBox(pieza)}
                                    className="add-to-box-btn"
                                    title="Agregar al Box"
                                >
                                    +
                                </button>
                            </div>

                            {/* Información de la card */}
                            <div className="card-info">
                                <div className="card-title-line">
                                    <h3 className="card-title">{pieza.nombre}</h3>
                                    <span className={`card-status estado-${pieza.estado?.toLowerCase()}`}>{pieza.estado}</span>
                                </div>
                                <p className="card-description"> {pieza.posiblesUsos || 'No especificada'}</p>
                                <p className="card-location">{pieza.ubicacion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListadoPiezas;