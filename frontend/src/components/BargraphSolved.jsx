import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import request from "../control/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TagBarGraph = () => {
  const [tagData, setTagData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get('/tagdata',{withCredentials: true})
      .then(response => {
        setTagData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: Object.keys(tagData),
    datasets: [
      {
        label: 'Number of Problems Solved',
        data: Object.values(tagData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <h2>Problems Solved by Tag</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TagBarGraph;
