import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAutoAnimate } from '@formkit/auto-animate/react'

const Sales = () => {
  const [data, setData] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [userSesionId, setUserSesionId] = useState();
  const [buyerSesionId, setBuyerSesionId] = useState();
  const [parent] = useAutoAnimate(/* optional config */)

 
 
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

    // const fetchUserData = async () => {
    //     const requestOptions = {
    //       method: "GET",
    //       credentials: "include",
    //       redirect: "follow",
    //     };
  
    //     try {
    //       const response = await fetch(
    //         "https://profismedsgi.onrender.com/api/auth/userData",
    //         requestOptions
    //       );
    //       if (response.ok) {
    //         const data = await response.json();
    //         setUserSesionId(data.userId);
            
    //       } else {
    //         console.error("Failed to fetch user data:", response.status);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching user data:", error);
    //     }
    //   };
  

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
        setProductos([]); // Asignar array vacío en caso de error
      }
    };

    fetchPersonas();
    fetchProductos();
  }, []);

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
        setUserSesionId(data.userId);
      } else {
        console.error("Failed to fetch user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  function handleAddProduct() {
    const nombre = document.getElementById("products").value;
    const cantidad = parseInt(document.getElementById("quantity").value, 10);

    const producto = productos.find(
      (producto) => producto.productId === parseInt(nombre, 10)
    );

    if (producto) {
      const existingProductIndex = data.findIndex(
        (item) => item.productId === producto.productId
      );

      if (existingProductIndex !== -1) {
        // Producto ya existe, actualizar cantidad y total
        const updatedData = data.map((item, index) => {
          if (index === existingProductIndex) {
            const newCantidad = item.cantidad + cantidad;
            const newTotal = item.productPrice * newCantidad;
            return { ...item, cantidad: newCantidad, total: newTotal };
          }
          return item;
        });
        setData(updatedData);

      } else {
        // Producto no existe, agregar nuevo producto
        const total = producto.productPrice * cantidad;
        setData([
          ...data,
          {
            ...producto,
            cantidad,
            total,
          },
        ]);
      }
    }
  }

  const handleSaveOrder = async (buyId, sellId) => {
    const raw = JSON.stringify({
        buyerId: buyId,
        sellerId: sellId,
        items: data.map((item) => ({
            productId: item.productId,
            productQuantity: item.cantidad,
        })),
    });

    console.log("Order data:", raw);
    

    const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(
            "https://profismedsgi.onrender.com/api/sales/create",
            requestOptions
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Verifica si la respuesta es JSON antes de parsearla
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch {
            result = text; // Si no es JSON, simplemente guarda el texto
        }

        console.log("Order created successfully:", result);
        setData([]);
    } catch (error) {
        console.error("An error occurred during order creation", error);
    }
};



  function handleRemoveAllProducts() {
    setData([]);
    const persons = document.getElementById("clients");
    const products = document.getElementById("products");
    const quantity = document.getElementById("quantity");
    products.selectedIndex = 0;
    persons.selectedIndex = 0;
    quantity.value = "";
  }

  function handleRemoveProduct(index) {
    setData(data.filter((_, i) => i !== index));
  }

  const IVA_RATE = 0.19; // 19% de IVA
  const DESCUENTO = 0; // Puedes ajustar el descuento aquí

  const calculateSubtotal = () => {
    return data.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  const calculateIVA = (subtotal) => {
    return subtotal * IVA_RATE;
  };

  const calculateTotal = (subtotal, iva, descuento) => {
    return subtotal + iva - descuento;
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  };

  const subtotal = calculateSubtotal();
  const iva = calculateIVA(subtotal);
  const total = calculateTotal(subtotal, iva, DESCUENTO);

  console.log("este es el comprador", buyerSesionId, "este es el vendedor", userSesionId);
  


  return (
    <>
      <div className="flex flex-col ml-10 max-w-sm mx-auto">
        <label
          htmlFor="clients"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Selecciona un cliente:
        </label>
        <select
          id="clients"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(event) => {
            
             setBuyerSesionId(event.target.value);
             console.log(event.target.value, "esta monda es el userId del comprador");
             
            // console.log(buyerSesionId); // Aquí puedes hacer lo que necesites con userSesionId
          }}
        >
          <option selected>Selecione un cliente</option>
          {personas.map((persona) => (
            <option key={persona.userId} value={persona.userId}>
              {persona.firstName}
            </option>
          ))}
        </select>
        {/*<p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">Oh, snapp!</span> Some error message.</p>*/}
      </div>
      <div className="flex flex-row mt-10 justify-start space-x-7">
        <div className="flex flex-col ml-10 max-w-sm">
          <label
            htmlFor="products"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Selecciona un producto:
          </label>
          <select
            id="products"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>Selecione un producto</option>
            {productos.map((producto) => (
              <option key={producto.productId} value={producto.productId}>
                {producto.productName}
              </option>
            ))}
          </select>
        </div>
        <div className="max-w-sm mx-auto">
          <label
            htmlFor="quantity"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Cantidad:
          </label>
          <input
            type="number"
            id="quantity"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Cantidad"
            min={1}
            required
          />
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={handleAddProduct}
            className="text-gray-900 my-5 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Agregar
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-10 mx-10">
        <table className="min-w-full bg-gray-100 rounded-lg">
          <thead>
            <tr className="bg-gray-300 text-left text-gray-700">
              <th className="py-3 px-4 font-semibold">ID</th>
              <th className="py-3 px-4 font-semibold">Nombre</th>
              <th className="py-3 px-4 font-semibold">Descripción</th>
              <th className="py-3 px-4 font-semibold">Cantidad</th>
              <th className="py-3 px-4 font-semibold">Valor Unit</th>
              <th className="py-3 px-4 font-semibold">Total</th>
              <th className="py-3 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody ref={parent}>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-3 px-4">{item.productId}</td>
                <td className="py-3 px-4 font-semibold">{item.productName}</td>
                <td className="py-3 px-4">{item.productDescription}</td>
                <td className="py-3 px-4">{item.cantidad}</td>
                <td className="py-3 px-4">
                  ${item.productPrice.toLocaleString()}
                </td>
                <td className="py-3 px-4">${item.total.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-end mt-10 mr-10">
        <div className="flex flex-col justify-end mx-10 my-5">
          {/* Subtotal */}
          <div className="flex flex-col items-center mt-10">
            <div className="flex flex-row justify-between w-full max-w-md">
              <p className="font-semibold text-lg text-blue-500">Subtotal:</p>
              <p className="font-semibold text-lg">{formatCurrency(subtotal)}</p>
            </div>
          </div>

          {/* Descuento */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex flex-row justify-between w-full max-w-md">
              <p className="font-semibold text-lg text-blue-500">Descuento:</p>
              <p className="font-semibold text-lg">{formatCurrency(DESCUENTO)}</p>
            </div>
          </div>

          {/* IVA */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex flex-row justify-between w-full max-w-md">
              <p className="font-semibold text-lg text-blue-500">IVA:</p>
              <p className="font-semibold text-lg">{formatCurrency(iva)}</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex flex-row justify-between w-full max-w-md">
              <p className="font-semibold text-lg text-blue-500">Total:</p>
              <p className="font-semibold text-lg">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-between mx-10">
        <button
          type="button"
          onClick={handleRemoveAllProducts}
          className="text-gray-900 my-5 bg-gradient-to-r from-red-200 via-red-400 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center"
        >
          <FaTrashAlt className="mr-2" />
          Limpiar
        </button>
        <button
          type="button"
          onClick={() => {
            Swal.fire({
              title: "Venta confirmada",
              text: "La venta ha sido confirmada exitosamente.",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                handleSaveOrder(buyerSesionId, userSesionId);
                handleRemoveAllProducts();
              }
            });
          }}
          className="text-gray-900 my-5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Confirmar venta
        </button>
      </div>
    </>
  );
};

export default Sales;