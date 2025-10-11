import { Box, Button } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const YearlySalesLineChart = ({ data, title = "Yearly Sales Performance" ,selectedDataset}) => {
  // const [selectedDataset, setSelectedDataset] = useState("both"); // both | sales | avg
const naigate=useNavigate();
  // ✅ Format and sort data
  const formattedData = useMemo(() => {
    
    return (
      data
        ?.map((item) => ({
          date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          sale_Qty: Number(item.sale_Qty),
          avg_Selling_Rate: Number(item.avg_Selling_Rate),
        }))
        .sort(
          (a, b) =>
            new Date(a.date.split("/").reverse().join("-")) -
            new Date(b.date.split("/").reverse().join("-"))
        ) || []
    );
  }, [data]);
const handleViewDetails = () => {
    naigate("/Dashboard/management/graphtable", {
      state: {
        data,
        pageTilte: title,
        selectedDataset,
        varient: 3, // optional: distinguish line chart vs bar chart
      },
    });
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
      {/* Chart Title */}
      <h3
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: 10,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {title}  <Button variant="outlined" onClick={handleViewDetails}>View Details</Button>
      </h3>

      {/* Dataset selection dropdown */}
      {/* <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label style={{ marginRight: "10px", fontWeight: 500 }}>
          Select Dataset:
        </label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="both">Both</option>
          <option value="sales">Sales Quantity</option>
          <option value="avg">Avg Selling Rate</option>
        </select>
      </div> */}

      {/* Line Chart */}
     <Box sx={{ flex: 1,height:400 }}> 
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 12 }} />
          <YAxis tick={{ fill: "#666", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />

          {/* Conditionally render lines */}
          {(selectedDataset === "sales" || selectedDataset === "both") && (
            <Line
              type="monotone"
              dataKey="sale_Qty"
              stroke="#36A2EB"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Sales Quantity"
            />
          )}

          {(selectedDataset === "avg" || selectedDataset === "both") && (
            <Line
              type="monotone"
              dataKey="avg_Selling_Rate"
              stroke="gray"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Avg Selling Rate"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
</Box>    </div>
  );
};

export default YearlySalesLineChart;
