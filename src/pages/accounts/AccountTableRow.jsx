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
  userId,
  openRow,       // 👈 from parent
  setOpenRow,    // 👈 from parent
}) {
  const [innerData, setInnerData] = useState([]);

  const handleToggle = async () => {
    if (openRow === row.so_No) {
      setOpenRow(null); // close
    } else {
      setOpenRow(row.so_No); // open
      try {
        const res = await authAxios.post("BituRep/Api/Account/Recipt_Detail_View", {
          user_id: userId,
          So_No: row?.so_No,
        });
        setInnerData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const totalAmount = selectedRows.reduce(
    (sum, r) => Number(sum) + (Number(r?.b_Amount) || 0),
    0
  );

  return (
    <>
      <TableRow
        sx={{
          "&:hover": { backgroundColor: "grey.200" },
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        {/* Advance Payments */}
        {tabs === 0 && (
          <>
            <TableCell>{row?.so_No}</TableCell>
            <TableCell>{row?.customer_Name}</TableCell>
            <TableCell>{row?.port_Name}</TableCell>
            <TableCell>{row?.company_Name}</TableCell>
            <TableCell>{row?.adv_Value}</TableCell>
            <TableCell>{row?.rec}</TableCell>
            <TableCell>{row?.bal_Adv}</TableCell>
            <TableCell>
              <Button
                size="small"
                color="primary"
                onClick={() => handleTransferCredit(row, "Advance Payments", totalAmount)}
                variant="contained"
              >
                Transfer to Credit
              </Button>
            </TableCell>
            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  let data = {
                    so_no: row?.so_No,
                    customer: row.customer_Name,
                    Payment_Type: row?.payment_Type,
                  };
                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString();
                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}

        {/* Cash Payments */}
        {tabs === 1 && (
          <>
            <TableCell>{row?.so_No}</TableCell>
            <TableCell>{row?.customer_Name}</TableCell>
            <TableCell>{row?.port_Name}</TableCell>
            <TableCell>{row?.company_Name}</TableCell>
            <TableCell>{row?.amount}</TableCell>
            <TableCell>{row?.rec}</TableCell>
            <TableCell>{row?.bal_Adv}</TableCell>
            <TableCell>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => handleTransferCredit(row, "Cash Payments", totalAmount)}
              >
                Transfer to Credit
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={handleToggle}
                color={openRow === row.so_No ? "error" : "primary"}
                variant="outlined"
              >
                {openRow === row.so_No ? "Close" : "Open"}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  let data = {
                    so_no: row?.so_No,
                    customer: row?.customer_Name,
                    Payment_Type: "Cash Payments",
                  };
                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString();
                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}

        {/* Credit Payments */}
        {tabs === 2 && (
          <>
            <TableCell>{row?.so_No}</TableCell>
            <TableCell>{row?.customer_Name}</TableCell>
            <TableCell>{row?.port_Name}</TableCell>
            <TableCell>{row?.company_Name}</TableCell>
            <TableCell>{row?.amount}</TableCell>
            <TableCell>{row?.rec}</TableCell>
            <TableCell>{row?.bal_Adv}</TableCell>
            <TableCell>{row?.c_Days}</TableCell>
            <TableCell>{row?.payment_Type}</TableCell>
            <TableCell>
              <Button
                onClick={handleToggle}
                color={openRow === row.so_No ? "error" : "primary"}
                variant="outlined"
              >
                {openRow === row.so_No ? "Close" : "Open"}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                color="primary"
                onClick={() => {
                  let data = {
                    so_no: row?.so_No,
                    customer: row.customer_Name,
                    Payment_Type: row?.payment_Type,
                  };
                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString();
                  navigate(`/dashboard/Account/ReciptFrom?${query}`);
                }}
              >
                Receipt
              </Button>
            </TableCell>
          </>
        )}
      </TableRow>

      {/* Collapsible inner table */}
      {(tabs === 1 || tabs === 2) && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
            <Collapse in={openRow === row.so_No} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <TableContainer
                  elevation={0}
                  component={Paper}
                  style={{ overflow: "auto", minWidth: 800 }}
                >
                  <ReceiptInnerTable
                    tabs={tabs}
                    innerData={innerData}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
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
