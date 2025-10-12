import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

export default function SalesTable({ dateYear,selectedDataset }) {
  const [viewType, setViewType] = useState("weekly"); // "weekly" or "monthly"

  // Step 1: Parse and sort data
  const rawData = useMemo(() => 
    dateYear
      .map((item) => ({
        date: new Date(item.date),
        sale_Qty: Number(item.sale_Qty),
        avg_Selling_Rate: Number(item.avg_Selling_Rate),
      }))
      .sort((a, b) => a.date - b.date),
    [dateYear]
  );

  // Step 2: Weekly aggregation
  const weeklyData = useMemo(() => {
    const result = [];
    let weekIndex = 1;
    let currentWeekStart = rawData[0]?.date;

    rawData.forEach((item) => {
      const diffDays = Math.floor(
        (item.date - currentWeekStart) / (1000 * 60 * 60 * 24)
      );

      if (diffDays >= 7) {
        weekIndex++;
        currentWeekStart = item.date;
      }

      const existingWeek = result.find((w) => w.week === `Week ${weekIndex}`);
      if (existingWeek) {
        existingWeek.total_Qty += item.sale_Qty;
        existingWeek.total_Rate += item.avg_Selling_Rate;
        existingWeek.count++;
      } else {
        result.push({
          week: `Week ${weekIndex}`,
          total_Qty: item.sale_Qty,
          total_Rate: item.avg_Selling_Rate,
          count: 1,
        });
      }
    });

    return result.map((w) => ({
      label: w.week,
      sale_Qty: w.total_Qty,
      avg_Selling_Rate: Math.round(w.total_Rate / w.count),
    }));
  }, [rawData]);

  // Step 3: Monthly aggregation
  const monthlyData = useMemo(() => {
    const monthMap = {};
    rawData.forEach((item) => {
      const monthYear = item.date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!monthMap[monthYear]) {
        monthMap[monthYear] = { total_Qty: 0, total_Rate: 0, count: 0 };
      }

      monthMap[monthYear].total_Qty += item.sale_Qty;
      monthMap[monthYear].total_Rate += item.avg_Selling_Rate;
      monthMap[monthYear].count++;
    });

    return Object.entries(monthMap).map(([month, data]) => ({
      label: month,
      sale_Qty: data.total_Qty,
      avg_Selling_Rate: Math.round(data.total_Rate / data.count),
    }));
  }, [rawData]);

  const displayData = viewType === "weekly" ? weeklyData : monthlyData;

  return (
    <Paper sx={{ p: 2 }} style={{height:450}}>
      <div style={{ marginBottom: 16 }}>
        <Button
          variant={viewType === "weekly" ? "contained" : "outlined"}
          onClick={() => setViewType("weekly")}
          sx={{ mr: 1 }}
        >
          Weekly
        </Button>
        <Button
          variant={viewType === "monthly" ? "contained" : "outlined"}
          onClick={() => setViewType("monthly")}
        >
          Monthly
        </Button>
      </div>

      <TableContainer component={Paper} >
        <Table>
          <TableHead sx={{ backgroundColor: "#f4cccc" }}>
            <TableRow>
              <TableCell >{viewType === "weekly" ? "Week" : "Month"}</TableCell>
              
              {selectedDataset === "sales" && <TableCell align="right">Sale Quantity</TableCell>}
              {selectedDataset === "avg" && <TableCell align="right">Avg Selling Rate</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((row) => (
              <TableRow key={row.label}>
                <TableCell  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#fff2cc",
                    textAlign: "center",
                  }}>{row.label}</TableCell>
              {selectedDataset === "sales" &&  <TableCell align="right">{row.sale_Qty}</TableCell>}
               {selectedDataset === "avg" && <TableCell align="right">{row.avg_Selling_Rate}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
