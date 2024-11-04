import React, { useState } from 'react';

const Products = () => {
  const [productos, setProductos] = useState([
    { id: 'G3241', nombre: 'Gas Spring', descripcion: 'T70-432/120N Bansb', cantidad: 3, categoria: 'Gas Spring', precio: '$989.287' },
    { id: 'C6472', nombre: 'Bisagra plas', descripcion: 'Atornillable de 65 nr', cantidad: 10, categoria: 'Conveyors', precio: '$51.408' },
    { id: 'I9802', nombre: 'Indicador de', descripcion: 'DA04-04-20-1-1-XX', cantidad: 7, categoria: 'Indicadores', precio: '$808.317' },
    { id: 'M9700', nombre: 'Manija ajust', descripcion: 'Metálica de acero', cantidad: 4, categoria: 'Manijas ajustables', precio: '$161.697' },
    { id: 'P6572', nombre: 'Perilla plást', descripcion: 'Carbono rosca M5', cantidad: 1, categoria: 'Perilla Plást', precio: '$17.761' },
    { id: 'C8919', nombre: 'Clam tipo pi', descripcion: 'Capacidad de retención', cantidad: 0, categoria: 'Clamps precisión', precio: '$229.238' },
  ]);

  const eliminarProducto = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  return (
    <div className="bg-blue-100 p-4 rounded-lg -mt-52">
      <div className="flex items-center justify-between mb-4">
        <select className="border rounded-md p-2">
          <option value="">Categoría</option>
          <option value="Gas Spring">Gas Spring</option>
          <option value="Conveyors">Conveyors</option>
          {/* Otras opciones */}
        </select>
        <input type="text" placeholder="Buscar" className="border rounded-md p-2 ml-2" />
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="p-2">Id</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{producto.id}</td>
              <td className="p-2">{producto.nombre}</td>
              <td className="p-2">{producto.descripcion}</td>
              <td className="p-2">{producto.cantidad}</td>
              <td className="p-2">{producto.categoria}</td>
              <td className="p-2">{producto.precio}</td>
              <td className="p-2 flex">
                <button className="text-blue-500 hover:text-blue-700 mr-2">✏️</button>
                <button className="text-red-500 hover:text-red-700" onClick={() => eliminarProducto(producto.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
        Añadir producto
      </button>
    </div>
  );
};

export default Products;
