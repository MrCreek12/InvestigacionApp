// investigacionapp.client/src/services/authService.js

const API_URL = "https://localhost:7276/api/Auth";

export const login = async (username, password) => {
    try {
        console.log('Enviando datos de login:', { username, password }); // Debug

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Verificar el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            // Si la respuesta contiene JSON, intentar parsearlo
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al iniciar sesión');
            } else {
                // Si no es JSON, leer como texto para debugging
                const errorText = await response.text();
                console.error('Error del servidor (no JSON):', errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }

        // Verificar que la respuesta exitosa también sea JSON
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('Respuesta no es JSON:', responseText);
            throw new Error('El servidor no devolvió una respuesta JSON válida');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Debug
        
        // Verificar que el token existe (usando minúsculas como viene del servidor)
        if (!data.token) {
            throw new Error('No se recibió el token de autenticación');
        }
        
        // Guardar token y datos del usuario en localStorage (usando las propiedades en minúsculas)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            email: data.email,
            rol: data.rol
        }));

        console.log('Token guardado:', data.token); // Debug
        console.log('Usuario guardado:', { username: data.username, email: data.email, rol: data.rol }); // Debug

        return {
            token: data.token,
            username: data.username,
            email: data.email,
            rol: data.rol,
            expiration: data.expiration
        };
    } catch (error) {
        console.error('Error en login:', error); // Debug
        // Si es un error de red o parsing
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor. Verifica que el servidor esté corriendo.');
        }
        throw error;
    }
};

export const register = async (username, email, password, rol = 'User') => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, rol })
        });

        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al registrarse');
            } else {
                const errorText = await response.text();
                console.error('Error del servidor (no JSON):', errorText);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
        }

        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('Respuesta no es JSON:', responseText);
            throw new Error('El servidor no devolvió una respuesta JSON válida');
        }

        const data = await response.json();
        
        // Guardar token y datos del usuario en localStorage (usando las propiedades en minúsculas)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            username: data.username,
            email: data.email,
            rol: data.rol
        }));

        return data;
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor. Verifica que el servidor esté corriendo.');
        }
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Sesión cerrada, token y usuario eliminados'); // Debug
};

export const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token obtenido:', token); // Debug
    return token;
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    console.log('Usuario obtenido (string):', user); // Debug
    const parsedUser = user ? JSON.parse(user) : null;
    console.log('Usuario parseado:', parsedUser); // Debug
    return parsedUser;
};

export const isAuthenticated = () => {
    const token = getToken();
    const isAuth = !!token;
    console.log('¿Está autenticado?:', isAuth, 'Token:', token); // Debug
    return isAuth;
};

export const isAdmin = () => {
    const user = getUser();
    const adminStatus = user && user.rol === 'Admin';
    console.log('¿Es Admin?:', adminStatus, 'Usuario:', user); // Debug
    return adminStatus;
};
