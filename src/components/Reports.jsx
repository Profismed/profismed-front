import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const Reportes = () => {
  const [leastSalesZone, setLeastSalesZone] = useState([]);
  const [topSalesZone, setTopSalesZone] = useState(null);
  const [leastSellingProduct, setLeastSellingProduct] = useState(null);
  const [topSellingProduct, setTopSellingProduct] = useState(null);
  const [topBuyers, setTopBuyers] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  const [monthlySales, setMonthlySales] = useState(null);
  const [salesProductSummary, setSalesProductSummary] = useState(null);
  const [top10Products, setTop10Products] = useState(null);

  const [monthlySalesChart, setMonthlySalesChart] = useState({
    series: [],
    options: {},
  });

  const [top10ProductsChart, setTop10ProductsChart] = useState({
    series: [],
    options: {},
  });

  const [topBuyersChart, setTopBuyersChart] = useState({
    series: [],
    options: {},
  });

  const [topSellersChart, setTopSellersChart] = useState({
    series: [],
    options: {},
  });

  // Helper function to handle cached data
  const getCachedData = (key, expirationMinutes = 0.5) => {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = new Date().getTime();
      const expirationTime = expirationMinutes * 60 * 1000;
      
      if (now - timestamp < expirationTime) {
        return data;
      }
      localStorage.removeItem(key); // Remove expired data
    }
    return null;
  };

  // Helper function to set cached data
  const setCachedData = (key, data) => {
    const cacheObject = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheObject));
  };

  // Helper function for fetching data with caching
  const fetchWithCache = async (url, cacheKey, setter, chartSetter = null) => {
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setter(cachedData);
      if (chartSetter && cachedData.length > 0) {
        updateChart(cachedData, chartSetter);
      }
      return;
    }

    const requestOptions = {
      method: "GET",
      credentials: "include",
      redirect: "follow",
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setter(data);
      setCachedData(cacheKey, data);
      
      if (chartSetter && data.length > 0) {
        updateChart(data, chartSetter);
      }
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error);
    }
  };

  // Helper functions for updating charts
  const updateChart = (data, chartSetter) => {
    switch(chartSetter) {
      case setTopBuyersChart:
        // console.log(data);
        
        chartSetter({
          series: [
            {
            name: "Total Comprado en unidades",
            data: data.map(buyer => 
              buyer.products_bought.split(",").map(p => p.trim()).length
            ),
          },
            {
            name: "Total Comprado en valor",
            data: data.map(buyer => 
              buyer.total_purchased.toFixed(2)
            ),
          },
        ],
          options: {
            chart: { type: "bar", height: 350 },
            xaxis: {
              categories: data.map(buyer => 
                `${buyer.contact_first_name} `
              ),
            },
            title: {
              text: "Top Compradores",
              align: "center",
            },
          },
        });
        break;

      case setTop10ProductsChart:
        chartSetter({
          series: [{
            name: "Cantidad Vendida",
            data: data.map(product => product.total_quantity_sold),
          }],
          options: {
            chart: { type: "bar", height: 350 },
            xaxis: {
              categories: data.map(product => product.product_name),
            },
            title: {
              text: "Top 10 Productos Más Vendidos",
              align: "center",
            },
          },
        });
        break;

      case setMonthlySalesChart:
        chartSetter({
          series: [
            {
              name: "Ventas Totales",
              data: data.map(sale => sale.total_sales.toFixed(2)),
            },
            {
              name: "Transacciones",
              data: data.map(sale => sale.total_transactions),
            },
          ],
          options: {
            chart: { type: "bar", height: 350 },
            xaxis: {
              categories: data.map(sale => `Mes ${sale.month}`),
            },
            title: {
              text: "Ventas del Mes",
              align: "center",
            },
            plotOptions: {
              bar: {
                columnWidth: "45%",
                distributed: true,
              },
            },
          },
        });
        break;

      case setTopSellersChart:
        // console.log(data,"❤️");
        
        chartSetter({
          series: [{
            name: "Total Vendido en unidades",
            data: data.map(seller => seller.total_sales),
          },
          {
            name: "Total Vendido en dinero",
            data: data.map(seller => seller.total_sales_amount.toFixed(2)),
          },
        ],
          options: {
            chart: { type: "bar", height: 350 },
            xaxis: {
              categories: data.map(seller => 
                `${seller.seller_first_name} ${seller.seller_last_name}`
              ),
            },
            title: {
              text: "Top Vendedores",
              align: "center",
            },
          },
        });
        break;
    }
  };

  useEffect(() => {
    const baseUrl = "https://profismed-sgi-api.onrender.com/api/reports";
    
    // Fetch all data with caching
    fetchWithCache(
      `${baseUrl}/zones/least-sales-zone`,
      "leastSalesZone",
      setLeastSalesZone
    );
    
    fetchWithCache(
      `${baseUrl}/products/top-selling-product`,
      "topSellingProduct",
      setTopSellingProduct
    );
    
    fetchWithCache(
      `${baseUrl}/zones/top-sales-zone`,
      "topSalesZone",
      setTopSalesZone
    );
    
    fetchWithCache(
      `${baseUrl}/buyers-sellers/top-buyers`,
      "topBuyers",
      setTopBuyers,
      setTopBuyersChart
    );
    
    fetchWithCache(
      `${baseUrl}/buyers-sellers/top-sellers`,
      "topSellers",
      setTopSellers,
      setTopSellersChart
    );
    
    fetchWithCache(
      `${baseUrl}/products/least-selling-product`,
      "leastSellingProduct",
      setLeastSellingProduct
    );
    
    fetchWithCache(
      `${baseUrl}/products/top-10-products`,
      "top10Products",
      setTop10Products,
      setTop10ProductsChart
    );
    
    fetchWithCache(
      `${baseUrl}/sales/monthly-sales`,
      "monthlySales",
      setMonthlySales,
      setMonthlySalesChart
    );
    
    fetchWithCache(
      `${baseUrl}/sales/sales-products-summary`,
      "salesProductSummary",
      setSalesProductSummary
    );
  }, []);
  const renderSalesProductSummary = () => {
    if (!salesProductSummary) return <p>Cargando...</p>;
    return salesProductSummary.map((sale) => (
      <tr key={sale.sales_id}>
        <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
        <td>{sale.product_names}</td>
        <td>${sale.sales_amount}</td>
        <td>{sale.total_quantity}</td>
        <td>${sale.total_subtotal}</td>
      </tr>
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reportes de Ventas</h2>

      {/* Contenedor padre con flex */}
      <div className="flex space-x-6">
        {/* Zona con menos ventas */}
        <div className="mb-6 flex-1">
          <div className="bg-white shadow-lg rounded-lg p-4">

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Zona con Menos Ventas
            </h3>
            {leastSalesZone && leastSalesZone.length > 0 ? (
              <p className="text-gray-600">
                La zona con menos ventas es{" "}
                <span className="font-bold text-gray-900">
                  {leastSalesZone[0].zone_name}
                </span>{" "}
                con un total de{" "}
                <span className="font-bold text-gray-900">
                  {leastSalesZone[0].total_sales_count}{" "}
                </span>
                productos alcanzando un valor total de{" "}
                <span className="font-bold text-gray-900">
                  ${leastSalesZone[0].total_sales.toFixed(2)}
                </span>
                .
              </p>
            ) : (
              <p className="text-gray-500">
                Cargando datos de zona con menos ventas...
              </p>
            )}
          </div>
        </div>

        {/* Zona con más ventas */}
        <div className="mb-6 flex-1">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Zona con Más Ventas
            </h3>
            {topSalesZone && topSalesZone.length > 0 ? (
              <p className="text-gray-600">
                La zona con más ventas es{" "}
                <span className="font-bold text-gray-900">
                  {topSalesZone[0].zone_name}
                </span>{" "}
                con un total de{" "}
                <span className="font-bold text-gray-900">
                  {topSalesZone[0].total_sales_count}{" "}
                </span>
                productos alcanzando un valor total de{" "}
                <span className="font-bold text-gray-900">
                  ${topSalesZone[0].total_sales.toFixed(2)}
                </span>
                .
              </p>
            ) : (
              <p className="text-gray-500">
                Cargando datos de zona con más ventas...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor padre con flex */}
      <div className="flex space-x-6">
        {/* Producto menos vendido */}
        <div className="mb-6 flex-1">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Producto Menos Vendido
            </h3>
            {leastSellingProduct && leastSellingProduct.length > 0 ? (
              <p className="text-gray-600">
                El producto menos vendido es{" "}
                <span className="font-bold text-gray-900">
                  {leastSellingProduct[0].product_name}
                </span>{" "}
                con una cantidad total de{" "}
                <span className="font-bold text-gray-900">
                  {leastSellingProduct[0].total_quantity_sold}
                </span>{" "}
                unidades.
              </p>
            ) : (
              <p className="text-gray-500">
                Cargando datos del producto menos vendido...
              </p>
            )}
          </div>
        </div>

        {/* Producto más vendido */}
        <div className="mb-6 flex-1">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Producto Más Vendido
            </h3>
            {topSellingProduct && topSellingProduct.length > 0 ? (
              <p className="text-gray-600">
                El producto más vendido es{" "}
                <span className="font-bold text-gray-900">
                  {topSellingProduct[0].product_name}
                </span>{" "}
                con un total de{" "}
                <span className="font-bold text-gray-900">
                  {topSellingProduct[0].total_quantity_sold}
                </span>{" "}
                unidades vendidas.
              </p>
            ) : (
              <p className="text-gray-500">
                Cargando datos del producto más vendido...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gráfico de los 10 compradores */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Top Compradores
          </h3>
          {topBuyersChart ? (
            <ApexCharts
              options={topBuyersChart.options}
              series={topBuyersChart.series}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-gray-500">Cargando gráfico de compradores...</p>
          )}
        </div>
      </div>

      {/* Comprador que más ha comprado */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Persona que más ha comprado
          </h3>
          {topBuyers && topBuyers.length > 0 ? (
            // console.log(topBuyers),
            
            <div className="text-gray-600">
              <p>
                <span className="font-bold text-gray-900">
                  {topBuyers[0].contact_first_name}{" "}
                  {topBuyers[0].contact_last_name}
                </span>
                , de la empresa{" "}
                <span className="font-bold text-gray-900">
                  {topBuyers[0].enterprise_name}
                </span>
                , ha comprado productos por un total de{" "}
                <span className="font-bold text-gray-900">
                  ${topBuyers[0].total_purchased.toLocaleString()}
                </span>
                .
              </p>
              <p>
                Productos comprados:{" "}
                <span className="italic text-gray-700">
                  {topBuyers[0].products_bought}
                </span>
              </p>
              {/* <p>
                Correo:{" "}
                <span className="text-blue-500">
                  {topBuyers[0].contact_email}
                </span>
              </p>
              <p>
                Teléfono: <span>{topBuyers[0].contact_phone}</span>
              </p> */}
            </div>
          ) : (
            <p className="text-gray-500">Cargando datos del comprador...</p>
          )}
        </div>
      </div>

      {/* Gráfico de los 10 vendedores */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Top Vendedores
          </h3>
          {topSellersChart ? (
            <ApexCharts
              options={topSellersChart.options}
              series={topSellersChart.series}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-gray-500">Cargando gráfico de vendedores...</p>
          )}
        </div>
      </div>

      {/* Gráfico de ventas mensuales */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Ventas del Mes
          </h3>
          {monthlySalesChart ? (
            <ApexCharts
              options={monthlySalesChart.options}
              series={monthlySalesChart.series}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-gray-500">
              Cargando gráfico de ventas mensuales...
            </p>
          )}
        </div>
      </div>

      {/* Vendedor que más ha vendido */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Persona que más ha vendido
          </h3>
          {topSellers && topSellers.length > 0 ? (
            <div className="text-gray-600">
              <p>
                <span className="font-bold text-gray-900">
                  {topSellers[0].seller_first_name}{" "}
                  {topSellers[0].seller_last_name}
                </span>
                , ha vendido un total de{" "}
                <span className="font-bold text-gray-900">
                  {topSellers[0].total_sales.toLocaleString()} productos
                </span>
                .
              </p>
              <p>
                Productos vendidos:{" "}
                <span className="italic text-gray-700">
                  {topSellers[0].products_sold}
                </span>
              </p>
              <p>
                Correo:{" "}
                <span className="text-blue-500">
                  {topSellers[0].seller_email}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Cargando datos del vendedor...</p>
          )}
        </div>
      </div>

      {/* Gráfico de los 10 productos más vendidos */}
      <div className="mb-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Top 10 Productos Más Vendidos
          </h3>
          {top10ProductsChart.series.length > 0 ? (
            <ApexCharts
              options={top10ProductsChart.options}
              series={top10ProductsChart.series}
              type="bar"
              height={350}
            />
          ) : (
            <p className="text-gray-500">
              Cargando gráfico de los 10 productos más vendidos...
            </p>
          )}
        </div>
      </div>

      {/* Tabla de ventas por productos */}
      <div className="overflow-x-auto">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Resumen de Ventas por Productos
          </h3>
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
    </div>
  );
};

export default Reportes;
