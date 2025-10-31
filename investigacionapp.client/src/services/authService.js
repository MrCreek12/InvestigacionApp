// investigacionapp.client/src/services/authService.js

const API_URL = "https://localhost:7276/api/Auth";

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const contentType = response.headers.get('content-type');
        if (!response.ok) {
            if (contentType && contentType.includes('application/json')) {
                const error = await response.json();
                throw new Error(error.message || 'Error al iniciar sesión');
            } else {
                const errorText = await response.text();
                throw new Error(`Error del servidor: ${response.status} ${response.statusText} ${errorText}`);
            }
        }

        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            throw new Error('El servidor no devolvió una respuesta JSON válida: ' + responseText);
        }

        const data = await response.json();

        // Guardar token y datos del usuario en sessionStorage para que la sesión se cierre al cerrar el navegador
        if (data.token) {
            sessionStorage.setItem('token', data.token);
        }

        if (data.id || data.username || data.email || data.rol) {
            sessionStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                rol: data.rol
            }));
        }

        if (data.expiration) {
            try {
                const expDate = new Date(data.expiration);
                sessionStorage.setItem('token_expiration', expDate.toISOString());
            } catch (e) {
                console.warn('No se pudo parsear expiration en login:', data.expiration);
            }
        }

        return {
            id: data.id,
            token: data.token,
            username: data.username,
            email: data.email,
            rol: data.rol,
            expiration: data.expiration
        };
    } catch (error) {
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
                throw new Error(`Error del servidor: ${response.status} ${response.statusText} ${errorText}`);
            }
        }

        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            throw new Error('El servidor no devolvió una respuesta JSON válida: ' + responseText);
        }

        const data = await response.json();

        if (data.token) {
            sessionStorage.setItem('token', data.token);
        }

        if (data.id || data.username || data.email || data.rol) {
            sessionStorage.setItem('user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                rol: data.rol
            }));
        }

        if (data.expiration) {
            try {
                const expDate = new Date(data.expiration);
                sessionStorage.setItem('token_expiration', expDate.toISOString());
            } catch (e) {
                console.warn('No se pudo parsear expiration en register:', data.expiration);
            }
        }

        return {
            id: data.id,
            token: data.token,
            username: data.username,
            email: data.email,
            rol: data.rol,
            expiration: data.expiration
        };
    } catch (error) {
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            throw new Error('No se pudo conectar al servidor. Verifica que el servidor esté corriendo.');
        }
        throw error;
    }
};

export const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token_expiration');
};

export const getToken = () => {
    return sessionStorage.getItem('token');
};

export const getUser = () => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    const exp = sessionStorage.getItem('token_expiration');
    if (!exp) return true; // si no hay expiracion, confiar en el token

    try {
        const expDate = new Date(exp);
        const now = new Date();
        const isAuth = now < expDate;
        if (!isAuth) logout();
        return isAuth;
    } catch (e) {
        return !!token;
    }
};

export const isAdmin = () => {
    const user = getUser();
    return user && user.rol === 'Admin';
};
