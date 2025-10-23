// investigacionapp.client/src/services/authService.js

const API_URL = "https://localhost:7276/api/Auth";

export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        rol: data.rol
    }));

    return data;
};

export const register = async (username, email, password, rol = 'User') => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, rol })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrarse');
    }

    const data = await response.json();
    
    // Guardar token y datos del usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
        username: data.username,
        email: data.email,
        rol: data.rol
    }));

    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const isAdmin = () => {
    const user = getUser();
    return user && user.rol === 'Admin';
};
