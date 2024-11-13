import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiUser,
  HiShoppingBag,
  HiChartPie,
  HiArrowSmRight,
  HiMenu,
  HiCurrencyDollar
} from "react-icons/hi";
import Swal from "sweetalert2";

const Sidebar = ({ isSidebarOpen, isMobileOpen, toggleMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  const isActive = (path) => location.pathname === path;

  const handlerRolId = async () => {
    try {
      const response = await fetch('https://profismedsgi.onrender.com/api/auth/userData', {
        method: 'GET',
        headers: {
          'Content-Type': 'application'
        },
        credentials: 'include'
      });
      const data = await response.json();
      
      console.log('Rol del usuario:', data);
      setUserData(data);
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
    }
  };

  useEffect(() => {
    handlerRolId();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://profismedsgi.onrender.com/api/auth/logout",
        {
          method: "POST",
          redirect: "follow",
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Logged out successfully");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Sesión cerrada exitosamente"
        });
        
        navigate('/');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-gray-800 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:${isSidebarOpen ? "w-64" : "w-20"}`}
        aria-label="Sidebar"
      >
        <div
          className={`h-full ${
            isMobileOpen ? "px-3" : "flex flex-col px-10 justify-center"
          }   ${isMobileOpen ? "py-10" : "py-2"}  overflow-y-auto`}
        >
          <ul
            className={`${
              isSidebarOpen ? "lg:-mt- lg:space-y-12" : "space-y-2"
            }  ${
              isMobileOpen && toggleMobileSidebar ? "space-y-2" : "space-y-2"
            } font-medium`}
          >
            {userData && userData.roleId === 1 ? (
              <>
                <li>
                  <Link
                    to="/LandingPage"
                    className={`flex items-center p-2 hover:bg-gray-700 ${
                      isActive("/LandingPage")
                        ? "text-blue-500 border-r-4 border-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    <HiUser className="w-6 h-6" />
                    <span
                      className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                    >
                      Personas
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Ventas"
                    className={`flex items-center p-2 hover:bg-gray-700 ${
                      isActive("/Ventas")
                        ? "text-blue-500 border-r-4 border-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    <HiCurrencyDollar className="w-6 h-6" />
                    <span
                      className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                    >
                      Ventas
                    </span>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/Ventas"
                  className={`flex items-center p-2 hover:bg-gray-700 ${
                    isActive("/Ventas")
                      ? "text-blue-500 border-r-4 border-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  <HiCurrencyDollar className="w-6 h-6" />
                  <span
                    className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                  >
                    Ventas
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/products"
                className={`flex items-center p-2  hover:bg-gray-700 ${
                  isActive("/products")
                    ? "text-blue-500 border-r-4 border-blue-500"
                    : "text-gray-400"
                }`}
              >
                <HiShoppingBag className="w-6 h-6" />
                <span
                  className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                >
                  Productos
                </span>
              </Link>
            </li>
            {userData && userData.roleId === 1 && (
              <li>
                <Link
                  to="/Reports"
                  className={`flex items-center p-2 hover:bg-gray-700 ${
                    isActive("/Reports")
                      ? "text-blue-500 border-r-4 border-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  <HiChartPie className="w-6 h-6" />
                  <span
                    className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                  >
                    Reportes
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link
                onClick={handleLogout}
                className={`flex items-center p-2  hover:bg-gray-700 ${
                  isActive("/logout")
                    ? "text-blue-500 border-r-4 border-blue-500"
                    : "text-gray-400"
                }`}
              >
                <HiArrowSmRight className="w-6 h-6" />
                <span
                  className={`${!isSidebarOpen && "hidden"} sm:inline ml-3`}
                >
                  Cerrar sesión
                </span>
              </Link>
            </li>
            
          </ul>
        </div>
      </aside>

      {/* Botón de menú para dispositivos móviles */}
      <button
        id="menuButton"
        type="button"
        className="absolute top-4 left-4 z-50 text-white hover:text-white sm:hidden"
        onClick={toggleMobileSidebar}
      >
        <HiMenu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;