import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, isAuthenticated } from '../services/authService';

const Navbar = ({ onOpenBox, onLogout }) => {
    const user = getUser();
    const authenticated = isAuthenticated();
    const isAdmin = user && user.rol === 'Admin';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Inventario ??
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Listado de Piezas</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/registrar" className="navbar-link">Registrar Pieza</Link>
                    </li>
                    {authenticated && isAdmin && (
                        <li className="navbar-item">
                            <Link to="/pedidos" className="navbar-link">Pedidos</Link>
                        </li>
                    )}
                    <li className="navbar-item">
                        <button className="navbar-link box-btn" onClick={onOpenBox}>?? Mi Box</button>
                    </li>
                    <li className="navbar-item">
                        <button className="navbar-link logout-btn" onClick={onLogout}>Cerrar Sesión</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;