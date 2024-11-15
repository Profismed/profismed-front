import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';

// Componente para mostrar los reportes
const Reportes = () => {
  const [leastSalesZone, setLeastSalesZone] = useState(null);
  const [leastSellingProduct, setLeastSellingProduct] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [salesProductSummary, setSalesProductSummary] = useState(null);
  const [top10Products, setTop10Products] = useState(null);  // Nuevo estado para los top 10 productos

  // Fetch para obtener los datos de los reportes
  useEffect(() => {
    // Petición para least_sales_zone
    fetch('https://profismedsgi.onrender.com/api/reports/zones/least-sales-zone')
      .then((response) => response.json())
      .then((data) => setLeastSalesZone(data));

    // Petición para least_selling_product
    fetch('https://profismedsgi.onrender.com/api/reports/products/least-selling-product')
      .then((response) => response.json())
      .then((data) => setLeastSellingProduct(data));

    // Petición para monthly_sales
    fetch('https://profismedsgi.onrender.com/api/reports/sales/monthly-sales')
      .then((response) => response.json())
      .then((data) => setMonthlySales(data));

    // Petición para sales_product_summary
    fetch('https://profismedsgi.onrender.com/api/reports/sales/sales-products-summary')
      .then((response) => response.json())
      .then((data) => setSalesProductSummary(data));

    // Petición para top_10_products
    fetch('https://profismedsgi.onrender.com/api/reports/products/top-10-products')
      .then((response) => response.json())
      .then((data) => setTop10Products(data));
  }, []);

  // Configuración del gráfico de ventas mensuales
  const monthlySalesChart = {
    chart: {
      id: 'monthly-sales-chart',
    },
    xaxis: {
      categories: monthlySales ? monthlySales.map((item) => `${item.sale_month}-${item.sale_year}`) : [],
    },
    series: [
      {
        name: 'Ventas',
        data: monthlySales ? monthlySales.map((item) => item.total_sales) : [],
      },
    ],
  };

  // Configuración del gráfico de zona con menos ventas
  const leastSalesZoneChart = {
    chart: {
      id: 'least-sales-zone-chart',
    },
    labels: leastSalesZone ? leastSalesZone.map((item) => item.location_name) : [],
    series: leastSalesZone ? leastSalesZone.map((item) => item.total_sales) : [],
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
  };

  // Configuración del gráfico de producto menos vendido
  const leastSellingProductChart = {
    chart: {
      id: 'least-selling-product-chart',
    },
    labels: leastSellingProduct ? leastSellingProduct.map((item) => item.product_name) : [],
    series: leastSellingProduct ? leastSellingProduct.map((item) => parseInt(item.total_quantity_sold)) : [],
    plotOptions: {
      pie: {
        expandOnClick: true,
      },
    },
  };

  // Configuración del gráfico de los 10 productos más vendidos
  const top10ProductsChart = {
    chart: {
      id: 'top10-products-chart',
    },
    xaxis: {
      categories: top10Products ? top10Products.map((item) => item.product_name) : [],
    },
    series: [
      {
        name: 'Cantidad Vendida',
        data: top10Products ? top10Products.map((item) => parseInt(item.total_quantity_sold)) : [],
      },
    ],
    plotOptions: {
      bar: {
        horizontal: true, // Esto muestra las barras horizontalmente
      },
    },
  };

  // Configuración de la tabla de ventas por productos
  const renderSalesProductSummary = () => {
    if (!salesProductSummary) return <p>Cargando...</p>;

    return salesProductSummary.map((sale) => (
      <tr key={sale.sales_id}>
        <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
        <td>{sale.product_names}</td>
        <td>{sale.sales_amount}</td>
        <td>{sale.total_quantity}</td>
        <td>{sale.total_subtotal}</td>
      </tr>
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reportes de Ventas</h2>

      {/* Gráfico de zona con menos ventas */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Zona con Menos Ventas</h3>
        <ApexCharts options={leastSalesZoneChart} series={leastSalesZoneChart.series} type="pie" height={350} />
      </div>

      {/* Gráfico de producto menos vendido */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Producto Menos Vendido</h3>
        <ApexCharts options={leastSellingProductChart} series={leastSellingProductChart.series} type="pie" height={350} />
      </div>

      {/* Gráfico de ventas mensuales */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ventas del Mes</h3>
        <ApexCharts options={monthlySalesChart} series={monthlySalesChart.series} type="line" height={350} />
      </div>

      {/* Gráfico de los 10 productos más vendidos */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Top 10 Productos Más Vendidos</h3>
        <ApexCharts options={top10ProductsChart} series={top10ProductsChart.series} type="bar" height={350} />
      </div>

      {/* Tabla de ventas por productos */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2">Resumen de Ventas por Productos</h3>
        <table className="table-auto w-full border-separate border-spacing-2 border border-gray-300">
          <thead>
            <tr>
              <th className="border px-4 py-2">Fecha</th>
              <th className="border px-4 py-2">Productos</th>
              <th className="border px-4 py-2">Monto de Venta</th>
              <th className="border px-4 py-2">Cantidad Total</th>
              <th className="border px-4 py-2">Subtotal Total</th>
            </tr>
          </thead>
          <tbody>{renderSalesProductSummary()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
