import React, { useEffect, useState } from "react";
import { Paper, TablePagination } from "@mui/material";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { authAxios } from "../../component/utils/authAxios";
import CustomPageHeader from "../../component/commonComponent/CustomPageHeader/CustomPageHeader";
import CustomeAlerts from "../../component/commonComponent/CustomeAlert/CustomeAlert";
import { AccountAdvance, AccountCreditApi } from "../../component/Config/Api/Api";
import api from "../../component/Config/Api";

import AccountTabs from "./AccountTabs";
import AccountTable from "./AccountTable";

export default function AccountList() {
  const [tabs, setTabs] = useState(0);
  const [tableData, setTableData] = useState({ api1: [], api2: [], api3: [] });
  const [checkTableData, setCheckTableData] = useState(false);
  const [custAlert, setCustAlert] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);

  const navigate = useNavigate();
  const [userId] = useState(
    JSON.parse(sessionStorage.getItem("userInfo"))?.id
  );

  // Fetch data
  useEffect(() => {
    if (!checkTableData) fetchTableData();
  }, [checkTableData]);

  const fetchTableData = async () => {
    try {
      const [resOne, resTwo, resThree] = await Promise.all([
        authAxios.post("/BituRep/Api/Account/Account_CH", { user_id: userId, Role: "entry" }),
        authAxios.post(AccountAdvance, { user_id: userId }),
        authAxios.post(AccountCreditApi, { user_id: userId }),
      ]);

      setTableData({
        api1: resOne.data,
        api2: resTwo.data,
        api3: resThree.data,
      });
      setCheckTableData(true);
    } catch (err) {
      showError("Error fetching data");
    }
  };

  const handleTabs = (e, newValue) => setTabs(newValue);

  const showSuccess = (msg) => setCustAlert({ type: "success", message: msg });
  const showError = (msg) => setCustAlert({ type: "error", message: msg });
  const handleCloseAlert = () => setCustAlert(null);

  const activeData =
    tabs === 0 ? tableData.api2 || [] : tabs === 1 ? tableData.api1 || [] : tableData.api3 || [];

  const paginatedData = activeData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  async function handleTransferCredit(row, text, totalAmount) {
    try {
  debugger;

  for (const row of selectedRows) {
    const res = await api.post(
      "BituRep/Api/Account/Credit_RE_insert",
      JSON.stringify({
        user_id: userId,
        Customer_Name: row?.customer_Name,
        Entry_Date: row.entry_Date,
        Recipt_type: row.recipt_ID,
        So_No: row?.so_No,
        Tds: 0,
        Amount: row.b_Bal_Amount,
      })
    );
    console.log(`Transferred for SO No: ${row?.so_No}`);
  }

  showSuccess("All records transferred successfully");
  fetchTableData();
  setSelectedRows([]);

} catch (err) {
  console.error(err);
  showError("Error transferring to credit");
}
  }

  return (
    <>
      <CustomPageHeader pageHeaderText="Account List" />
      <Paper sx={{ p: 2 }} elevation={0}>
        {/* Tabs */}
        <AccountTabs tabs={tabs} handleTabs={handleTabs} tableData={tableData} />

        {/* Table */}
        <AccountTable
          tabs={tabs}
          paginatedData={paginatedData}
          navigate={navigate}
          handleTransferCredit={handleTransferCredit}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          userId={userId}
        />

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Alerts */}
      {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleCloseAlert} />
      )}
    </>
  );
}
