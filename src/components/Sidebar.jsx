import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

const SidebarComponent = () => {
  return (
    <Sidebar aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item as={Link} to="/LandingPage" icon={HiUser}>
            Personas
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/products" icon={HiShoppingBag}>
            Productos
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/Reports" icon={HiChartPie}>
            Reportes
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/logout" icon={HiArrowSmRight}>
            Cerrar sesión
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;