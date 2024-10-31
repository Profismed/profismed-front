import React from "react";
import "./LandingPage.css"; // Importamos el CSS específico para Personas
// import { FaPen, FaTrash } from 'react-icons/fa';
import { Table, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

const Personas = () => {
  const personas = [
    {
      nombre: "Pepito",
      correo: "pepito@mail.com",
      telefono: "312456872",
      rol: "Vendedor",
      zona: "Bogotá",
    },
    {
      nombre: "Laura",
      correo: "laura@mail.com",
      telefono: "312545852",
      rol: "Cliente",
      zona: "Bogotá",
    },
    {
      nombre: "Luis",
      correo: "luis@mail.com",
      telefono: "320142256",
      rol: "Vendedor",
      zona: "Medellín",
    },
    {
      nombre: "Valeria",
      correo: "valeria@mail.com",
      telefono: "315248760",
      rol: "Cliente",
      zona: "Bogotá",
    },
    {
      nombre: "Agustin",
      correo: "agustin@mail.com",
      telefono: "320154826",
      rol: "Cliente",
      zona: "Bogotá",
    },
    {
      nombre: "Fernando",
      correo: "fernando@mail.com",
      telefono: "310548268",
      rol: "Cliente",
      zona: "Bogotá",
    },
  ];

  return (
    <>
      <div className="-mt-52">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Personas
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Listado de personas registradas en la plataforma
        </p>
        <div className="flex justify-between">
          <TextInput
            className="w-44"
            placeholder="Buscar"
            icon={HiSearch}
          ></TextInput>

          <select
            id="countries"
            class="bg-gray-50 border w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>Categoria</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Correo</Table.HeadCell>
              <Table.HeadCell>Teléfono</Table.HeadCell>
              <Table.HeadCell>Rol</Table.HeadCell>
              <Table.HeadCell>Zona</Table.HeadCell>
              <Table.HeadCell>Acciones</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {personas.map((persona, index) => (
                <Table.Row
                  key={index}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {persona.nombre}
                  </Table.Cell>
                  <Table.Cell>{persona.correo}</Table.Cell>
                  <Table.Cell>{persona.telefono}</Table.Cell>
                  <Table.Cell>{persona.rol}</Table.Cell>
                  <Table.Cell>{persona.zona}</Table.Cell>
                  <Table.Cell className="acciones">
                    <button className="editar-btn">{/*<FaPen />*/}</button>
                    <button className="eliminar-btn">{/*<FaTrash />*/}</button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <button type="button" class="text-white bg-lime-500 hover:bg-lime-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-5 mb-2 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800">Añadir vendedor</button>
      </div>
    </>
  );
};

export default Personas;
