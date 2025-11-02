import React from 'react';

const PieceCard = ({ pieza, onAddToBox }) => {
    // Determinar la clase del estado para el estilo condicional
    const statusClass = pieza.estado === 'Disponible' ? 'disponible' : 'agotado';

    return (
        <div className="piece-card">
            <div className="image-container">
                {/* Si tienes una URL de imagen, úsala. Si no, muestra un placeholder. */}
                {pieza.imageUrl ? (
                    <img src={pieza.imageUrl} alt={pieza.descripcion} />
                ) : (
                    <span>Sin imagen</span>
                )}
                <div className="quantity-overlay">
                    <span>Cantidad</span>
                    {pieza.cantidad}
                </div>
            </div>
            <div className="card-details">
                <span className={`card-status ${statusClass}`}>{pieza.estado}</span>
                <h3 className="card-description">{pieza.descripcion}</h3>
                <p className="card-location">{pieza.ubicacion}</p>
            </div>
            <button
                className="add-to-box-btn"
                onClick={() => onAddToBox(pieza)}
                title="Agregar al Box"
            >
                +
            </button>
        </div>
    );
};

export default PieceCard;