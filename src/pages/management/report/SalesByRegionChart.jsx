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
import { ResponsiveContainer } from "recharts";
import { Button } from "@mui/material";
import { Navigate, useNavigate } from "react-router";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesByRegionChart = ({ data = [], selectedDataset = "both" }) => {
  // console.log(data);
 const naigate=useNavigate();
  // Conditional datasets
  const datasets =
    selectedDataset === "sales"
      ? [
          {
            label: "Sales Quantity",
            data: data.map((item) => item.sale_Qty),
            backgroundColor: "#36A2EB",
            borderRadius: 8,
            barThickness: 20,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
        ]
      : selectedDataset === "avg"
      ? [
          {
            label: "Avg Selling Rate",
            data: data.map((item) => item.avg_Selling_Rate),
            backgroundColor: "gray",
            borderRadius: 8,
            barThickness: 20,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
        ]
      : [
          {
            label: "Sales Quantity",
            data: data.map((item) => item.sale_Qty),
            backgroundColor: "#36A2EB",
            borderRadius: 8,
            barThickness: 20,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
          {
            label: "Avg Selling Rate",
            data: data.map((item) => item.avg_Selling_Rate),
            backgroundColor: "gray",
            borderRadius: 8,
            barThickness: 20,
            categoryPercentage: 0.6,
            barPercentage: 0.7,
          },
        ];

  const chartData = {
    labels: data.map((item) => item.port || "N/A"),
    datasets,
  };

  const options = {
    indexAxis: "y", // Horizontal chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
        text: selectedDataset ==="sales"? "Sales Amount by Region" : "Avg Rate by Region",
        font: {
          size: 16,
        },
      },
      
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`,
        },
        title: {
          display: true,
          text: "Sales Amount",
          font: { size: 13 },
        },
      },
      y: {
        title: {
          display: true,
          text: "Region",
          font: { size: 13 },
        },
      },
    },
  };
 const handleViewDetails = () => {
  const pageTilte=selectedDataset ==="sales"? "Sales Amount by Region" : "Avg Rate by Region";
    naigate("/Dashboard/management/graphtable", {
      state: { data, pageTilte,varient:1 ,selectedDataset},
    });
  }
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        // maxWidth: 600,
        height: 450,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        margin: "auto",
      }}
    >
      <h3 style={{margin: "auto",width:"100%"}}>{selectedDataset ==="sales"? "Sales Amount by Region" : "Avg Rate by Region"} <Button variant="outlined" onClick={handleViewDetails}>View Details</Button></h3>
      
      <div style={{ width: "100%", height: 350 }}>
        {/* <ResponsiveContainer> */}
        <Bar data={chartData} options={options} />
        {/* </ResponsiveContainer> */}
      </div>
    </div>
  );
};

export default SalesByRegionChart;
