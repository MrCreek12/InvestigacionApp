// InvestigacionApp.client/src/App.jsx

import { useState, useEffect } from 'react';
import * as piezaService from './services/piezaService';
import { getUser, logout, isAuthenticated, isAdmin } from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

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
        <div className="App">
            <header className="app-header">
                <h1>Inventario Inteligente de Piezas Recicladas ♻️</h1>
                <div className="user-info">
                    <span>👤 {user.username} ({user.rol})</span>
                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {error && <div className="error-banner">{error}</div>}

            {/* Solo Admin puede crear piezas */}
            {isAdmin() && (
                <form onSubmit={handleSubmit} className="pieza-form">
                    <h2>Añadir Nueva Pieza</h2>
                    <input
                        type="text"
                        placeholder="Nombre de la pieza"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Usado">Usado</option>
                        <option value="Reciclado">Reciclado</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Cantidad (ej. 10kg, 5 unidades)"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Ubicación"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Posibles usos (opcional)"
                        value={posiblesUsos}
                        onChange={(e) => setPosiblesUsos(e.target.value)}
                    ></textarea>
                    <button type="submit">Guardar</button>
                </form>
            )}

            <hr />

            <h2>Listado de Piezas</h2>
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
                                {isAdmin() && (
                                    <td>
                                        <button 
                                            onClick={() => handleBorrar(pieza.id)}
                            className="delete-btn"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
