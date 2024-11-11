import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar los elementos de la gráfica de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [period, setPeriod] = useState('Mes');

  const data = {
    labels: ['Enero 2020', 'Febrero 2020'],
    datasets: [
      {
        label: 'Perillas',
        backgroundColor: 'rgba(192,192,192,0.8)',
        data: [120, 80],
      },
      {
        label: 'Manijas Ajustables',
        backgroundColor: 'rgba(0, 51, 102, 0.8)',
        data: [200, 150],
      },
      {
        label: 'Clamps',
        backgroundColor: 'rgba(0, 102, 204, 0.8)',
        data: [180, 170],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Ventas - ${period}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div  style={{ padding: '20px', backgroundColor: '#F0F0F0', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <button 
          onClick={() => setPeriod('Mes')}
          style={{ 
            margin: '0 5px', 
            padding: '10px', 
            backgroundColor: period === 'Mes' ? '#0056D2' : '#E0E0E0', 
            border: 'none', 
            borderRadius: '5px', 
            color: period === 'Mes' ? '#fff' : '#000' 
          }}>
          Mes
        </button>
        <button 
          onClick={() => setPeriod('Semestral')}
          style={{ 
            margin: '0 5px', 
            padding: '10px', 
            backgroundColor: period === 'Semestral' ? '#0056D2' : '#E0E0E0', 
            border: 'none', 
            borderRadius: '5px', 
            color: period === 'Semestral' ? '#fff' : '#000' 
          }}>
          Semestral
        </button>
        <button 
          onClick={() => setPeriod('Anual')}
          style={{ 
            margin: '0 5px', 
            padding: '10px', 
            backgroundColor: period === 'Anual' ? '#0056D2' : '#E0E0E0', 
            border: 'none', 
            borderRadius: '5px', 
            color: period === 'Anual' ? '#fff' : '#000' 
          }}>
          Anual
        </button>
      </div>

      <Bar data={data} options={options} />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={{ padding: '10px 20px', backgroundColor: '#0056D2', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Más detalles
        </button>
      </div>
    </div>
  );
};

export default SalesChart;
