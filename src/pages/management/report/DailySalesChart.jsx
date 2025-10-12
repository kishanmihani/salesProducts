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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlySalesChart = (props) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const navigate = useNavigate();

  // Function to get week number from date
  const getWeekOfMonth = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  };

  // ✅ Filter + Sort data by selected week and date
  const filteredData = useMemo(() => {
    const weekData = props.data?.filter(
      (item) => getWeekOfMonth(item.date) === selectedWeek
    );
    // Sort by actual date ascending
    return weekData?.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedWeek, props.data]);

  // ✅ Prepare datasets
  const datasets = [];

  if (props.selectedDataset === "sales" || props.selectedDataset === "both") {
    datasets.push({
      label: "Sales Quantity",
      data: filteredData.map((item) => Number(item.sale_Qty) || 0),
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
      data: filteredData.map((item) => Number(item.avg_Selling_Rate) || 0),
      backgroundColor: "gray",
      borderRadius: 6,
      barThickness: 20,
      categoryPercentage: 0.6,
      barPercentage: 0.7,
    });
  }

  // ✅ Chart data
  const chartData = {
    labels: filteredData.map((item) =>
      new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text:
          props.selectedDataset === "sales"
            ? `Sales Quantity - Week ${selectedWeek}`
            : props.selectedDataset === "avg"
            ? `Average Selling Rate - Week ${selectedWeek}`
            : `Sales & Avg Rate - Week ${selectedWeek}`,
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
    navigate("/Dashboard/management/graphtable", {
      state: {
        data: props.data,
        pageTilte:
          props.selectedDataset === "sales"
            ? "Sales Quantity"
            : props.selectedDataset === "avg"
            ? "Average Selling Rate"
            : "Sales and Avg Rate",
        selectedDataset: props.selectedDataset,
        varient: 3,
      },
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        width: "100%",
        height: 550,
        padding: 20,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Week Filter */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label style={{ marginRight: "10px", fontWeight: 500 }}>Select Week:</label>
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
        <Button variant="outlined" onClick={handleViewDetails}>
          View Details
        </Button>
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlySalesChart;
