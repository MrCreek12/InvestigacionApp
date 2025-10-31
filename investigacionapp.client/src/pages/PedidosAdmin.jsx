import React, { useEffect, useState } from 'react';
import * as pedidoService from '../services/pedidoService';

const PedidosAdmin = () => {
    const [pedidos, setPedidos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const data = await pedidoService.getPedidos();
            if (Array.isArray(data)) {
                setPedidos(data);
                setError('');
            } else {
                throw new Error('La respuesta del servidor no es válida.');
            }
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Pedidos Realizados</h2>
            {error && <div className="error-banner">{error}</div>}
            {pedidos.length === 0 ? (
                <p className="no-data">No hay pedidos registrados</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Usuario</th>
                            <th>Fecha</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.usuarioId}</td>
                                <td>{new Date(pedido.fecha).toLocaleString()}</td>
                                <td>
                                    <ul>
                                        {pedido.detalles.map(detalle => (
                                            <li key={detalle.id}>
                                                Pieza ID: {detalle.piezaId}, Cantidad: {detalle.cantidad}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PedidosAdmin;