import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select } from "flowbite-react";
import Swal from "sweetalert2";

const Personas = () => {
  // Estado para almacenar las personas obtenidas de la API, inicializado como array vacío
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newUsername, setNewUsername] = useState("goce");
  const [newFirstNmae, setNewFirstNmae] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("+5775856785678");
  const [newRoleId, setNewRoleId] = useState(1);
  const [newDocumentId, setNewDocumentId] = useState(1);
  const [newDocumentNumber, setNewDocumentNumber] = useState("");
  const [newUserJob, setNewUserJob] = useState("camarografo");
  const [newUserContactOrigin, setNewUserContactOrigin] = useState("website");
  const [newLocationId, setNewLocationId] = useState(1);
  const [newPassword, setNewPassword] = useState("");

  // Función para hacer la petición fetch y obtener las personas
  useEffect(() => {
    const fetchPersonas = async () => {
      const requestOptions = {
        method: "GET",
        credentials: "include",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "https://profismedsgi.onrender.com/api/users/all",
          requestOptions
        );
        const data = await response.json();
        console.log("esta es la info de personas", data);

        // Verifica si data es un array, si no, asigna un array vacío
        if (Array.isArray(data)) {
          setPersonas(data);
        } else {
          console.error("La respuesta no es un array:", data);
          setPersonas([]);
        }
      } catch (error) {
        console.error("Error al obtener las personas:", error);
        setPersonas([]); // Asignar array vacío en caso de error
      }
    };
    fetchPersonas();
  }, []); // Se ejecuta al montar el componente

  const handleNewUser = async () => {
    console.log("Creando usuario");
    try {
      const raw = JSON.stringify({
        username: newUsername,
        firstName: newFirstNmae,
        lastName: newLastName,
        userEmail: newUserEmail,
        userPhone: newUserPhone,
        roleId: newRoleId,
        documentId: newDocumentId,
        documentNumber: newDocumentNumber,
        userJob: newUserJob,
        userContactOrigin: newUserContactOrigin,
        locationId: newLocationId,
        password: newPassword,
      });
      console.log("esto es raw", raw);
      const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch(
        "https://profismedsgi.onrender.com/api/users/register",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
      
    } catch (error) {
      console.error("An error occurred during user edit", error);
    }
  };

  const handleClick = () => {
    setIsSaved(!isSaved); // Alternar el estado de "guardado"
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full min-h-screen px-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Personas
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Listado de personas registradas en la plataforma
        </p>

        <div className="flex flex-col sm:flex-row justify-end space-x-8 items-center mb-4">
          <select className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            <option selected>Categoria</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
          <TextInput
            className="w-full sm:w-44 mb-2 sm:mb-0"
            placeholder="Buscar"
            icon={HiSearch}
          />
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Correo
                </th>
                <th scope="col" className="px-6 py-3">
                  Teléfono
                </th>
                <th scope="col" className="px-6 py-3">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3">
                  Zona
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {personas.length > 0 ? (
                personas.map((persona, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {persona.firstName}
                    </th>
                    <td className="px-6 py-4">{persona.userEmail}</td>
                    <td className="px-6 py-4">{persona.userPhone}</td>
                    <td className="px-6 py-4">{persona.roleId}</td>
                    <td className="px-6 py-4">{persona.locationId}</td>
                    <td className="px-6 py-4 flex flex-row space-x-2 gap-2">
                      <button className="text-blue-500 text-xl">✏️</button>
                      <button
                        className="text-red-500 text-xl"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Estás seguro?",
                            text: "¡No podrás revertir esto!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "Cancelar",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              // Acción de eliminación
                              Swal.fire(
                                "¡Eliminado!",
                                "El registro ha sido eliminado.",
                                "success"
                              );
                            }
                          });
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No hay personas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end px-10">
          <button
            type="button"
            onClick={openModal}
            className="text-white bg-lime-500 hover:bg-lime-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mb-2 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800"
          >
            Añadir persona
          </button>
        </div>
      </div>
      {/* Modal de Flowbite */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Añadir Persona</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombres"
              placeholder="Nombres"
              className="w-full"
              onBlur={(e) => setNewFirstNmae(e.target.value)}
            />
            <TextInput
              label="Apellidos"
              placeholder="Apellidos"
              className="w-full"
              onBlur={(e) => setNewLastName(e.target.value)}
            />
            <Select
              label="Tipo de identificación"
              placeholder="Seleccione una opción"
              className="w-full"
              onChange={(e) => setNewDocumentId(e.target.selectedIndex)}
            >
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="PA">Pasaporte</option>
            </Select>
            <TextInput
              label="Número de documento"
              placeholder="Número de documento"
              className="w-full"
              onBlur={(e) => setNewDocumentNumber(e.target.value)}
            />
            <div className="col-span-2">
              <TextInput
                label="Correo electrónico"
                placeholder="Correo electrónico"
                className="w-full"
                onBlur={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <TextInput
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              className="w-full"
            />
            <TextInput
              label="Confirmar contraseña"
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full"
              onBlur={(e) => setNewPassword(e.target.value)}
            />
            <Select
              label="Rol"
              placeholder="Seleccione un rol"
              className="w-full col-span-2"
              onChange={(e) => setNewRoleId(e.target.selectedIndex)}
            >
              <option value="vendedor">Vendedor</option>
              <option value="cliente">Cliente</option>
              <option value="proveedor">Proveedor</option>
              <option value="contacto">Contacto</option>
            </Select>
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
            <button
              onClick={() => {
                handleNewUser();
                closeModal();
              }}
              className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
            >
              Añadir
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Personas;
