import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select } from "flowbite-react";
import Swal from "sweetalert2";

const Personas = () => {
  // Spinner
  const [isLoading, setIsLoading] = useState(false);
  // State definitions remain the same...
  const [personas, setPersonas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  // Form states for new user
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    userEmail: "",
    userPhone: "",
    roleId: "",
    documentId: "1",
    documentNumber: "",
    userJob: "",
    userContactOrigin: "",
    locationId: "1",
    password: "",
    passwordConfirmation: ""
  });

  // Form states for edit user
  const [editFormData, setEditFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    userEmail: "",
    userPhone: "",
    roleId: "",
    documentId: "",
    documentNumber: "",
    userJob: "",
    userContactOrigin: "",
    locationId: ""
  });

  const [actualId, setActualId] = useState(null);
  
  // Unified errors state
  const [errors, setErrors] = useState({});

  // Validation rules
  const validationRules = {
    firstName: {
      required: true,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
      message: "El nombre debe contener solo letras y tener entre 2 y 50 caracteres"
    },
    lastName: {
      required: true,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
      message: "Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres"
    },
    username: {
      required: true,
      pattern: /^[a-zA-Z0-9_]{4,20}$/,
      message: "El nombre de usuario debe tener entre 4 y 20 caracteres alfanuméricos"
    },
    userPhone: {
      required: true,
      pattern: /^\d{10}$/,
      message: "El teléfono debe contener 10 dígitos numéricos"
    },
    documentNumber: {
      required: true,
      pattern: /^\d{6,12}$/,
      message: "El número de documento debe tener entre 6 y 12 dígitos"
    },
    userEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Ingrese un correo electrónico válido"
    },
    password: {
      required: true,
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "La contraseña debe tener al menos 8 caracteres, una letra y un número"
    },
    userJob: {
      required: true,
      message: "El trabajo del usuario es requerido"
    },
    userContactOrigin: {
      required: true,
      message: "El origen del contacto es requerido"
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (rules.required && !value) {
      return `El campo ${name} es requerido`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (name === 'passwordConfirmation' && value !== formData.password) {
      return "Las contraseñas no coinciden";
    }

    return "";
  };

  // Validate all fields
  const validateForm = (data, isEditMode = false) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      // Skip password validation in edit mode
      if (isEditMode && (field === 'password' || field === 'passwordConfirmation')) {
        return;
      }
      
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const dataSet = isEdit ? editFormData : formData;
    const setDataFunction = isEdit ? setEditFormData : setFormData;

    setDataFunction({
      ...dataSet,
      [name]: value
    });

    // Clear error when user starts typing
    setErrors({
      ...errors,
      [name]: ""
    });
  };

  // Handle form submission for new user
  const handleNewUser = async () => {
    if (!validateForm(formData)) {
      showToast("warning", "Por favor, corrija los errores en el formulario");
      return;
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        "https://profismedsgi.onrender.com/api/users/register",
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
    } catch (error) {
      showToast("error", error.message);
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false)
    }
  };

  // Handle form submission for edit user
  const handleEditUser = async (id) => {
    if (!validateForm(editFormData, true)) {
      showToast("warning", "Por favor, corrija los errores en el formulario");
      return;
    }

    try {
      // Filter out empty values
      const filteredData = Object.fromEntries(
        Object.entries(editFormData).filter(([_, value]) => value !== "")
      );

      const response = await fetch(
        `https://profismedsgi.onrender.com/api/users/update/${id}`,
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
      // Refresh users list
      fetchPersonas();
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

  // Fetch users data
  const fetchPersonas = async () => {
    try {
      const response = await fetch(
        "https://profismedsgi.onrender.com/api/users/all",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPersonas(data);
      } else {
        console.error("Invalid response format:", data);
        setPersonas([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setPersonas([]);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  // Modal handlers
  const openModal = () => {
    setFormData({
      username: "",
      firstName: "",
      lastName: "",
      userEmail: "",
      userPhone: "",
      roleId: "",
      documentId: "1",
      documentNumber: "",
      userJob: "",
      userContactOrigin: "",
      locationId: "1",
      password: "",
      passwordConfirmation: ""
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const openModalEdit = (id) => {
    const user = personas.find(p => p.userId === id);
    if (user) {
      setEditFormData({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        userEmail: user.userEmail || "",
        userPhone: user.userPhone || "",
        roleId: user.roleId?.toString() || "",
        documentId: user.documentId?.toString() || "",
        documentNumber: user.documentNumber || "",
        userJob: user.userJob || "",
        userContactOrigin: user.userContactOrigin || "",
        locationId: user.locationId?.toString() || ""
      });
    }
    setActualId(id);
    setErrors({});
    setIsModalEditOpen(true);
  };

  const closeModalEdit = () => {
    setIsModalEditOpen(false);
    setErrors({});
  };  

  const currentUser = personas.find((persona) => personas.userId === actualId);

  return (
    <>
      <div className="w-full min-h-screen px-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Personas
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Listado de personas registradas en la plataforma
        </p>

        <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 w-full sm:w-auto">
            <select
              className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="2">Vendedor</option>
              <option value="3">Cliente</option>
              <option value="4">Proveedor</option>
              <option value="5">Contacto</option>
            </select>
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
            Añadir persona
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Correo</th>
                <th scope="col" className="px-6 py-3">Teléfono</th>
                <th scope="col" className="px-6 py-3">Rol</th>
                <th scope="col" className="px-6 py-3">Zona</th>
                <th scope="col" className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personas.length > 0 ? (
                personas
                  .filter(persona => 
                    (!selectedRole || persona.roleId.toString() === selectedRole) &&
                    (!searchTerm || 
                      persona.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      persona.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      persona.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )
                  .map((persona) => (
                    <tr key={persona.userId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {`${persona.firstName} ${persona.lastName}`}
                      </th>
                      <td className="px-6 py-4">{persona.userEmail}</td>
                      <td className="px-6 py-4">{persona.userPhone}</td>
                      <td className="px-6 py-4">
                        {{
                          2: "Vendedor",
                          3: "Cliente",
                          4: "Proveedor",
                          5: "Contacto"
                        }[persona.roleId] || "Desconocido"}
                      </td>
                      <td className="px-6 py-4">
                        {{
                          1: "Bogotá",
                          2: "Tunja"
                        }[persona.locationId] || "Desconocido"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModalEdit(persona.userId)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "¿Estás seguro?",
                                text: "¡No podrás revertir esto!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Sí, eliminar",
                                cancelButtonText: "Cancelar"
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDeleteUser(persona.userId);
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
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
          <Modal.Header>Añadir Persona</Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextInput
                  name="firstName"
                  label="Nombres"
                  placeholder="Nombres"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="lastName"
                  label="Apellidos"
                  placeholder="Apellidos"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
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
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="userPhone"
                  label="Teléfono"
                  placeholder="Número de teléfono"
                  value={formData.userPhone}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.userPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.userPhone}</p>
                )}
              </div>

              <div>
                <Select
                  name="documentId"
                  label="Tipo de identificación"
                  value={formData.documentId}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                >
                  <option value="1">Cédula de ciudadanía</option>
                  <option value="2">Tarjeta de identidad</option>
                  <option value="3">Cédula de extranjería</option>
                  <option value="4">Pasaporte</option>
                </Select>
              </div>

              <div>
                <TextInput
                  name="documentNumber"
                  label="Número de documento"
                  placeholder="Número de documento"
                  value={formData.documentNumber}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.documentNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                )}
              </div>

              <div className="col-span-2">
                <TextInput
                  name="userEmail"
                  label="Correo electrónico"
                  placeholder="Correo electrónico"
                  value={formData.userEmail}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.userEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="password"
                  type="password"
                  label="Contraseña"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="passwordConfirmation"
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="Confirmar contraseña"
                  value={formData.passwordConfirmation}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500 text-xs mt-1">{errors.passwordConfirmation}</p>
                )}
              </div>

              <div>
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
              </div>

              <div>
                <TextInput
                  name="userJob"
                  label="Trabajo"
                  placeholder="Trabajo del usuario"
                  value={formData.userJob}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.userJob && (
                  <p className="text-red-500 text-xs mt-1">{errors.userJob}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="userContactOrigin"
                  label="Origen del contacto"
                  placeholder="Origen del contacto"
                  value={formData.userContactOrigin}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full"
                />
                {errors.userContactOrigin && (
                  <p className="text-red-500 text-xs mt-1">{errors.userContactOrigin}</p>
                )}
              </div>

              <div>
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
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-4">
              <Button className="bg-red-500 hover:bg-red-800" onClick={closeModal} disabled={isLoading}>
                Cancelar
              </Button>
              <Button 
                className={`inline-block py-2 px-6 rounded-l-xl rounded-t-xl ${
                    isLoading 
                      ? 'bg-[#9f7fff] cursor-not-allowed' 
                      : 'bg-[#7747FF] hover:bg-white hover:text-[#7747FF] focus:text-[#7747FF] focus:bg-gray-200'
                  } text-gray-50 font-bold leading-loose transition duration-200`}
                onClick={handleNewUser}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          <Modal.Header>Editar Persona</Modal.Header>
          <Modal.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextInput
                  name="firstName"
                  label="Nombres"
                  placeholder={currentUser?.firstName || "Nombres"}
                  value={editFormData.firstName}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="lastName"
                  label="Apellidos"
                  placeholder={currentUser?.lastName || "Apellidos"}
                  value={editFormData.lastName}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="username"
                  label="Nombre de usuario"
                  placeholder={currentUser?.username || "Username"}
                  value={editFormData.username}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="userPhone"
                  label="Teléfono"
                  placeholder={currentUser?.userPhone || "Número de teléfono"}
                  value={editFormData.userPhone}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.userPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.userPhone}</p>
                )}
              </div>

              <div>
                <Select
                  name="documentId"
                  label="Tipo de identificación"
                  value={editFormData.documentId}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                >
                  <option value="CC">Cédula de ciudadanía</option>
                  <option value="TI">Tarjeta de identidad</option>
                  <option value="CE">Cédula de extranjería</option>
                  <option value="PA">Pasaporte</option>
                </Select>
              </div>

              <div>
                <TextInput
                  name="documentNumber"
                  label="Número de documento"
                  placeholder={currentUser?.documentNumber || "Número de documento"}
                  value={editFormData.documentNumber}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.documentNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="userJob"
                  label="Trabajo"
                  placeholder={currentUser?.userJob || "Trabajo del usuario"}
                  value={editFormData.userJob}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.userJob && (
                  <p className="text-red-500 text-xs mt-1">{errors.userJob}</p>
                )}
              </div>

              <div>
                <TextInput
                  name="userContactOrigin"
                  label="Origen del contacto"
                  placeholder={currentUser?.userContactOrigin || "Origen del contacto"}
                  value={editFormData.userContactOrigin}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.userContactOrigin && (
                  <p className="text-red-500 text-xs mt-1">{errors.userContactOrigin}</p>
                )}
              </div>

              <div className="col-span-2">
                <TextInput
                  name="userEmail"
                  label="Correo electrónico"
                  placeholder={currentUser?.userEmail || "Correo electrónico"}
                  value={editFormData.userEmail}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                />
                {errors.userEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
                )}
              </div>

              <div>
                <Select
                  name="roleId"
                  label="Rol"
                  value={editFormData.roleId}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                >
                  <option value="2">Vendedor</option>
                  <option value="3">Cliente</option>
                  <option value="4">Proveedor</option>
                  <option value="5">Contacto</option>
                </Select>
              </div>

              <div>
                <Select
                  name="locationId"
                  label="Ubicación"
                  value={editFormData.locationId}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full"
                >
                  <option value="1">Bogotá</option>
                  <option value="2">Tunja</option>
                </Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-red-500 hover:bg-red-800"
                onClick={closeModalEdit}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#7747FF] hover:bg-[#5f35d5]"
                onClick={() => {
                  handleEditUser(actualId);
                  closeModalEdit();
                }}
              >
                Editar
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Personas                
