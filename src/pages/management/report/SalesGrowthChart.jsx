import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesGrowthChart = (props) => {
  const { data = [], selectedDataset = "both" } = props;

  // ✅ Conditional datasets
  const datasets =
    selectedDataset === "sales"
      ? [
          {
            label: "Sales Quantity",
            data: data.map((item) => item?.sale_Qty),
            backgroundColor: "#4cc9f0",
            borderRadius: 6,
            barThickness: 20,
          },
        ]
      : selectedDataset === "avg"
      ? [
          {
            label: "Avg Selling Rate",
            data: data.map((item) => item?.avg_Selling_Rate),
            backgroundColor: "#3d4041ff",
            borderRadius: 6,
            barThickness: 20,
          },
        ]
      : [
          {
            label: "Sales Quantity",
            data: data.map((item) => item?.sale_Qty),
            backgroundColor: "#4cc9f0",
            borderRadius: 6,
            barThickness: 20,
          },
          {
            label: "Avg Selling Rate",
            data: data.map((item) => item?.avg_Selling_Rate),
            backgroundColor: "#3d4041ff",
            borderRadius: 6,
            barThickness: 20,
          },
        ];

  const chartData = {
    labels: data.map((item) => item?.party_Name),
    datasets,
  };

  const options = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
        text: selectedDataset ==="sales"?"Monthly Sales Growth (2025)":"Monthly Avg Rate Growth (2025)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.x || 0;
            return `Sales: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: selectedDataset ==="sales"?"Sales Amount (₹)":"Avg Amount (₹)",
        },
        ticks: {
          stepSize: 1000,
        },
        grid: {
          color: "#e0e0e0",
        },
      },
      y: {
        grid: {
          display: false,
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
        height: 450,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlySalesGrowthChart;
