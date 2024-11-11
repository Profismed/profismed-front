import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiUser,
  HiShoppingBag,
  HiChartPie,
  HiArrowSmRight,
  HiMenu,
} from "react-icons/hi";
import Cookies from 'js-cookie';

const Sidebar = ({ isSidebarOpen, isMobileOpen, toggleMobileSidebar }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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