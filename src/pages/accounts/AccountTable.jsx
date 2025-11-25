import React,{useState} from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AccountTableRow from "./AccountTableRow";

const cashHeaders = [
 "Date","Remark", "So No", "Customer Name", "Port Name", "Company name",
  "Amount", "Recived", "Balance", "Transfer to Credit", "Receipt Details", "Receipt"
];

const advanceHeaders = [
  "Date","Remark","So No", "Customer Name", "Port Name", "Company name",
  "Advance", "Recived", "Balance", "Transfer to Credit", "Receipt"
];

const creditHeaders = [
  "Date","Remark","So No.", "Customer Name", "Port Name", "Company Name",
  "Amount", "Recived", "Balance", "Credit Days", "Payments Type", "Receipt Details", "Recipt"
];

export default function AccountTable({
  tabs,
  paginatedData,
  navigate,
  handleTransferCredit,
  selectedRows,
  setSelectedRows,
  userId,
  openRow,
  setOpenRow,
}) {
  const activeHeaders = tabs === 0 ? advanceHeaders : tabs === 1 ? cashHeaders : creditHeaders;
  console.log(paginatedData,"gjk")
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            {activeHeaders.map((header, index) => (
              <TableCell
                key={index}
                align="left"
                sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row,index) => (
            <AccountTableRow
              key={row?.so_No+index}
              // id={row?.so_No+ tabs}
              row={row}
              tabs={tabs}
              navigate={navigate}
              handleTransferCredit={handleTransferCredit}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              userId={userId}
              openRow={openRow}        // pass down
          setOpenRow={setOpenRow}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
