import React from "react";
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";

const vehicle_head = [
  "S.N", "Customer Name", "Vehicle Name", "Actual Qty", "So No",
  "Entry Date", "Bill Amount", "Bill Bal Amount", "Bill P Flag", "Recipt ID"
];

export default function ReceiptInnerTable({ tabs, innerData, selectedRows, setSelectedRows }) {
  const handleCheckboxChange = (row) => {
    setSelectedRows((prev) => {
      if (prev.find((r) => r.id === row.id)) {
        return prev.filter((r) => r.id !== row.id);
      } else {
        return [...prev, row];
      }
    });
  };

  return (
    <Table size="small">
      <TableHead sx={{ fontWeight: 500, bgcolor: "rgba(240, 114, 223, 0.08)" }}>
        <TableRow>
          {tabs === 1 && <TableCell>Select</TableCell>}
          {vehicle_head.map((head, index) => (
            <TableCell
              key={index}
              align="left"
              sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}
            >
              {head}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {innerData?.map((vRow, idx) => (
          <TableRow key={idx}>
            {tabs === 1 && (
              <TableCell>
                <Checkbox
                  checked={selectedRows.some((r) => r.id === vRow.id)}
                  onChange={() => handleCheckboxChange(vRow)}
                />
              </TableCell>
            )}
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{vRow?.customer_Name}</TableCell>
            <TableCell>{vRow?.vehicle_Name}</TableCell>
            <TableCell>{vRow?.a_Qty}</TableCell>
            <TableCell>{vRow?.so_No}</TableCell>
            <TableCell>{dayjs(vRow?.entry_Date).format("DD-MM-YYYY")}</TableCell>
            <TableCell>{vRow?.b_Amount}</TableCell>
            <TableCell>{vRow?.b_Bal_Amount}</TableCell>
            <TableCell>{vRow?.b_P_Flag}</TableCell>
            <TableCell>{vRow?.recipt_ID}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
