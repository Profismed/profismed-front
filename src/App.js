import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Banner from './components/Banner'; 
import LandingPage from './components/LandingPage';
import Products from './components/Products';
import Reports from './components/Reports';
import Login from './components/Login';
import Sales from './components/sales';

function App() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define the routes where the Banner should appear
  const showBannerRoutes = ['/landingpage', '/products', '/reports', '/ventas'];

  // Determine whether to show Sidebar and Banner
  const isLoginPage = location.pathname === '/';
  const showBanner = showBannerRoutes.includes(location.pathname.toLowerCase());
  
  return (
    <div className="bg-blue-100">
      {/* Conditional Banner */}
      {showBanner && <Banner />}

      {/* Conditional Sidebar */}
      {!isLoginPage && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileOpen={isMobileOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        />
      )}

      {/* Main Content */}
      <div className={!isLoginPage ? 'pt-10 px-4 sm:ml-64 bg-blue-100' : ''}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ventas" element={<Sales />} />
          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

// App Wrapper for Router Context
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
