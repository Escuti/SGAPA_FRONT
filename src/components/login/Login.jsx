import React, { useState } from 'react';
import './Login.css';
import sgapalogo from '../navbar/sgapalogo.svg';
import { loginUser } from "../../services/loginService";

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
      const data = await loginUser(username, password);

      // Guardar los datos en sessionStorage
      sessionStorage.setItem('userData', JSON.stringify({
        id_usuario: data.id_usuario,
        tipo_usuario: data.tipo_usuario,
        id_detalle: data.id_detalle
      }));

      // Redirigir según tipo de usuario
      const rutaBase = {
        administrador: "admin",
        docente: "professor",
        estudiante: "student",
        acudiente: "parent"
      }[data.tipo_usuario] || "login";

      window.location.href = `/${rutaBase}`; // Redirección forzada
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
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Ingresando..." : "Ingresar"}
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