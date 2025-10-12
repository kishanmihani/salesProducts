import React, { useMemo } from "react";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const SoldQuantityTable = ({ data,selectedDataset }) => {
  const processed = useMemo(() => {
    if (!data || data.length === 0) return {};

    const weekData = {
      1: { days: {}, total: 0 },
      2: { days: {}, total: 0 },
      3: { days: {}, total: 0 },
      4: { days: {}, total: 0 },
      5: { days: {}, total: 0 },
    };

    let totalQty = 0;
    let dayCount = 0;

    data.forEach((entry) => {
      const date = dayjs(entry.date);
      const dayOfMonth = date.date();

      // Determine week number (7-day intervals)
      const week = Math.ceil(dayOfMonth / 7);
      const dayName = date.format("dddd");
      let qty;
      if(selectedDataset==="avg"){
         qty = parseFloat(entry.avg_Selling_Rate || 0);
      }else {
       qty = parseFloat(entry.sale_Qty || 0);
      }

      if (weekData[week]) {
        weekData[week].days[dayName] = (weekData[week].days[dayName] || 0) + qty;
        weekData[week].total += qty;
      }

      totalQty += qty;
      dayCount++;
    });

    const avgQty = totalQty / dayCount;
    return { weekData, totalQty, avgQty };
  }, [data]);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <Box >
      {/* <Typography
        variant="h6"
        align="center"
        sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
      >
        Sold Quantity During The Month
      </Typography> */}

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f4cccc" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", textAlign: "center", width: "150px" }}
              >
                Day
              </TableCell>
              {[1, 2, 3, 4, 5].map((week) => (
                <TableCell
                  key={week}
                  sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Week {week}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {daysOfWeek.map((day) => (
              <TableRow key={day}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#fff2cc",
                    textAlign: "center",
                  }}
                >
                  {day}
                </TableCell>

                {[1, 2, 3, 4, 5].map((week) => (
                  <TableCell key={week} align="center">
                    {processed.weekData?.[week]?.days[day]
                      ? processed.weekData[week].days[day].toFixed(2)
                      : 0}
                  </TableCell>
                ))}

                <TableCell align="center">
                  {Object.values(processed.weekData || {})
                    .reduce((sum, wk) => sum + (wk.days[day] || 0), 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow sx={{ backgroundColor: "#d9ead3" }}>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Weekly Total
              </TableCell>

              {[1, 2, 3, 4, 5].map((week) => (
                <TableCell
                  key={week}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {processed.weekData?.[week]?.total
                    ? processed.weekData[week].total.toFixed(2)
                    : 0}
                </TableCell>
              ))}

              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {processed.totalQty?.toFixed(2) || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
{selectedDataset!=="avg" &&
      <Box sx={{ mt: 3, textAlign: "center",display:"flex",gap:4 }}>
        <Typography sx={{ fontWeight: "bold" }}>
          Total Quantity Sold: {processed.totalQty?.toFixed(2) || 0}
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>
          Avg Sold Qty per Day: {processed.avgQty?.toFixed(2) || 0}
        </Typography>
      </Box>}
    </Box>
  );
};

export default SoldQuantityTable;
