import React, { useCallback, useMemo } from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";

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
  billNumber,
  setBillNumber,
  onUpdateBill = () => {},
  updating = false,
}) {
  // Safety checks
  if (!Array.isArray(innerData)) innerData = [];
  if (!Array.isArray(selectedRows)) selectedRows = [];

  const toggleRowSelection = useCallback(
    (row) => {
      const updatedRow = { ...row, billNumber };

      setSelectedRows((prev) => {
        const alreadySelected = prev.some((r) => r.id === row.id);
        return alreadySelected
          ? prev.filter((r) => r.id !== row.id)
          : [...prev, updatedRow];
      });
    },
    [setSelectedRows, billNumber]
  );

  const rows = useMemo(
    () =>
      innerData.map((row, idx) => {
        const isTransferred =
          Number(row?.trf_flg) === 1 || Number(row?.b_Bal_Amount) === 0;

        return (
          <TableRow
            key={row.id || idx}
            sx={{
              backgroundColor: isTransferred ? "#f5f5f5" : "inherit",
            }}
          >
            {/* {tabs === 1 && !hideRow && (
              <TableCell>
                <Checkbox
                  checked={selectedRows.some((r) => r.id === row.id)}
                  onChange={() => toggleRowSelection(row)}
                  disabled={isTransferred}
                />
              </TableCell>
            )} */}

            <TableCell>{idx + 1}</TableCell>
            <TableCell>{row.customer_Name}</TableCell>
            <TableCell>{row.vehicle_Name}</TableCell>
            <TableCell>{row.a_Qty}</TableCell>
            <TableCell>{row.so_No}</TableCell>
            <TableCell>{dayjs(row.entry_Date).format("DD-MM-YY")}</TableCell>
            <TableCell>{row.b_Amount}</TableCell>
            <TableCell>{row.discount}</TableCell>
            <TableCell>{row.bal}</TableCell>
            <TableCell>{row.b_Amount_Used}</TableCell>
            <TableCell>{row.b_Bal_Amount}</TableCell>
            <TableCell>{row.trf_flg}</TableCell>
            <TableCell>{row.id}</TableCell>

            {/* Bill Number + Update Button */}
            <TableCell>
              <Box display="flex" alignItems="center" gap={1}>
                 <input
      type="text"
      placeholder="Enter Bill Number"
      value={billNumber[row.id] || ""}
      onChange={(e) =>
        setBillNumber((prev) => ({
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
  onClick={() => onUpdateBill()}
  disabled={updating}
  sx={{
    width: 32,
    height: 32,
    borderRadius: "8px",
    bgcolor: "primary.main",
    color: "#fff",
    "&:hover": { bgcolor: "primary.dark" },
  }}
>
  {updating ? (
    <CircularProgress size={18} color="inherit" />
  ) : (
    <SaveIcon fontSize="small" />
  )}
</IconButton>
              </Box>
            </TableCell>
          </TableRow>
        );
      }),
    [innerData, selectedRows, toggleRowSelection, billNumber, tabs, hideRow]
  );

  return (
    <>
      <Table size="small">
        <TableHead sx={{ bgcolor: "rgba(240, 114, 223, 0.08)" }}>
          <TableRow>
            {/* {tabs === 1 && !hideRow && <TableCell>Select</TableCell>} */}
            {tableHeaders.map((head) => (
              <TableCell key={head} sx={{ fontWeight: 600 }}>
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>{rows}</TableBody>
      </Table>
    </>
  );
}
