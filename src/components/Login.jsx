import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('janedoe');
  const [password, setPassword] = useState('anotherSecurePassword456');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      // Suponiendo que la respuesta contiene un token y cookies de sesión
      const { token, sessionCookie } = response.data;

      // Guardar el token en cookies
      Cookies.set('token', token);
      Cookies.set('session', sessionCookie);

      console.log('Inicio de sesión exitoso:', response.data);
      navigate('/LandingPage');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response ? error.response.data : error.message);
      setErrorMessage('Correo electrónico o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <img src="./logo.jpg" alt="Logo Empresa" className="logo-image" />
        </div>

        <div className="tabs">
          <button
            className={activeTab === 'login' ? 'active-tab' : ''}
            onClick={() => handleTabChange('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={activeTab === 'register' ? 'active-tab' : ''}
            onClick={() => handleTabChange('register')}
          >
            Registrarse
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>
        ) : (
          <form className="register-form">
            <div className="form-group">
              <label htmlFor="firstName">Nombres</label>
              <input type="text" id="firstName" placeholder="Nombres" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellidos</label>
              <input type="text" id="lastName" placeholder="Apellidos" required />
            </div>
            <div className="form-group">
              <label htmlFor="documentType">Tipo de documento</label>
              <select id="documentType" required>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="documentNumber">Número de documento</label>
              <input type="text" id="documentNumber" placeholder="Número de documento" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" placeholder="Correo electrónico" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input type="tel" id="phone" placeholder="Teléfono" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" id="password" placeholder="Contraseña" required />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirma contraseña</label>
              <input type="password" id="confirmPassword" placeholder="Confirma contraseña" required />
            </div>
            <button type="submit" className="register-button">Registrarme</button>
          </form>
        )}

        <div className="social-buttons">
          <button className="google">Google</button>
          <button className="facebook">Facebook</button>
          <button className="apple">Apple</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
