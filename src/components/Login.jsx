import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import "./Banner.css";

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
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  // Esto permite recibir la cookie
      });

      // Mostrar el contenido completo de la respuesta
      console.log('Response:', response);

      if (response.ok) {
        console.log("Inicio de sesión exitoso", response);

        // Mostrar cookies
        document.cookie.split(";").forEach(cookie => console.log(cookie , 'holaaaaaa'));

        // Navegar a la página de destino
        navigate('/LandingPage');
      } else {
        console.log(response);
        
        setErrorMessage('Correo electrónico o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.message);
      setErrorMessage('Correo electrónico o contraseña incorrectos.');
      
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img src="./logo.jpg" alt="Logo Empresa" className="w-60 mx-auto mb-4" />
          <div className="flex justify-around border-b pb-4 mb-4">
            <button
              className={`text-lg font-semibold ${activeTab === 'login' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`text-lg font-semibold ${activeTab === 'register' ? 'text-blue-600' : 'text-gray-500'}`}
              onClick={() => handleTabChange('register')}
            >
              Registrarse
            </button>
          </div>
        </div>

        {activeTab === 'login' ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="username" className="block text-gray-700">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Iniciar Sesión</button>
          </form>
        ) : (
          <form className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700">Nombres</label>
              <input type="text" id="firstName" placeholder="Nombres" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700">Apellidos</label>
              <input type="text" id="lastName" placeholder="Apellidos" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="documentType" className="block text-gray-700">Tipo de documento</label>
              <select id="documentType" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
              </select>
            </div>
            <div>
              <label htmlFor="documentNumber" className="block text-gray-700">Número de documento</label>
              <input type="text" id="documentNumber" placeholder="Número de documento" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">Correo electrónico</label>
              <input type="email" id="email" placeholder="Correo electrónico" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700">Teléfono</label>
              <input type="tel" id="phone" placeholder="Teléfono" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">Contraseña</label>
              <input type="password" id="password" placeholder="Contraseña" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirma contraseña</label>
              <input type="password" id="confirmPassword" placeholder="Confirma contraseña" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">Registrarme</button>
          </form>
        )}

        <div className="flex items-center justify-center mt-6 space-x-4">
          <button className="w-1/3 py-2 bg-white border rounded-md shadow-sm text-gray-700 hover:bg-gray-100">Google</button>
          <button className="w-1/3 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">Facebook</button>
          <button className="w-1/3 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-900">Apple</button>
        </div>
      </div>
    </div>
  );
};

const Banner = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      try {
        const response = await fetch("http://localhost:3000/api/auth/userData", requestOptions);
        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUserName(data.name);
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        console.log("Logout successful");
        localStorage.removeItem('userData');
        Cookies.remove('token');
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <Navbar fluid rounded className="bg-[#1890ff]">
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">ProfiSMED</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{userName}</span>
              <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item>Cuenta</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          {/* Add any additional Navbar items here */}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Login;
export { Banner };
