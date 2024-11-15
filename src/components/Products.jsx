import React, { useState, useEffect } from "react";
import { TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { Modal, Button, Select, Pagination } from "flowbite-react";
import Swal from "sweetalert2";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [productsPerPage] = useState(10); // Cantidad de productos por página

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [actualId, setActualId] = useState("");

  const [productNameNew, setProductNameNew] = useState("");
  const [productDescriptionNew, setProductDescriptionNew] = useState("");
  const [productPriceNew, setProductPriceNew] = useState("");
  const [quantityNew, setQuantityNew] = useState("");
  const [providerId, setProviderId] = useState("");

  const [editProductName, setEditProductName] = useState("");
  const [editProductDescription, setEditProductDescription] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editProviderId, setEditProviderId] = useState("");

  // Realizar la petición fetch a la API de productos
  const fetchProductos = async () => {
    // Fetch de productos como ya lo tienes
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
        setFilteredProducts(data); // Inicializar productos filtrados
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleCreateProduct = async () => {
    // Realizar la petición fetch a la API para crear un producto

    try {
      const raw = JSON.stringify({
        productName: productNameNew,
        productDescription: productDescriptionNew,
        productPrice: productPriceNew,
        quantity: quantityNew,
        userId: providerId,
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
        // setProductos([...productos, data]);
        fetchProductos();
        setIsModalOpen(false);
      } else {
        console.error("Error al crear el producto:", data);
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    // Realizar la petición fetch a la API para eliminar un producto
    try {
      const requestOptions = {
        method: "DELETE",
        credentials: "include",
        redirect: "follow",
      };

      const response = await fetch(
        `https://profismedsgi.onrender.com/api/products/delete/${productId}`,
        requestOptions
      );
      if (response.ok) {
        const updatedProducts = productos.filter(
          (producto) => producto.productId !== productId
        );
        setProductos(updatedProducts);

      } else {
        console.error("Error al eliminar el producto:", response.status);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
    fetchProductos();
  };

  const handleEditProduct = async (productId) => {
    // Realizar la petición fetch a la API para editar un producto
    try {
      const productData = {
        productName: editProductName,
        productDescription: editProductDescription,
        productPrice: editProductPrice,
        quantity: editQuantity,
        userId: editProviderId,
      };

      // Filtrar propiedades vacías o undefined
      const filteredProductData = Object.fromEntries(
        Object.entries(productData).filter(
          ([key, value]) => value !== undefined && value !== ""
        )
      );

      const raw = JSON.stringify(filteredProductData);

      const requestOptions = {
        method: "PUT",
        body: raw,
        credentials: "include",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `https://profismedsgi.onrender.com/api/products/update/${productId}`,
        requestOptions
      );
      const data = await response.json();
      if (response.ok) {
        fetchProductos();
      } else {
        console.error("Error al editar el producto:", data);
      }
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };

   // Calcular los productos a mostrar en la página actual
   const indexOfLastProduct = currentPage * productsPerPage;
   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
 
   // Cambiar de página
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    setEditProductDescription("");
    setEditProductName("");
    setEditProductPrice("");
    setEditQuantity("");
    setEditProviderId("");
    fetchProductos();
  };

  // Manejar cambios en el término de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterProducts(term, selectedProvider);
  };

  // Manejar cambios en el proveedor seleccionado
  const handleProviderChange = (e) => {
    const provider = e.target.value;
    setSelectedProvider(provider);
    filterProducts(searchTerm, provider);
  };

  // Función para filtrar productos
  const filterProducts = (term, userId) => {
    // Filtrado basado en userId y term
    const filtered = productos.filter((producto) => {
      if (userId) {
        // Si userId tiene un valor, filtra solo los productos que coincidan con ese userId

        return producto.userId === parseInt(userId, 10);
      } else if (term) {
        // Si userId está vacío pero term tiene un valor, filtra los productos que contengan el texto de term en el nombre

        return producto.productName.toLowerCase().includes(term.toLowerCase());
      }
      // Si ambos userId y term están vacíos, muestra todos los productos
      return true;
    });

    setFilteredProducts(filtered);
  };

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
          <select
            className="bg-gray-50 border w-full sm:w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            value={selectedProvider}
            onChange={handleProviderChange}
          >
            <option value="">Todos los Proveedores</option>
            {/* Añadir opciones de proveedores según tus datos */}
            <option value="1">Proveedor 1</option>
            <option value="2">Proveedor 2</option>
          </select>
          <TextInput
            className="w-full sm:w-44 mb-2 sm:mb-0"
            placeholder="Buscar por nombre"
            icon={HiSearch}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="relative overflow-x-auto">
          {currentProducts.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Nombre</th>
                  <th scope="col" className="px-6 py-3">Descripción</th>
                  <th scope="col" className="px-6 py-3">Cantidad</th>
                  <th scope="col" className="px-6 py-3">Precio</th>
                  <th scope="col" className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((producto, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {producto.productName}
                    </th>
                    <td className="px-6 py-4">{producto.productDescription}</td>
                    <td className="px-6 py-4">{producto.quantity}</td>
                    <td className="px-6 py-4">{producto.productPrice}</td>
                    <td className="px-6 py-4 flex flex-row space-x-2 gap-2">
                      <button
                        onClick={() => {
                          openModalEdit(producto.productId);
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
                              handleDeleteProduct(producto.productId);
                              
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
              className="w-full bg-white p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
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
          )}
          {/* Paginador de Flowbite */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
            onPageChange={paginate}
          />
        </div>
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

      {/* Modal de crear producto */}
      <Modal show={isModalOpen} onClose={closeModal}>
        <Modal.Header>Añadir Producto</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombre"
              placeholder="Nombre del producto"
              className="w-full"
              onChange={(e) => setProductNameNew(e.target.value)}
            />
            <TextInput
              label="Descripción"
              placeholder="Descripción"
              className="w-full"
              onChange={(e) => setProductDescriptionNew(e.target.value)}
            />
            <TextInput
              label="Precio"
              placeholder="Precio"
              className="w-full"
              onChange={(e) => setProductPriceNew(e.target.value)}
            />
            <TextInput
              label="Cantidad"
              placeholder="Cantidad"
              className="w-full"
              onChange={(e) => setQuantityNew(e.target.value)}
            />

            <Select
              label="provedor Id"
              placeholder="Seleccione una opción"
              className="w-full col-span-2"
              onChange={(e) => setProviderId(e.target.value)}
            >
              <option value="">Selecciona un proveedor</option>
              <option value="1">provedor 1</option>
              <option value="2">proveedor 2</option>
              <option value="3">proveedor 3</option>
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

      {/* Modal de editar producto */}

      <Modal show={isModalEditOpen} onClose={closeModalEdit}>
        <Modal.Header>Editar Producto </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombre"
              placeholder={
                productos.find((producto) => producto.productId === actualId)
                  ?.productName
              }
              className="w-full"
              onBlur={(e) => {
                setEditProductName(e.target.value);
              }}
            />
            <TextInput
              label="Descripción"
              placeholder={
                productos.find((producto) => producto.productId === actualId)
                  ?.productDescription
              }
              className="w-full"
              onBlur={(e) => setEditProductDescription(e.target.value)}
            />
            <TextInput
              label="Precio del producto"
              placeholder={
                productos.find((producto) => producto.productId === actualId)
                  ?.productPrice
              }
              className="w-full"
              onBlur={(e) => setEditProductPrice(e.target.value)}
            />
            <TextInput
              label="Cantidad"
              placeholder={
                productos.find((producto) => producto.productId === actualId)
                  ?.quantity
              }
              className="w-full"
              onBlur={(e) => setEditQuantity(e.target.value)}
            />

            <Select
              label="Provedor"
              value={
                editProviderId || // Si `editUserId` tiene un valor, lo usamos
                productos.find((producto) => producto.productId === actualId)
                  ?.userId || // Si no, usamos el `userId` del producto actual
                "" // Si ninguno de los anteriores tiene valor, usamos una cadena vacía
              }
              className="w-full"
              onChange={(e) => {
                setEditProviderId(e.target.value);
              }} // Actualizamos el estado con el valor de la opción seleccionada
            >
              <option value="1">provedor 1</option>
              <option value="2">provedor 2</option>
              <option value="3">Provedor 3</option>
              <option value="4">Provedor 4</option>
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
                handleEditProduct(actualId);

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

export default Productos;
