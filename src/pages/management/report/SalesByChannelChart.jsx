import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SalesByChannelChart = () => {
  // 👇 Customize your channels and data here
  const data = {
    labels: [
      "Online Store",
      "Retail Outlet",
      "Wholesale",
      "Partner Sales",
      "Direct Sales",
    ],
    datasets: [
      {
        label: "Sales by Channel (₹)",
        data: [7200, 5400, 3100, 4500, 6200], // sales values
        backgroundColor: [
          "#4cc9f0",
          "#4361ee",
          "#7209b7",
          "#f72585",
          "#b5179e",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 12,
            weight: "bold",
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Sales by Channel",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        height: 350,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
};

export default SalesByChannelChart;