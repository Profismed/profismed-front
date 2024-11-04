import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

const SidebarComponent = () => {
  return (
    
    <Sidebar  className='bg-[#31e750] '>
      <Sidebar.Items className='bg-[#eb5834] '>
        <Sidebar.ItemGroup className='bg-[#811f64] '>
          <Sidebar.Item className=' text-slate-200 bg-[#25282c]' as={Link} to="/LandingPage" icon={HiUser}>
            Personas
          </Sidebar.Item>
          <Sidebar.Item className=' text-slate-200' as={Link} to="/products" icon={HiShoppingBag}>
            Productos
          </Sidebar.Item>
          <Sidebar.Item className=' text-slate-200' as={Link} to="/Reports" icon={HiChartPie}>
            Reportes
          </Sidebar.Item>
          <Sidebar.Item className=' text-slate-200' as={Link} to="/logout" icon={HiArrowSmRight}>
            Cerrar sesión
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default SidebarComponent;