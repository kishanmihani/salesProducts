import React, { useState, useCallback } from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
import formatDateToUS from "../../component/utils/DateFormate";

const tableHeaders = [
  "SN",
  "Customer Name",
  "Vehicle No",
  "Actual Qty",
  "SO No",
  "Entry Date",
  "Invoice Amt",
  "Credit Note",
  "Total Due",
  "Payment Rec",
  "Balance Amt",
  "Trf",
  "Receipt ID",
  "Bill Number",
];

export default function ReceiptInnerTable({
  tabs = 1,
  hideRow = false,
  innerData = [],
  selectedRows = [],
  setSelectedRows,
  billNumbers,
  setBillNumbers,
  onUpdateBill = async () => {},
  updatingRows = {},
}) {
  // Toggle row selection
  const toggleRowSelection = useCallback(
    (row) => {
      setSelectedRows((prev) => {
        const exists = prev.some((r) => r.id === row.id);
        return exists
          ? prev.filter((r) => r.id !== row.id)
          : [...prev, row];
      });
    },
    [setSelectedRows]
  );

  // Click handler
  const handleUpdateClick = async (rowId) => {
    const billValue = billNumbers[rowId] || "";
    await onUpdateBill(rowId, billValue);
  };

  return (
    <Table size="small">
      <TableHead sx={{ bgcolor: "rgba(240, 114, 223, 0.08)" }}>
        <TableRow>
          {tabs === 1 && !hideRow && <TableCell>Select</TableCell>}

          {tableHeaders.map((head) => (
            <TableCell key={head} sx={{ fontWeight: 600 }}>
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {innerData.map((row, idx) => {
          const isUpdating = updatingRows[row.id] || false;

          return (
            <TableRow key={row.id}>
              {tabs === 1 && !hideRow && (
                <TableCell>
                  <Checkbox
                    checked={selectedRows.some((r) => r.id === row.id)}
                    onChange={() => toggleRowSelection(row)}
                  />
                </TableCell>
              )}

              <TableCell>{idx + 1}</TableCell>
              <TableCell>{row.customer_Name}</TableCell>
              <TableCell>{row.vehicle_Name}</TableCell>
              <TableCell>{row.a_Qty}</TableCell>
              <TableCell>{row.so_No}</TableCell>
              <TableCell>{formatDateToUS(row.entry_Date)}</TableCell>
              <TableCell>{row.b_Amount}</TableCell>
              <TableCell>{row.discount}</TableCell>
              <TableCell>{row.bal}</TableCell>
              <TableCell>{row.b_Amount_Used}</TableCell>
              <TableCell>{row.b_Bal_Amount}</TableCell>
              <TableCell>{row.trf_flg}</TableCell>
              <TableCell>{row.id}</TableCell>

              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    type="text"
                    placeholder={row.bill || "Enter Bill Number"}
                    value={billNumbers[row.id] || ""}
                    onChange={(e) =>
                      setBillNumbers((prev) => ({
                        ...prev,
                        [row.id]: e.target.value,
                      }))
                    }
                    style={{
                      padding: 6,
                      width: 200,
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />

                  <IconButton
                    onClick={() => handleUpdateClick(row.id)}
                    disabled={isUpdating}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      bgcolor: "primary.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SaveIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
