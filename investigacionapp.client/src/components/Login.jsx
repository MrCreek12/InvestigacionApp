import { useState } from 'react';
import { login } from '../services/authService';

const Login = ({ onLoginSuccess, onShowRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(username, password);
            onLoginSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1 className="main-title">RECICLAME CR</h1>
            <div className="login-card">
                <h2>¡Bienvenido de Vuelta!</h2>
                <p className="subtitle">¡Nos Alegra verte de Nuevo!</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario o Email:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Ingresa su usuario o email"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <div className="password-wrapper">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Ingrese su contraseña"
                                disabled={loading}
                            />
                            <span className="password-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            </span>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>

                    <hr className="divider" />

                    <div className="auth-switch">
                        <span>¿No tiene una cuenta? </span>
                        <button
                            type="button"
                            className="link-btn"
                            onClick={onShowRegister}
                            disabled={loading}
                        >
                            Creela Aqui
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;