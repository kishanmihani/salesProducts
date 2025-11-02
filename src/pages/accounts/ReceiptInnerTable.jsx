import React from "react";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";

const vehicle_head = [
  "SN",
  "Customer Name",
  "Vehicle N0",
  "Actual Qty",
  "So No",
  "Entry Date",
  "Bill Amount",
  "Balance Amount",
  "Trf",
  "Recipt_ID",
];

export default function ReceiptInnerTable({
  tabs,
  innerData,
  selectedRows,
  setSelectedRows,
  hideRow=false
}) {
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
      <TableHead
        sx={{ fontWeight: 500, bgcolor: "rgba(240, 114, 223, 0.08)" }}
      >
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
        {innerData?.map((vRow, idx) => {
          const isTransferred = Number(vRow?.trf_flg) === 1;

          return (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: isTransferred ? "#f5f5f5" : "inherit", // light gray for locked rows
                transition: "background-color 0.3s ease",
              }}
            >

              {tabs === 1 && hideRow == false && (
                <TableCell>
                  <Checkbox
                    checked={selectedRows.some((r) => r.id === vRow.id)}
                    onChange={() => handleCheckboxChange(vRow)}
                    disabled={isTransferred} // ✅ disables when trf_flg = 1
                  />
                </TableCell>
              )}
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{vRow?.customer_Name}</TableCell>
              <TableCell>{vRow?.vehicle_Name}</TableCell>
              <TableCell>{vRow?.a_Qty}</TableCell>
              <TableCell>{vRow?.so_No}</TableCell>
              <TableCell>
                {dayjs(vRow?.entry_Date).format("DD-MM-YY")}
              </TableCell>
              <TableCell>{vRow?.b_Amount}</TableCell>
              <TableCell>{vRow?.b_Bal_Amount}</TableCell>
              <TableCell>{vRow?.trf_flg}</TableCell>
              <TableCell>{vRow?.id}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
