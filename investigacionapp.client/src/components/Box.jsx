// investigacionapp.client/src/components/Box.jsx

import { useState, useEffect } from 'react';
import * as boxService from '../services/boxService';
import './Box.css';

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
        const cantidad = parseInt(nuevaCantidad);
        if (cantidad >= 0) {
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
            alert('El box está vacío');
            return;
        }

        setLoading(true);
        
        // Simular envío de solicitud (aquí podrías enviar a una API)
        setTimeout(() => {
            alert(`Solicitud enviada exitosamente!\n\nPiezas solicitadas:\n${boxItems.map(item => 
                `- ${item.pieza.nombre} (${item.cantidadSolicitada})`
            ).join('\n')}`);
            
            // Limpiar el box después de enviar
            const updatedItems = boxService.clearBox();
            setBoxItems(updatedItems);
            setLoading(false);
        }, 1500);
    };

    const totalItems = boxItems.reduce((total, item) => total + item.cantidadSolicitada, 0);

    return (
        <div className="box-overlay">
            <div className="box-modal">
                <div className="box-header">
                    <h2>📦 Mi Box</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="box-content">
                    {boxItems.length === 0 ? (
                        <div className="empty-box">
                            <p>Tu box está vacío</p>
                            <p>Agrega piezas desde el inventario</p>
                        </div>
                    ) : (
                        <>
                            <div className="box-summary">
                                <p>Total de items: <strong>{totalItems}</strong></p>
                            </div>

                            <div className="box-items">
                                {boxItems.map(item => (
                                    <div key={item.pieza.id} className="box-item">
                                        <div className="item-info">
                                            <h4>{item.pieza.nombre}</h4>
                                            <p>Estado: {item.pieza.estado}</p>
                                            <p>Disponible: {item.pieza.cantidad}</p>
                                            <p>Ubicación: {item.pieza.ubicacion}</p>
                                        </div>
                                        
                                        <div className="item-controls">
                                            <div className="quantity-control">
                                                <label>Cantidad solicitada:</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.cantidadSolicitada}
                                                    onChange={(e) => handleUpdateQuantity(item.pieza.id, e.target.value)}
                                                    className="quantity-input"
                                                />
                                            </div>
                                            
                                            <button 
                                                className="remove-btn"
                                                onClick={() => handleRemoveItem(item.pieza.id)}
                                            >
                                                Remover
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
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Box; 