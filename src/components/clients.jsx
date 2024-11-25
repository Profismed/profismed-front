import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select } from "flowbite-react";
import Swal from "sweetalert2";

const Clients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [contacto, setContacto] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actualId, setActualId] = useState(null);
  
  // Form states and validation remain the same
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactJob: "",
    relationship: "",
  });
  
  const [editFormData, setEditFormData] = useState({
    username: "",
    firstName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactJob: "",
    relationship: "",
  });
  
  const [errors, setErrors] = useState({});

  // Validation rules
  const validationRules = {
    firstName: {
      required: true,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
      message:
        "El nombre debe contener solo letras y tener entre 2 y 50 caracteres",
    },

    username: {
      required: true,
      pattern: /^[a-zA-Z0-9ñ_]{4,20}$/,
      message:
        "El nombre de usuario debe tener entre 4 y 20 caracteres alfanuméricos",
    },
    contactPhone: {
      required: true,
      pattern: /^\d{10}$/,
      message: "El teléfono debe contener 10 dígitos numéricos",
    },

    contactEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Ingrese un correo electrónico válido",
    },

    contactJob: {
      required: true,
      message: "El trabajo del usuario es requerido",
    },
    relationship: {
      required: true,
      message: "El origen del contacto es requerido",
    },
  };

  // Fetch contact information for a specific user
  const fetchContact = async (id) => {
    try {
      const response = await fetch(
        `https://profismed-sgi-api.onrender.com/api/contacts/user/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setContacto(prev => ({ ...prev, [id]: data[0] }));
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    const rules = validationRules[name];

    if (!rules === "") return "";

    if (rules.required && !value) {
      return `El campo ${name} es requerido`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    return "";
  };

  // Validate all fields
  const validateForm = (data, isEditMode = false) => {
    const newErrors = {};

    Object.keys(validationRules).forEach((field) => {
      // Skip password validation in edit mode
      // if (
      //   isEditMode &&
      //   (field === "password" || field === "passwordConfirmation")
      // ) {
      //   return;
      // }

      const error = validateField(field, data[field]);
      if (error) {
        // console.log(error, "💀");
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    // console.log(newErrors, "🚀");

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const dataSet = isEdit ? editFormData : formData;
    const setDataFunction = isEdit ? setEditFormData : setFormData;

    setDataFunction({
      ...dataSet,
      [name]: value,
    });

    // Clear specific field error when user starts typing
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  // Handle form submission for new user
  const handleNewUser = async () => {
    if (!validateForm(formData)) {
      console.log(formData, "❤️");
      console.log(errors, "💔");
      showToast("warning", "Por favor, corrija los errores en el formulario");
      return;
    }

    setIsLoading(true);

    // Remove empty fields from form data
    try {
      console.log(formData);
      const response = await fetch(
        "https://profismed-sgi-api.onrender.com/api/users/register-contact/",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear usuario");
      }

      showToast("success", "Usuario creado exitosamente");
      closeModal();
      // Refresh users list
      fetchPersonas();
      refreshCache();
    } catch (error) {
      showToast("error", error.message);
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for edit user
  const handleEditUser = async (id) => {
    // Remove any pre-existing errors before validation
    setErrors({});

    // Create a copy of editFormData with only non-empty values
    const filteredData = Object.fromEntries(
      Object.entries(editFormData).filter(([_, value]) => value !== "")
    );

    // Validate only the changed fields
    if (!validateForm(filteredData, true)) {
      // If there are validation errors, show toast and stop
      if (Object.keys(errors).length > 0) {
        showToast("warning", "Por favor, corrija los errores en el formulario");
        return;
      }
    }

    // Send the request to update the user
    try {
      const response = await fetch(
        `https://profismed-sgi-api.onrender.com/api/users/update/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(filteredData),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar usuario");
      }

      showToast("success", "Usuario actualizado exitosamente");
      closeModalEdit();
      fetchPersonas();
      refreshCache();
    } catch (error) {
      showToast("error", error.message);
      console.error("Error updating user:", error);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
        credentials: "include",
      };

      fetch(
        `https://profismed-sgi-api.onrender.com/api/users/delete/${id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("An error occurred during user delete", error);
    }
  };

  // Toast utility function
  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  // Fetch all users
  const fetchPersonas = async () => {
     setIsLoading(true);
    try {
      const response = await fetch("https://profismed-sgi-api.onrender.com/api/users/all", {
        credentials: "include",
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setPersonas(data);
        // Cache the data in localStorage
        localStorage.setItem("clientsCache", JSON.stringify(data));
      } else {
        console.error("Invalid response format:", data);
        setPersonas([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setPersonas([]);
    } finally {
      setIsLoading(false);
    }  
  };

  useEffect(() => {
    const cachedPersonas = localStorage.getItem("clientsCache");
    if (cachedPersonas) {
      setPersonas(JSON.parse(cachedPersonas));
    } else {
      fetchPersonas();
    }
  }, []);

  const refreshCache = () => {
    fetchPersonas();
  }

  // Modal handlers
  const openModal = () => {
    setFormData({
      username: "",
      firstName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactJob: "",
      relationship: "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  // Open edit modal
  const openModalEdit = (id) => {
    const user = personas.find((p) => p.userId === id);
    if (user) {
      setEditFormData({
        username: user.username || "",
        firstName: user.firstName || "",
        contactName: user.contactName || "",
        contactEmail: user.contactEmail || "",
        contactPhone: user.contactPhone || "",
        contactJob: user.contactJob || "",
        relationship: user.relationship || "",
      });
    }
    setActualId(id);
    setErrors({});
    setIsModalEditOpen(true);
  };

  // Close edit modal
  const closeModalEdit = () => {
    setIsModalEditOpen(false);
    setErrors({});
  };

  const currentUser = personas.find((persona) => persona.userId === actualId);

  // Table row component to prevent unnecessary re-renders
  const TableRow = React.memo(({ persona, contactInfo, onEdit, onDelete }) => (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {persona.firstName}
      </th>
      <td className="px-6 py-4">{contactInfo?.contactEmail || "N/A"}</td>
      <td className="px-6 py-4">{contactInfo?.contactPhone || "N/A"}</td>
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
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(persona.userId)}
            className="text-blue-500 hover:text-blue-700"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(persona.userId)}
            className="text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
          {persona.roleId === 3 && (
            <button
              onClick={() => {
                Swal.fire({
                  title: persona.firstName,
                  html: `
                    Informacion de contacto cliente:<br>
                    ${persona.firstName}
                    <br/>
                    <br/>
                    <h1>Contacto del cliente</h1>
                    ${contactInfo?.contactName || "N/A"}<br/>
                    ${contactInfo?.contactPhone || "N/A"}<br/>
                    ${contactInfo?.contactEmail || "N/A"}<br/>
                    Descripción del trabajo: ${contactInfo?.contactJob || "N/A"}<br/>
                    Relación del contacto: ${contactInfo?.relationship || "N/A"}
                  `,
                  confirmButtonText: "Entendido",
                  showCloseButton: true,
                });
              }}
            >
              ℹ️
            </button>
          )}
        </div>
      </td>
    </tr>
  ));
  
  // Filter users for the table
  const filteredPersonas = personas.filter(
    (persona) =>
      (!searchTerm ||
        persona.firstName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      persona.roleId === 3
  );

  return (
    <>
      <div className="w-full min-h-screen px-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Clientes
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Listado de clientes registradas en la plataforma
        </p>

        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto">
            {/* <select
              className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
              <option value="4">Proveedor</option>
              <option value="5">Contacto</option>
            </select> */}
            <TextInput
              className="w-full sm:w-44"
              placeholder="Buscar"
              icon={HiSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={openModal}
            className="text-white bg-lime-500 hover:bg-lime-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800"
          >
            Añadir cliente
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
              filteredPersonas.map((persona) => (
                <TableRow
                  key={persona.userId}
                  persona={persona}
                  contactInfo={contacto[persona.userId]}
                  onEdit={openModalEdit}
                  onDelete={(id) => {
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
                        handleDeleteUser(id);
                      }
                    });
                  }}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </td>
              </tr>
            )} 
            </tbody>
          </table>
        </div>

        {/* Create User Modal */}
        <Modal show={isModalOpen} onClose={closeModal}>
          <Modal.Header>Añadir cliente</Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div>
                <Select
                  name="roleId"
                  label="Rol"
                  value={formData.roleId}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Cliente</option>
                  <option value="4">Proveedor</option>
                  <option value="5">Contacto</option>
                </Select>
              </div> */}

              {/* Sección de Contacto */}

              <div className="col-span-2 border p-4 rounded bg-gray-50  grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    name="firstName"
                    label="Nombres del cliente"
                    placeholder="Nombre del cliente"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="username"
                    label="Nombre de usuario"
                    placeholder="Username"
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                <p className="col-span-2"> Informacion del contacto</p>

                {/* {console.log(formData)} */}
                <div>
                  <TextInput
                    name="contactName"
                    label="NameContact"
                    placeholder="nombre del contacto"
                    value={formData.contactName || ""}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                </div>

                <div>
                  <TextInput
                    name="contactPhone"
                    label="Teléfono"
                    placeholder="Número de teléfono"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <TextInput
                    name="contactEmail"
                    label="Correo electrónico"
                    placeholder="Correo electrónico"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="contactJob"
                    label="Trabajo"
                    placeholder="Trabajo del contacto"
                    value={formData.contactJob}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactJob && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactJob}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="relationship"
                    label="Origen del contacto"
                    placeholder="Relacion del trabajo"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.relationship && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                {/* <div>
                    <Select
                      name="locationId"
                      label="Ubicación"
                      value={formData.locationId}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full"
                    >
                      <option value="1">Bogotá</option>
                      <option value="2">Tunja</option>
                    </Select>
                  </div> */}

                {/* <button className="bg-blue-400 hover:bg-blue-300 rounded-md">
                    Confirmar información
                  </button> */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-500 hover:bg-red-800"
                onClick={closeModal}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className={`inline-block py-2 px-6 rounded-l-xl rounded-t-xl ${
                  isLoading
                    ? "bg-[#9f7fff] cursor-not-allowed"
                    : "bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200"
                } text-gray-50 font-bold leading-loose transition duration-200`}
                onClick={handleNewUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  "Añadir"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>

        {/* Edit User Modal */}
        <Modal show={isModalEditOpen} onClose={closeModalEdit}>
          <Modal.Header>Editar Cliente</Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div>
                <Select
                  name="roleId"
                  label="Rol"
                  value={formData.roleId}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                >
                  <option value="">Seleccione un rol</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Cliente</option>
                  <option value="4">Proveedor</option>
                  <option value="5">Contacto</option>
                </Select>
              </div> */}

              {/* Sección de Contacto */}

              <div className="col-span-2 border p-4 rounded bg-gray-50  grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextInput
                    name="firstName"
                    label="Nombres"
                    placeholder="Nombre del cliente"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="username"
                    label="Nombre de usuario"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                <p className="col-span-2"> Informacion del contacto</p>

                <div>
                  <TextInput
                    name="firstNameContact"
                    label="Nombres"
                    placeholder="Nombre del contacto"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="contactPhone"
                    label="Teléfono"
                    placeholder="Número de teléfono"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <TextInput
                    name="contactEmail"
                    label="Correo electrónico"
                    placeholder="Correo electrónico"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="contactJob"
                    label="Trabajo"
                    placeholder="Trabajo del contacto"
                    value={formData.contactJob}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.contactJob && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.contactJob}
                    </p>
                  )}
                </div>

                <div>
                  <TextInput
                    name="relationship"
                    label="Origen del contacto"
                    placeholder="Relacion del trabajo"
                    value={formData.relationship}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full"
                  />
                  {errors.relationship && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                {/* <div>
                    <Select
                      name="locationId"
                      label="Ubicación"
                      value={formData.locationId}
                      onChange={(e) => handleInputChange(e)}
                      className="w-full"
                    >
                      <option value="1">Bogotá</option>
                      <option value="2">Tunja</option>
                    </Select>
                  </div> */}

                {/* <button className="bg-blue-400 hover:bg-blue-300 rounded-md">
                    Confirmar información
                  </button> */}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-500 hover:bg-red-800"
                onClick={closeModalEdit}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className={`inline-block py-2 px-6 rounded-l-xl rounded-t-xl ${
                  isLoading
                    ? "bg-[#9f7fff] cursor-not-allowed"
                    : "bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200"
                } text-gray-50 font-bold leading-loose transition duration-200`}
                onClick={() => {
                  handleEditUser(actualId);
                  closeModalEdit();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </div>
                ) : (
                  "Editar"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Clients;
