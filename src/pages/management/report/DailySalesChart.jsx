import React, { useState, useMemo } from "react";
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
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesChart = (props) => {
  const [selectedWeek, setSelectedWeek] = useState(1); // Default: Week 1
  // const [props.selectedDataset, setprops.selectedDataset] = useState("both"); // both | sales | avg
const naigate=useNavigate();
  // Function to get week number from date
  const getWeekOfMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  };

  // Filter data by selected week
  const filteredData = useMemo(() => {
    return props.data?.filter(
      (item) => getWeekOfMonth(item.date) === selectedWeek
    );
  }, [selectedWeek, props.date_Month, props.data]);

  // ✅ Conditionally set datasets
  const datasets = [];

  if (props.selectedDataset === "sales" || props.selectedDataset === "both") {
    datasets.push({
      label: "Sales Quantity",
      data: filteredData.map((item) => item.sale_Qty),
      backgroundColor: "#36A2EB",
      borderRadius: 6,
      barThickness: 20,
      categoryPercentage: 0.6,
      barPercentage: 0.7,
    });
  }

  if (props.selectedDataset === "avg" || props.selectedDataset === "both") {
    datasets.push({
      label: "Avg Selling Rate",
      data: filteredData.map((item) => item.avg_Selling_Rate),
      backgroundColor: "gray",
      borderRadius: 6,
      barThickness: 20,
      categoryPercentage: 0.6,
      barPercentage: 0.7,
    });
  }

  // Chart data
  const chartData = {
    labels: filteredData.map((item) =>
      new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets,
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${props.selectedDataset === "sales"? ` ${props.selectedDataset} Quantity - Week ${selectedWeek}`: `${props.selectedDataset} Rate  - Week ${selectedWeek} `} `,
      },
    },
    scales: {
      x: {
        ticks: { padding: 10 },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { padding: 10 },
        grid: { drawBorder: false },
      },
    },
  };
const handleViewDetails = () => {
    naigate("/Dashboard/management/graphtable", {
      state: {
        data: props.data,           // pass the full dataset or filteredData if needed
        pageTilte: props.selectedDataset === "sales"? ` ${props.selectedDataset} Quantity `: `${props.selectedDataset} Rate   `,     // pass the chart title
       selectedDataset : props.selectedDataset,
        varient: 3,                 // optional flag to distinguish chart types
      },
    });
  }
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        height: 550,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Filter Controls */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label style={{ marginRight: "10px", fontWeight: 500 }}>
          Select Week:
        </label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            marginRight: "20px",
          }}
        >
          <option value={1}>Week 1</option>
          <option value={2}>Week 2</option>
          <option value={3}>Week 3</option>
          <option value={4}>Week 4</option>
        </select>
        <Button variant="outlined" onClick={handleViewDetails}>View Details</Button>
        {/* <label style={{ marginRight: "10px", fontWeight: 500 }}>
          Select Dataset:
        </label>
        <select
          value={props.selectedDataset}
          onChange={(e) => setprops.selectedDataset(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: 6 }}
        >
          <option value="both">Both</option>
          <option value="sales">Sales Quantity</option>
          <option value="avg">Avg Selling Rate</option>
        </select> */}
      </div>

      {/* Chart */}
      <div style={{ flex: 1, height: 400 }}>
      <Bar data={chartData} options={options} /></div>
    </div>
  );
};

export default MonthlySalesChart;
