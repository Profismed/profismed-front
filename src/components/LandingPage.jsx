import React, { useState, useEffect, act } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select } from "flowbite-react";
import Swal from "sweetalert2";

const Personas = () => {
  // Estado para almacenar las personas obtenidas de la API, inicializado como array vacío
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // Para el filtro de nombre
  const [selectedRole, setSelectedRole] = useState(""); // Para el filtro de rol

  const [newUsername, setNewUsername] = useState("");
  const [newFirstNmae, setNewFirstNmae] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newRoleId, setNewRoleId] = useState();
  const [newDocumentId, setNewDocumentId] = useState(1);
  const [newDocumentNumber, setNewDocumentNumber] = useState("");
  const [newUserJob, setNewUserJob] = useState("");
  const [newUserContactOrigin, setNewUserContactOrigin] = useState("");
  const [newLocationId, setNewLocationId] = useState();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [editUsername, setEditUsername] = useState("");
  const [editFirstName, setEditFirstNmae] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editRoleId, setEditRoleId] = useState();
  const [editDocumentId, setEditDocumentId] = useState();
  const [editDocumentNumber, setEditDocumentNumber] = useState("");
  const [editUserJob, setEditUserJob] = useState("");
  const [editUserContactOrigin, setEditUserContactOrigin] = useState("");
  const [editLocationId, setEditLocationId] = useState(1);
  const [actualId, setActualId] = useState();

     
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    userPhone: '',
    documentId: '',
    documentNumber: '',
    userEmail: '',
    password: '',
    confirmPassword: '',
    userJob: '',
    userContactOrigin: '',
    locationId: ''
  });

  const validateCreateUserFields = () => {
    let valid = true;
    let newErrors = {};

    // Verifica si los campos están vacíos
    if (!newFirstNmae) {
      newErrors.firstName = 'El campo Nombres es obligatorio.';
      valid = false;
    }
    if (!newLastName) {
      newErrors.lastName = 'El campo Apellidos es obligatorio.';
      valid = false;
    }
    if (!newUsername) {
      newErrors.username = 'El campo Nombre de Usuario es obligatorio.';
      valid = false;
    }
    if (!newUserPhone || !/^\d+$/.test(newUserPhone)) {
      newErrors.userPhone = 'El número de teléfono debe contener solo números.';
      valid = false;
    }
    if (!newDocumentId) {
      newErrors.documentId = 'El tipo de identificación es obligatorio.';
      valid = false;
    }
    if (!newDocumentNumber || !/^\d+$/.test(newDocumentNumber)) {
      newErrors.documentNumber = 'El número de documento debe contener solo números.';
      valid = false;
    }
    if (!newUserEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newUserEmail)) {
      newErrors.userEmail = 'El correo electrónico debe ser válido.';
      valid = false;
    }
    if (!newPassword) {
      newErrors.password = 'La contraseña es obligatoria.';
      valid = false;
    }
    if (newPassword !== newPasswordConfirmation) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      valid = false;
    }
    if (!newUserJob) {
      newErrors.userJob = 'El trabajo del usuario es obligatorio.';
      valid = false;
    }
    if (!newUserContactOrigin) {
      newErrors.userContactOrigin = 'El origen del contacto es obligatorio.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
 
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
        .then((response) => response.json())  // Parse the response as JSON
        .then((result) => {
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

          // Use result.message to display the message from the response
          Toast.fire({
            icon: "info",
            title: result.message,  // Display the message from the response object
          });

          console.log('Result ', result);  // Logs the entire result to the console
        })
        .catch((error) => { 
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
            icon: "warning",
            title: "Error en la creación del usuario",  // Customize the error message
          });
          console.error('Error', error)
        });
      closeModal();
    } catch (error) {
      console.error("An error occurred during user edit", error);
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
        credentials: "include",
      };

      fetch(
        `https://profismedsgi.onrender.com/api/users/delete/${id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("An error occurred during user delete", error);
    }
  };

  const handleEditUser = async (id) => {
    try {
      const data = {
        username: editUsername,
        firstName: editFirstName,
        lastName: editLastName,
        userEmail: editUserEmail,
        userPhone: editUserPhone,
        roleId: editRoleId,
        documentId: editDocumentId,
        documentNumber: editDocumentNumber,
        userJob: editUserJob,
        userContactOrigin: editUserContactOrigin,
        locationId: editLocationId,
      };

      const filteredData = Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => value !== undefined && value !== ""
        )
      );

      const raw = JSON.stringify(filteredData);
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
        `https://profismedsgi.onrender.com/api/users/update/${id}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
    } catch (error) {
      console.error("An error occurred during user edit", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalEdit = (id) => {
    setIsModalEditOpen(true);
    setActualId(id);
  };

  const closeModalEdit = () => {
    setIsModalEditOpen(false);
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar el cambio en el select del rol
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Filtrar personas en base a los criterios de búsqueda y rol seleccionado
  const filteredPersonas = personas.filter((persona) => {
    const matchesRole =
      selectedRole === "" || persona.roleId.toString() === selectedRole;
    const matchesName = persona.firstName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesRole && matchesName;
  });
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
          <select
            className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="">Rol</option>
            <option value="2">Vendedor</option>
            <option value="3">Cliente</option>
            <option value="4">Proveedor</option>
            <option value="5">Contacto</option>
          </select>
          <TextInput
            className="w-full sm:w-44 mb-2 sm:mb-0"
            placeholder="Buscar"
            icon={HiSearch}
            value={searchTerm}
            onChange={handleSearchChange}
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
              {filteredPersonas.length > 0 ? (
                filteredPersonas.map((persona, index) => (
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
                    <td className="px-6 py-4">
                      {{
                        2: "Vendedor",
                        3: "Cliente",
                        4: "Proveedor",
                        5: "Contacto",
                      }[persona.roleId] || "Desconocido"}
                    </td>
                    <td className="px-6 py-4">
                      {{
                        1: "Bogotá",
                        2: "Tunja",
                      }[persona.locationId] || "Desconocido"}
                    </td>
                    <td className="px-6 py-4 flex flex-row space-x-2 gap-2">
                      <button
                        onClick={() => {
                          openModalEdit(persona.userId);
                        }}
                        className="text-blue-500 text-xl"
                      >
                        ✏️
                      </button>
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
                              handleDeleteUser(persona.userId);
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
                  <td colSpan="6" className="text-center py-4 dark:text-white">
                    <div
                      role="status"
                      className="w- bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <span className="sr-only">Loading...</span>
                    </div>
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
      {/* Modal de crear usuario */}
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
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

            <TextInput
              label="Apellidos"
              placeholder="Apellidos"
              className="w-full"
              onBlur={(e) => setNewLastName(e.target.value)}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

            <TextInput
              label="nombre de usuario"
              placeholder="Username"
              className="w-full"
              onBlur={(e) => setNewUsername(e.target.value)}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

            <TextInput
              label="numero de telefono"
              placeholder="Numero de telefono"
              className="w-full"
              onBlur={(e) => setNewUserPhone(e.target.value)}
            />
            {errors.userPhone && <p className="text-red-500 text-sm">{errors.userPhone}</p>}

            <Select
              label="Tipo de identificación"
              placeholder="Seleccione una opción"
              className="w-full"
              onChange={(e) => setNewDocumentId(e.target.value)}
            >
              <option value="1">Cédula de ciudadanía</option>
              <option value="2">Tarjeta de identidad</option>
              <option value="3">Cédula de extranjería</option>
              <option value="4">Pasaporte</option>
            </Select>
            {errors.documentId && <p className="text-red-500 text-sm">{errors.documentId}</p>}

            <TextInput
              label="Número de documento"
              placeholder="Número de documento"
              className="w-full"
              onBlur={(e) => setNewDocumentNumber(e.target.value)}
            />
            {errors.documentNumber && <p className="text-red-500 text-sm">{errors.documentNumber}</p>}

            <div className="col-span-2">
              <TextInput
                label="Correo electrónico"
                placeholder="Correo electrónico"
                className="w-full"
                onBlur={(e) => setNewUserEmail(e.target.value)}
              />
              {errors.userEmail && <p className="text-red-500 text-sm">{errors.userEmail}</p>}
            </div>

            <TextInput
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              className="w-full"
              onBlur={(e) => setNewPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <TextInput
              label="Confirmar contraseña"
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full"
              onBlur={(e) => setNewPasswordConfirmation(e.target.value)}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

            <Select
              label="Rol"
              placeholder="Seleccione un rol"
              className="w-full"
              onChange={(e) => {
                setNewRoleId(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
              <option value="4">Proveedor</option>
              <option value="5">Contacto</option>
            </Select>

            <TextInput
              label="Trabajo del usuario"
              placeholder="Describa el trabajo del usuario"
              className="w-full"
              onBlur={(e) => setNewUserJob(e.target.value)}
            />
            {errors.userJob && <p className="text-red-500 text-sm">{errors.userJob}</p>}

            <TextInput
              label="Origen del contacto"
              placeholder="Origen del contacto"
              className="w-full"
              onBlur={(e) => setNewUserContactOrigin(e.target.value)}
            />
            {errors.userContactOrigin && <p className="text-red-500 text-sm">{errors.userContactOrigin}</p>}

            <Select
              label="ubicación"
              placeholder="Seleccione una ubicacion"
              className="w-full "
              onChange={(e) => {
                setNewLocationId(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="1">Bogota</option>
              <option value="2">Tunja</option>
            </Select>
            {errors.locationId && <p className="text-red-500 text-sm">{errors.locationId}</p>}
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
                if (validateCreateUserFields()) {
                  handleNewUser()
                } else {
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

                  // Use result.message to display the message from the response
                  Toast.fire({
                    icon: "warning",
                    title: "Faltan campos por llenar",  // Display the message from the response object
                  });
                }
              }}
              className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
            >
              Añadir
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {/* Modal de editar usuario */}

      <Modal show={isModalEditOpen} onClose={closeModalEdit}>
        <Modal.Header>Editar Persona </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombres"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.firstName
              }
              className="w-full"
              onBlur={(e) => setEditFirstNmae(e.target.value)}
            />
            <TextInput
              label="Apellidos"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.lastName
              }
              className="w-full"
              onBlur={(e) => setEditLastName(e.target.value)}
            />
            <TextInput
              label="username"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.username
              }
              className="w-full"
              onBlur={(e) => setEditUsername(e.target.value)}
            />
            <TextInput
              label="numero de telefono"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.userPhone
              }
              className="w-full"
              onBlur={(e) => setEditUserPhone(e.target.value)}
            />
            <TextInput
              label="tipo de trabajo"
              placeholder={
                personas.find((persona) => persona.userId === actualId)?.userJob
              }
              className="w-full"
              onBlur={(e) => setEditUserJob(e.target.value)}
            />
            <TextInput
              label="origen del contacto"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.userContactOrigin
              }
              className="w-full"
              onBlur={(e) => setEditUserContactOrigin(e.target.value)}
            />
            <Select
              label="Tipo de identificación"
              placeholder="Seleccione una opción"
              className="w-full"
              onChange={(e) => setEditDocumentId(e.target.selectedIndex)}
            >
              <option value="CC">Cédula de ciudadanía</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="PA">Pasaporte</option>
            </Select>
            <TextInput
              label="Número de documento"
              placeholder={
                personas.find((persona) => persona.userId === actualId)
                  ?.documentNumber
              }
              className="w-full"
              onBlur={(e) => setEditDocumentNumber(e.target.value)}
            />
            <div className="col-span-2">
              <TextInput
                label="Correo electrónico"
                placeholder={
                  personas.find((persona) => persona.userId === actualId)
                    ?.userEmail
                }
                className="w-full"
                onBlur={(e) => setEditUserEmail(e.target.value)}
              />
            </div>
            <Select
              label="Rol"
              value={
                editRoleId || // Si el estado `editRoleId` ha sido editado, lo usamos
                personas.find((persona) => persona.userId === actualId)
                  ?.roleId ||
                "" // Usamos el valor de roleId directamente
              }
              className="w-full"
              onChange={(e) => setEditRoleId(e.target.value)} // Actualizamos el estado con el valor de la opción seleccionada
            >
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
              <option value="4">Proveedor</option>
              <option value="5">Contacto</option>
            </Select>
            <Select
              label="location"
              placeholder={
                personas.find((persona) => persona.userId === actualId)?.roleId
              }
              className="w-full "
              value={
                editLocationId ||
                personas.find((persona) => persona.userId === actualId)
                  ?.locationId ||
                ""
              }
              onChange={(e) => setEditLocationId(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row justify-around space-x-10 mx-24">
            <Button
              className="bg-red-500 hover:bg-red-800 px-10"
              onClick={closeModalEdit}
            >
              <p className="text-lg">Cancelar</p>
            </Button>
            <button
              onClick={() => {
                handleEditUser(actualId);

                closeModalEdit();
              }}
              className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200 text-gray-50 font-bold leading-loose transition duration-200"
            >
              Editar
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Personas;
