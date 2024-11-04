import "./Banner.css";
import { useState, useEffect } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import React from 'react';
import Cookies from 'js-cookie';

const Banner = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      console.log('Token:', token); 
      if (!token) {
        console.error('No token found');
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        credentials: "include",
        redirect: "follow"
      };

      try {
        const response = await fetch("http://localhost:3000/api/auth/userData", requestOptions);
        if (response.ok) {
          const data = await response.json();
          console.log("User data:", data);
          setUserName(data.firstName);
          setUserEmail(data.userEmail);
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
              <span className="block truncate text-sm font-medium">{userEmail}</span>
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

export default Banner;
