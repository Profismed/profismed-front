import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Banner from './components/Banner'; // Asegúrate de importar tu componente de banner superior
import LandingPage from './components/LandingPage';
import Products from './components/Products';
import Reports from './components/Reports';
import Login from './components/Login';

function App() {
  const location = useLocation();

  // Definir las rutas donde el banner debería aparecer
  const showBannerRoutes = ['/LandingPage', '/products', '/Reports'];

  return (
    <div className="app-container">
      {/* Mostrar el Banner si estamos en una de las rutas definidas */}
      {showBannerRoutes.includes(location.pathname) && <Banner />}
      
      {/* Mostrar el Sidebar si no estamos en la ruta '/' */}
      {location.pathname !== '/' && <Sidebar />}

      <div class="p-4 sm:ml-64">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/Reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
