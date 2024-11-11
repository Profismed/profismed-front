import "./Banner.css";
import { useState, useEffect } from "react";
import { Navbar, Dropdown, Avatar, Modal, Button } from "flowbite-react";
import React from "react";

const Banner = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const requestOptions = {
        method: "GET",
        credentials: "include",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://profismedsgi.onrender.com/api/auth/userData",
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setUserName(data.firstName);
          setUserEmail(data.userEmail);
          setUserId(data.userId);
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
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
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    }
  };
  console.log(newEmail, "nuevo email");

  const handleEditUser = async () => {
    console.log("Editando usuario");

    try {
      const raw = JSON.stringify({
        username: newName,
        userEmail: newEmail,
      });

      const requestOptions = {
        method: "PUT",
        body: raw,
        redirect: "follow",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `https://profismedsgi.onrender.com/api/users/update/${userId}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log(
        "User updated successfully:",
        result,
        response,
        requestOptions,
        raw
      );
      setUserEmail(newEmail);
      setUserName(newName);
    } catch (error) {
      console.error("An error occurred during user edit", error);
    }
  };

  function getPassword() {
    return "**********";
  }

  function supportEditInput(edit) {
    const element = document.querySelector(edit);
    if (element) {
      element.disabled = false;
      element.style.border = "2px solid #1890ff";
    }
  }

  console.log("Nombre: ", userName, " Email: ", userEmail, " Id: ", userId);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(userName, userEmail);

  return (
    <>
      <Navbar fluid rounded className="bg-[#1890ff]">
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white pl-64">
            ProfiSMED
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{userName}</span>
              <span className="block truncate text-sm font-medium">
                {userEmail}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={openModal}>Cuenta</Dropdown.Item>{" "}
            {/* Botón para abrir el modal */}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse></Navbar.Collapse>
      </Navbar>

      {/* Modal de Flowbite */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Cuenta</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-row justify-between mx-20">
              <p className="align-middle -translate-y-1 leading-relaxed dark:text-gray-400">
                User name:
              </p>
              <input
                id="userName"
                onBlur={(e) => setNewName(e.target.value)}
                className="px-4 py-1 -translate-y-2 -translate-x-1 border-2 rounded-lg"
                placeholder={userName}
                disabled
              ></input>
              <button className="flex -translate-y-1">
                <p
                  className="text-xl"
                  onClick={() => supportEditInput("#userName")}
                >
                  ✏️
                </p>
              </button>
            </div>
            <div className="flex flex-row justify-between mx-20">
              <p className="text-base leading-relaxed dark:text-gray-400">
                Correo:
              </p>
              <input
                onBlur={(e) => setNewEmail(e.target.value)}
                id="userEmail"
                className="px-4 py-1 -translate-y-2 border-2 rounded-lg"
                placeholder={userEmail}
                disabled
              ></input>

              <button className="flex -translate-y-1 -translate-x-1">
                <p
                  className="text-xl"
                  onClick={() => supportEditInput("#userEmail")}
                >
                  ✏️
                </p>
              </button>
            </div>
            <div className="flex flex-row justify-between mx-20">
              <p className="text-base leading-relaxed dark:text-gray-400">
                Contraseña:
              </p>
              <input
                id="userPassword"
                type="password"
                className="px-4 py-1 -translate-y-2 -translate-x-4 border-2 rounded-lg"
                placeholder={getPassword()}
                disabled
              ></input>
              <button className="flex -translate-y-1 -translate-x-1">
                <p
                  className="text-xl"
                  onClick={() => supportEditInput("#userPassword")}
                >
                  ✏️
                </p>
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row justify-around space-x-10 mx-24">
            <Button
              className="bg-red-500 hover:bg-red-800 px-10"
              onClick={closeModal}
            >
              <p className="text-lg">Cancelar</p>
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-800 px-10"
              onClick={() => {
                handleEditUser();
                closeModal();
              }}
            >
              <p className="text-lg">Modificar</p>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Banner;
