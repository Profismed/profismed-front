import React, { useState } from 'react';
import './Products.css'; // Asegúrate de tener un archivo CSS para estilos

const Products = () => {
  // Datos iniciales de ejemplo
  const [productos, setProductos] = useState([
    { id: 'G3241', nombre: 'Gas Spring', descripcion: 'T70-432/120N Bansb', cantidad: 3, categoria: 'Gas Spring', precio: '$989.287' },
    { id: 'C6472', nombre: 'Bisagra plas', descripcion: 'Atornillable de 65 nr', cantidad: 10, categoria: 'Conveyors', precio: '$51.408' },
    { id: 'I9802', nombre: 'Indicador de', descripcion: 'DA04-04-20-1-1-XX', cantidad: 7, categoria: 'Indicadores', precio: '$808.317' },
    { id: 'M9700', nombre: 'Manija ajust', descripcion: 'Metálica de acero', cantidad: 4, categoria: 'Manijas ajustables', precio: '$161.697' },
    { id: 'P6572', nombre: 'Perilla plást', descripcion: 'Carbono rosca M5', cantidad: 1, categoria: 'Perilla Plást', precio: '$17.761' },
    { id: 'C8919', nombre: 'Clam tipo pi', descripcion: 'Capacidad de retención', cantidad: 0, categoria: 'Clamps precisión', precio: '$229.238' },
  ]);

  // Función para eliminar un producto
  const eliminarProducto = (id) => {
    setProductos(productos.filter(producto => producto.id !== id));
  };

  return (
    <div className="productos-container">
      {/* Barra lateral
      <nav className="sidebar">
        <ul>
          <li><span className="icon">👤</span> Personas</li>
          <li className="active"><span className="icon">🛒</span> Products</li>
          <li><span className="icon">📊</span> Reportes</li>
        </ul>
      </nav> */}

      {/* Contenido principal */}
      <div className="productos-content">
        <div className="header">
          <h2>Admin</h2>
        </div>
        <div className="table-container">
          <div className="table-header">
            <select className="categoria-select">
              <option value="">Categoría</option>
              <option value="Gas Spring">Gas Spring</option>
              <option value="Conveyors">Conveyors</option>
              {/* Otras opciones */}
            </select>
            <input type="text" placeholder="Buscar" className="search-input" />
          </div>

          <table className="productos-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.cantidad}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.precio}</td>
                  <td>
                    <button className="edit-button">✏️</button>
                    <button className="delete-button" onClick={() => eliminarProducto(producto.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="add-product-button">Añadir producto</button>
      </div>
    </div>
  );
};

export default Products;
