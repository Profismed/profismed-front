import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select } from "flowbite-react";
import Swal from "sweetalert2";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Realizar la petición fetch a la API de productos
    const fetchProductos = async () => {
      const requestOptions = {
        method: "GET",
        credentials: "include",
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "https://profismedsgi.onrender.com/api/products/all",
          requestOptions
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("La respuesta no es un array de productos", data);
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleCreateProduct = async () => {
    // Realizar la petición fetch a la API para crear un producto

    try {
      const raw = JSON.stringify({
        productName: "aunmasmildepanpruebaintegracion1",
        productDescription: "Descripción detallada del pan",
        productPrice: 300,
        quantity: 50,
        userId: 1,
      });

      const requestOptions = {
        method: "POST",
        body: raw,
        credentials: "include",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        "https://profismedsgi.onrender.com/api/products/create",
        requestOptions
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Producto creado:", data);
        setProductos([...productos, data]);
        setIsModalOpen(false);
      } else {
        console.error("Error al crear el producto:", data);
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  console.log(productos);
  return (
    <>
      <div className="w-full min-h-screen px-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Productos
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Listado de productos disponibles en la plataforma
        </p>

        <div className="flex flex-col sm:flex-row justify-end space-x-8 items-center mb-4">
          <select className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
            <option selected>Categoría</option>
            <option value="category1">Categoría 1</option>
            <option value="category2">Categoría 2</option>
          </select>
          <TextInput
            className="w-full sm:w-44 mb-2 sm:mb-0"
            placeholder="Buscar"
            icon={HiSearch}
          />
        </div>

        <div className="relative overflow-x-auto">
          {productos.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {producto.productName}
                    </th>
                    <td className="px-6 py-4">{producto.productDescription}</td>
                    <td className="px-6 py-4">{producto.quantity}</td>
                    <td className="px-6 py-4">{producto.productPrice}</td>
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
                              Swal.fire(
                                "¡Eliminado!",
                                "El producto ha sido eliminado.",
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
                ))}
              </tbody>
            </table>
          ) : (
            <div
              role="status"
              class="w-full bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div class="flex items-center justify-between pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div class="flex items-center justify-between pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div class="flex items-center justify-between pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <div class="flex items-center justify-between pt-4">
                <div>
                  <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                  <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
              </div>
              <span class="sr-only">Loading...</span>
            </div>
          )}
        </div>

        <div className="flex justify-end px-10">
          <button
            type="button"
            onClick={() => {
              openModal();
            }}
            className="text-white bg-lime-500 hover:bg-lime-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5 mb-2 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800"
          >
            Añadir producto
          </button>
        </div>
      </div>

      {/* Modal de Flowbite */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Añadir Producto</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombre"
              placeholder="Nombre del producto"
              className="w-full"
            />
            <TextInput
              label="Descripción"
              placeholder="Descripción"
              className="w-full"
            />
            <TextInput label="Precio" placeholder="Precio" className="w-full" />
            <TextInput
              label="Cantidad"
              placeholder="Cantidad"
              className="w-full"
            />

            <Select
              label="provedor Id"
              placeholder="Seleccione una opción"
              className="w-full col-span-2"
              // onChange={(e) => setEditDocumentId(e.target.selectedIndex)}
            >
              <option value="CC">Selecciona un proveedor</option>
              <option value="TI">provedor 1</option>
              <option value="CE">proveedor 2</option>
              <option value="PA">proveedor 3</option>
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
                handleCreateProduct();
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

export default Productos;
