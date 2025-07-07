import React, { useState } from 'react';
import './Login.css';
import sgapalogo from '../navbar/sgapalogo.svg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:8000/userlog/login_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.message || `Error ${res.status}`);
      }

      localStorage.setItem('user_id', data.id_usuario);
      localStorage.setItem('tipo_usuario', data.tipo_usuario);
      localStorage.setItem('id_detalle', data.id_detalle);

      setMensaje(data.mensaje);

      switch (data.tipo_usuario) {
        case 'administrador':
          window.location.href = '/admin/dashboard';
          break;
        case 'docente':
          window.location.href = '/docente/panel';
          break;
        case 'estudiante':
          window.location.href = '/estudiante/inicio';
          break;
        case 'acudiente':
          window.location.href = '/acudiente/inicio';
          break;
        default:
          window.location.href = '/';
      }
    } catch (err) {
      setMensaje(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={sgapalogo} alt="logo sgapa" className="login-logo" />
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        {mensaje && <p className="login-message">{mensaje}</p>}
      </div>
      <div className="login-attribution">
        <a
          href="https://www.vecteezy.com/free-vector/school"
          target="_blank"
          rel="noopener noreferrer"
        >
          School Vectors by Vecteezy
        </a>
      </div>
    </div>
  );
};

export default Login;