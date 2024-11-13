// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de crear o adaptar los estilos si es necesario
import Swal from "sweetalert2";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("janedoe@example.com");
  const [password, setPassword] = useState("anotherSecurePassword456");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://profismedsgi.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Esto asegura que las cookies se envíen y reciban
        }
      );

      console.log("Respuesta del servidor:", response);

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Imprimir la cookie en la consola
        console.log("Cookies:", document.cookie);

        // Aquí puedes manejar la respuesta exitosa, por ejemplo, redirigir al usuario
        navigate("/LandingPage");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
        });
      } else {
        const error = await response.json();
        console.error("Login failed:", error);
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <img
            src="./logo.jpg"
            alt="Logo Empresa"
            className="w-60 mx-auto mb-4"
          />
          <div className="flex justify-around border-b pb-4 mb-4">
            <button
              className={`text-lg font-semibold ${
                activeTab === "login" ? "text-blue-600" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("login")}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {activeTab === "login" ? (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Contraseña
              </label>
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
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Iniciar Sesión
            </button>
          </form>
        ) : (
          <>
            <p className="text-5xl">UwU</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
