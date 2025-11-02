// investigacionapp.client/src/components/Box.jsx

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as boxService from '../services/boxService';
import * as pedidoService from '../services/pedidoService';

// --- Iconos SVG para una UI más limpia ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);


const Box = ({ onClose }) => {
    const [boxItems, setBoxItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBoxItems();
    }, []);

    const loadBoxItems = () => {
        const items = boxService.getBoxItems();
        setBoxItems(items);
    };

    const handleUpdateQuantity = (piezaId, nuevaCantidad) => {
        const cantidad = parseInt(nuevaCantidad, 10);
        if (!isNaN(cantidad) && cantidad >= 0) {
            const updatedItems = boxService.updateBoxItemQuantity(piezaId, cantidad);
            setBoxItems(updatedItems);
        }
    };

    const handleRemoveItem = (piezaId) => {
        const updatedItems = boxService.removeFromBox(piezaId);
        setBoxItems(updatedItems);
    };

    const handleClearBox = () => {
        if (window.confirm('¿Está seguro de que desea vaciar todo el box?')) {
            const updatedItems = boxService.clearBox();
            setBoxItems(updatedItems);
        }
    };

    const handleSubmitRequest = async () => {
        if (boxItems.length === 0) {
            alert('El box está vacío. Agregue piezas para poder enviar una solicitud.');
            return;
        }

        setLoading(true);

        const pedido = {
            usuarioId: 4, // Reemplazar con el ID del usuario autenticado
            detalles: boxItems.map(item => ({
                piezaId: item.pieza.id,
                cantidad: item.cantidadSolicitada
            }))
        };

        try {
            await pedidoService.createPedido(pedido);
            alert('Pedido enviado exitosamente');
            boxService.clearBox();
            setBoxItems([]);
            onClose();
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al enviar el pedido. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const totalItems = boxItems.reduce((total, item) => total + item.cantidadSolicitada, 0);

    // 🔥 RENDERIZA DIRECTAMENTE EN document.body
    return createPortal(
        <div className="box-overlay" onClick={handleOverlayClick}>
            <div className="box-modal" role="dialog" aria-modal="true" aria-labelledby="box-title">
                <div className="box-header">
                    <h2 id="box-title">📦 Mi Box de Pedido</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
                        <CloseIcon />
                    </button>
                </div>

                <div className="box-content">
                    {boxItems.length === 0 ? (
                        <div className="empty-box">
                            <p>Tu box está vacío</p>
                            <p>Agrega piezas desde el listado para crear tu pedido</p>
                        </div>
                    ) : (
                        <>
                            <div className="box-summary">
                                <p>Total de piezas solicitadas: <strong>{totalItems}</strong></p>
                            </div>

                            <div className="box-items">
                                {boxItems.map(item => (
                                    <div key={item.pieza.id} className="box-item">
                                        <div className="item-info">
                                            <h4>{item.pieza.nombre}</h4>
                                            <p>Disponible: {item.pieza.cantidad} | Ubicación: {item.pieza.ubicacion}</p>
                                        </div>

                                        <div className="item-controls">
                                            <div className="quantity-control">
                                                <label htmlFor={`quantity-${item.pieza.id}`}>Cantidad:</label>
                                                <input
                                                    id={`quantity-${item.pieza.id}`}
                                                    type="number"
                                                    min="1"
                                                    max={item.pieza.cantidad}
                                                    value={item.cantidadSolicitada}
                                                    onChange={(e) => handleUpdateQuantity(item.pieza.id, e.target.value)}
                                                    className="quantity-input"
                                                />
                                            </div>

                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemoveItem(item.pieza.id)}
                                                aria-label={`Remover ${item.pieza.nombre} del box`}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="box-actions">
                                <button
                                    className="clear-btn"
                                    onClick={handleClearBox}
                                    disabled={loading}
                                >
                                    Vaciar Box
                                </button>

                                <button
                                    className="submit-btn"
                                    onClick={handleSubmitRequest}
                                    disabled={loading || totalItems === 0}
                                >
                                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body // 🔥 CAMBIO CLAVE: Renderiza en document.body en lugar de modal-root
    );
};

export default Box;