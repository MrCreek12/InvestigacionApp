// InvestigacionApp.client/src/App.jsx

import { useState, useEffect } from 'react';
import * as piezaService from './services/piezaService';
import './App.css';

function App() {
    const [piezas, setPiezas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState(0); // 0: Nuevo, 1: Usado, 2: Reciclado

    // useEffect se ejecuta cuando el componente se carga
    useEffect(() => {
        cargarPiezas();
    }, []);

    const cargarPiezas = async () => {
        const data = await piezaService.getPiezas();
        setPiezas(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaPieza = { nombre, estado, cantidad: "1", ubicacion: "Taller" };
        await piezaService.createPieza(nuevaPieza);

        // Limpiar formulario y recargar lista
        setNombre('');
        cargarPiezas();
    };

    const handleBorrar = async (id) => {
        await piezaService.deletePieza(id);
        cargarPiezas();
    };

    return (
        <div className="App">
            <h1>Inventario Inteligente de Piezas Recicladas ♻️</h1>

            <form onSubmit={handleSubmit}>
                <h2>Añadir Nueva Pieza</h2>
                <input
                    type="text"
                    placeholder="Nombre de la pieza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <select value={estado} onChange={(e) => setEstado(Number(e.target.value))}>
                    <option value={0}>Nuevo</option>
                    <option value={1}>Usado</option>
                    <option value={2}>Reciclado</option>
                </select>
                <button type="submit">Guardar</button>
            </form>

            <hr />

            <h2>Listado de Piezas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {piezas.map(pieza => (
                        <tr key={pieza.id}>
                            <td>{pieza.nombre}</td>
                            <td>{['Nuevo', 'Usado', 'Reciclado'][pieza.estado]}</td>
                            <td>
                                <button onClick={() => handleBorrar(pieza.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;