import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Button } from "@mui/material";

// Register components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const InventoryDaysChart = () => {
  const data = {
    labels: ["Available", "Used", "Pending"],
    datasets: [
      {
        label: "Inventory Days",
        data: [50, 30, 20],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        borderWidth: 0,
        cutout: "70%", // creates center gap
        circumference: 180, // half chart (semi-circle)
        rotation: 270, // starts from bottom center
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 13 },
        },
      },
      title: {
        display: false,
        text: "Inventory Days Chart",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "450px",
        // margin: "auto",
        position: "relative",
        padding: 20,
        height:350,
    backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div className="flex">
        <h3>Inventory Days Chart</h3>
        <Button variant="outlined">View Details</Button>
      </div>
      
      <Doughnut data={data} options={options} />
      {/* Optional center text */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "16px", margin: 0 }}>Total Days</p>
        <h2 style={{ margin: 0, color: "#333" }}>100</h2>
      </div>
    </div>
  );
};

export default InventoryDaysChart;
