// src/components/Navbar.js

import React from 'react';
// Se cambia Link por NavLink para manejar la clase 'active' automáticamente
import { NavLink } from 'react-router-dom';
import { getUser, isAuthenticated } from '../services/authService';

const Navbar = ({ onOpenBox, onLogout }) => {
    const user = getUser();
    const authenticated = isAuthenticated();
    const isAdmin = user && user.rol === 'Admin';

    // Función para asignar clases a los NavLink y determinar si están activos
    const getNavLinkClass = ({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link";

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                {/* Texto del logo cambiado */}
                <h1 className="sidebar-logo">Pieza por Pieza</h1>
            </div>

            <div className="sidebar-search">
                {/* Placeholder del buscador cambiado */}
                <input type="search" placeholder="Alguna pieza que quieras comprar" />
            </div>

            <ul className="sidebar-menu">
                <li className="sidebar-item">
                    {/* Enlace de Inicio con ícono */}
                    <NavLink to="/" className={getNavLinkClass} end>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>Inicio</span>
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/registrar" className={getNavLinkClass}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Registrar Pieza</span>
                    </NavLink>
                </li>
                {authenticated && isAdmin && (
                    <li className="sidebar-item">
                        {/* Enlace de Pedidos con ícono */}
                        <NavLink to="/pedidos" className={getNavLinkClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path>
                            </svg>
                            <span>Pedidos</span>
                        </NavLink>
                    </li>
                )}
                <li className="sidebar-item">
                    <button className="sidebar-link box-btn" onClick={onOpenBox}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        <span>Mi Box</span>
                    </button>
                </li>
                <li className="sidebar-item logout-item">
                    {/* Botón de Cerrar Sesión con ícono */}
                    <button className="sidebar-link logout-btn" onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Cerrar Sesión</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;