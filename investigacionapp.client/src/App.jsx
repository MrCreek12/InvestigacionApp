// InvestigacionApp.client/src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as piezaService from './services/piezaService';
import { getUser, logout, isAuthenticated, isAdmin } from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ListadoPiezas from './pages/ListadoPiezas';
import RegistrarPieza from './pages/RegistrarPieza';
import PedidosAdmin from './pages/PedidosAdmin';
import Box from './components/Box';

function App() {
    const [user, setUser] = useState(null);
    const [piezas, setPiezas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('Nuevo');
    const [cantidad, setCantidad] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [posiblesUsos, setPosiblesUsos] = useState('');
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showBox, setShowBox] = useState(false);

    // useEffect se ejecuta cuando el componente se carga
    useEffect(() => {
        // Verificar si hay un usuario autenticado
        if (isAuthenticated()) {
            const userData = getUser();
            setUser(userData);
            cargarPiezas();
        }
    }, []);

    const cargarPiezas = async () => {
        try {
            const data = await piezaService.getPiezas();
            setPiezas(data);
            setError('');
        } catch (error) {
            console.error("Error al cargar piezas:", error);
            setError(error.message);

            // Si el error es de autenticación, cerrar sesión
            if (error.message.includes('autorizado')) {
                handleLogout();
            }
        }
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setShowRegister(false);
        cargarPiezas();
    };

    const handleRegisterSuccess = (userData) => {
        setUser(userData);
        setShowRegister(false);
        cargarPiezas();
    };

    const handleShowRegister = () => {
        setShowRegister(true);
    };

    const handleBackToLogin = () => {
        setShowRegister(false);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setPiezas([]);
        setShowRegister(false);
        window.location.reload();
    };

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
            cargarPiezas();
        } catch (error) {
            console.error("Error al guardar la pieza:", error);
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

    const handleOpenBox = () => setShowBox(true);
    const handleCloseBox = () => setShowBox(false);

    // Si no está autenticado, mostrar login o register
    if (!user) {
        if (showRegister) {
            return (
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onBackToLogin={handleBackToLogin}
                />
            );
        }
        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                onShowRegister={handleShowRegister}
            />
        );
    }

    return (
        <Router>
            <div className="root">
                <Navbar onOpenBox={handleOpenBox} onLogout={handleLogout} />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={
                            <ListadoPiezas
                                piezas={piezas}
                                onBorrar={handleBorrar}
                                isAdmin={isAdmin()}
                                error={error}
                            />
                        } />
                        <Route path="/registrar" element={
                            <RegistrarPieza
                                nombre={nombre}
                                estado={estado}
                                cantidad={cantidad}
                                ubicacion={ubicacion}
                                posiblesUsos={posiblesUsos}
                                setNombre={setNombre}
                                setEstado={setEstado}
                                setCantidad={setCantidad}
                                setUbicacion={setUbicacion}
                                setPosiblesUsos={setPosiblesUsos}
                                onSubmit={handleSubmit}
                                isAdmin={isAdmin()}
                                error={error}
                            />
                        } />
                        <Route path="/pedidos" element={<PedidosAdmin />} />
                    </Routes>
                </div>
                {/* 🔥 MOVIDO FUERA de main-content - Ahora está al nivel del root */}
                {showBox && <Box onClose={handleCloseBox} />}
            </div>
        </Router>
    );
}

export default App;