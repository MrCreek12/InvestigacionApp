// InvestigacionApp.client/src/App.jsx

import { useState, useEffect } from 'react';
import * as piezaService from './services/piezaService';
import './App.css';

function App() {
    const [piezas, setPiezas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState(0); // 0: Nuevo, 1: Usado, 2: Reciclado

    // Nuevos estados para campos adicionales del modelo Pieza.cs
    const [cantidad, setCantidad] = useState(''); // String para "10kg", "5 unidades", etc.
    const [ubicacion, setUbicacion] = useState('');
    const [posiblesUsos, setPosiblesUsos] = useState(''); // Opcional, por eso string? en el modelo

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
        // Construimos el objeto nuevaPieza con todos los campos del modelo
        const nuevaPieza = {
            nombre,
            estado,
            cantidad,
            ubicacion,
            // Si posiblesUsos está vacío, lo enviamos como null (o un string vacío, el backend lo maneja)
            // Esto es importante para el '?' en 'string?' del modelo C#.
            posiblesUsos: posiblesUsos || null
        };

        try {
            await piezaService.createPieza(nuevaPieza);
            // Limpiar formulario y recargar lista
            setNombre('');
            setEstado(0); // Restablecer a "Nuevo"
            setCantidad('');
            setUbicacion('');
            setPosiblesUsos('');
            cargarPiezas();
        } catch (error) {
            console.error("Error al guardar la pieza:", error);
            // Aquí podrías mostrar un mensaje al usuario
            alert("Hubo un error al guardar la pieza. Revisa la consola para más detalles.");
        }
    };

    const handleBorrar = async (id) => {
        try {
            await piezaService.deletePieza(id);
            cargarPiezas();
        } catch (error) {
            console.error("Error al borrar la pieza:", error);
            alert("Hubo un error al borrar la pieza. Revisa la consola para más detalles.");
        }
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
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value={"Nuevo"}>Nuevo</option>
                    <option value={"Usado"}>Usado</option>
                    <option value={"Reciclado"}>Reciclado</option>
                </select>
                <input
                    type="text"
                    placeholder="Cantidad (ej. 10kg, 5 unidades)"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required // Cantidad es requerida en el modelo C# (no es string?)
                />
                <input
                    type="text"
                    placeholder="Ubicación"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    required // Ubicación es requerida en el modelo C# (no es string?)
                />
                <textarea // Un textarea es mejor para textos más largos
                    placeholder="Posibles usos (opcional)"
                    value={posiblesUsos}
                    onChange={(e) => setPosiblesUsos(e.target.value)}
                // Este campo no es 'required' porque es 'string?' en el modelo
                ></textarea>
                <button type="submit">Guardar</button>
            </form>

            <hr />

            <h2>Listado de Piezas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        {/* Podemos añadir más columnas si queremos mostrar los nuevos campos */}
                        <th>Cantidad</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {piezas.map(pieza => (
                        <tr key={pieza.id}>
                            <td>{pieza.nombre}</td>
                            <td>{pieza.estado}</td>
                            <td>{pieza.cantidad}</td>
                            <td>{pieza.ubicacion}</td>
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
