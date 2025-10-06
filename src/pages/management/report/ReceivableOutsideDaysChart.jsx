import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ReceivableOutsideDaysChart = () => {
  const data = {
    labels: ["0-30 Days", "31-60 Days", "61-90 Days", "90+ Days"],
    datasets: [
      {
        label: "Receivable Days",
        data: [45, 25, 15, 15],
        backgroundColor: [
          "#4CC9F0", // light blue
          "#4895EF", // medium blue
          "#FFB703", // orange
          "#FB5607", // red
        ],
        borderWidth: 0,
        cutout: "70%",        // center gap
        circumference: 180,   // half pie (semi-doughnut)
        rotation: 270,        // start from bottom center
      },
    ],
  };

  // Calculate total days dynamically
  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 13 },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Receivable Outside Days",
        font: { size: 18, weight: "bold" },
        color: "#333",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed} Days`,
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        // margin: "auto",
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 350,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: 20,
      }}
    >
      <Doughnut data={data} options={options} />
      {/* Center total label */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", margin: 0, color: "#666" }}>Total Days</p>
        <h2 style={{ margin: 0, color: "#333" }}>{total}</h2>
      </div>
    </div>
  );
};

export default ReceivableOutsideDaysChart;
