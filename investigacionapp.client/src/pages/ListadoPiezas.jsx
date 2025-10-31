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
        alert(`Pieza agregada al box: ${pieza.nombre}`);
    };

    return (
        <div>
            <h2>Listado de Piezas</h2>
            {error && <div className="error-banner">{error}</div>}
            {piezas.length === 0 ? (
                <p className="no-data">No hay piezas registradas</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Cantidad</th>
                            <th>Ubicación</th>
                            <th>Posibles Usos</th>
                            {isAdmin() && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {piezas.map(pieza => (
                            <tr key={pieza.id}>
                                <td>{pieza.nombre}</td>
                                <td>{pieza.estado}</td>
                                <td>{pieza.cantidad}</td>
                                <td>{pieza.ubicacion}</td>
                                <td>{pieza.posiblesUsos || '-'}</td>
                                <td>
                                    <button 
                                        onClick={() => handleAgregarAlBox(pieza)}
                                        className="add-to-box-btn"
                                    >
                                        Agregar al Box
                                    </button>
                                    {isAdmin() && (
                                        <button 
                                            onClick={() => handleBorrar(pieza.id)}
                                            className="delete-btn"
                                        >
                                            Borrar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListadoPiezas;