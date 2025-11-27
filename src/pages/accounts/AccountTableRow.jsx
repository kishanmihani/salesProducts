import React, { useState } from "react";
import {
  Button,
  Collapse,
  List,
  Paper,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
import ReceiptInnerTable from "./ReceiptInnerTable";
import { authAxios } from "../../component/utils/authAxios";

export default function AccountTableRow({
  row,
  tabs,
  navigate,
  handleTransferCredit,
  selectedRows,
  setSelectedRows,
  openRow,
  setOpenRow,
}) {
  const [innerData, setInnerData] = useState([]);
  const [billNumbers, setBillNumbers] = useState({});
  const [updatingRows, setUpdatingRows] = useState({});
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  // -------------------------------------------------------------
  // LOAD INNER TABLE CONTENTS
  // -------------------------------------------------------------
  const loadInnerData = async () => {
    try {
      const res = await authAxios.post(
        "BituRep/Api/Account/Recipt_Detail_View",
        {
          user_id: userId,
          So_No: row.so_No,
        }
      );

      const rowsWithId = res.data.map((r) => ({ ...r, table_id: r.id }));
      setInnerData(rowsWithId);
    } catch (err) {
      console.log("INNER LOAD ERROR:", err);
    }
  };

  const handleToggle = async () => {
    if (openRow === row.so_No) {
      setOpenRow(null);
      return;
    }

    setOpenRow(row.so_No);
    await loadInnerData();
  };

  // -------------------------------------------------------------
  // UPDATE BILL + REFRESH TABLE
  // -------------------------------------------------------------
  const handleUpdateBill = async (id, bill) => {
    if (!bill.trim()) {
      alert("Enter Bill Number");
      return;
    }

    setUpdatingRows((prev) => ({ ...prev, [id]: true }));

    try {
      await authAxios.post(
        "BituRep/Api/Account/Account_bill_Update",
        JSON.stringify({
          user_id: userId,
          Table_id: id,
          Bill: bill,
        })
      );

      alert(`Bill ${bill} updated successfully`);

      // 🔵 REFRESH TABLE AFTER SAVE
      await loadInnerData();
    } catch (err) {
      console.log(err);
      alert("Error updating bill");
    }

    setUpdatingRows((prev) => ({ ...prev, [id]: false }));
  };

  const totalAmount = selectedRows.reduce(
    (sum, r) => Number(sum) + (Number(r?.b_Amount) || 0),
    0
  );

  // -------------------------------------------------------------
  // RENDER MAIN TABLE ROW
  // -------------------------------------------------------------
  return (
    <>
      <TableRow sx={{ "&:hover": { backgroundColor: "grey.200" } }}>
        <TableCell>
          {new Date(row?.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })}
        </TableCell>

        <TableCell>{row.remark}</TableCell>
        <TableCell>{row.so_No}</TableCell>
        <TableCell>{row.customer_Name}</TableCell>
        <TableCell>{row.port_Name}</TableCell>
        <TableCell>{row.company_Name}</TableCell>

        {tabs === 0 && (
          <>
            <TableCell>{row.adv_Value}</TableCell>
            <TableCell>{row.rec}</TableCell>
            <TableCell>{row.bal_Adv}</TableCell>

            <TableCell>
              <Button
                size="small"
                variant="contained"
                onClick={() =>
                  handleTransferCredit(row, "Advance Payments", totalAmount)
                }
              >
                Transfer
              </Button>
            </TableCell>

            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  const query = new URLSearchParams({
                    data: JSON.stringify({
                      so_no: row.so_No,
                      customer: row.customer_Name,
                      Payment_Type: row.payment_Type,
                    }),
                  }).toString();

                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}

        {tabs === 1 && (
          <>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.rec}</TableCell>
            <TableCell>{row.bal_Adv}</TableCell>

            <TableCell>
              <Button
                size="small"
                variant="contained"
                disabled={!(openRow === row.so_No)}
                onClick={() =>
                  handleTransferCredit(row, "Cash Payments", totalAmount)
                }
              >
                Transfer
              </Button>
            </TableCell>

            <TableCell>
              <Button
                variant="outlined"
                color={openRow === row.so_No ? "error" : "primary"}
                onClick={handleToggle}
              >
                {openRow === row.so_No ? "Close" : "Open"}
              </Button>
            </TableCell>

            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  const query = new URLSearchParams({
                    data: JSON.stringify({
                      so_no: row.so_No,
                      customer: row.customer_Name,
                      Payment_Type: "Cash Payments",
                    }),
                  }).toString();

                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}

        {tabs === 2 && (
          <>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.rec}</TableCell>
            <TableCell>{row.bal_Adv}</TableCell>
            <TableCell>{row.c_Days}</TableCell>
            <TableCell>{row.payment_Type}</TableCell>

            <TableCell>
              <Button
                variant="outlined"
                color={openRow === row.so_No ? "error" : "primary"}
                onClick={handleToggle}
              >
                {openRow === row.so_No ? "Close" : "Open"}
              </Button>
            </TableCell>

            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  const query = new URLSearchParams({
                    data: JSON.stringify({
                      so_no: row.so_No,
                      customer: row.customer_Name,
                      Payment_Type: row.payment_Type,
                    }),
                  }).toString();

                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}
      </TableRow>

      {/* INNER TABLE */}
      {openRow === row.so_No && (tabs === 1 || tabs === 2) && (
        <TableRow>
          <TableCell colSpan={16} sx={{ padding: 0 }}>
            <Collapse in timeout="auto" unmountOnExit>
              <List disablePadding>
                <TableContainer component={Paper} elevation={0}>
                  <ReceiptInnerTable
                    tabs={tabs}
                    innerData={innerData}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    billNumbers={billNumbers}
                    setBillNumbers={setBillNumbers}
                    onUpdateBill={handleUpdateBill}
                    updatingRows={updatingRows}
                  />
                </TableContainer>
              </List>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
