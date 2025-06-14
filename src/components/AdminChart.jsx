import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminChart({ ideas }) {
  
  const pendingCount = ideas?.filter(i => i.status === 'انتظار').length || 0;
  const acceptedCount = ideas?.filter(i => i.status === 'مقبولة').length || 0;
  const rejectedCount = ideas?.filter(i => i.status === 'مرفوضة').length || 0;

  const data = {
    labels: ['في الانتظار', 'مقبولة', 'مرفوضة'],
    datasets: [{
      label: 'عدد الأفكار',
      backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
      borderColor: ['#fbbf24', '#10b981', '#ef4444'],
      borderWidth: 1,
      data: [pendingCount, acceptedCount, rejectedCount],
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'إحصائيات الأفكار'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="mb-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">إحصاار</h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export default AdminChart;