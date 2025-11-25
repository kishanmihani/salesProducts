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
  const [openRow, setOpenRow] = useState(null);
  const [custAlert, setCustAlert] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [selectedRows, setSelectedRows] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  // Fetch data once
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

  const handleTabs = (e, newValue) => {
    setTabs(newValue);
    setOpenRow(null);
    setPage(0);
    setSearchText("");    // reset search when switching tabs
    setFilteredData([]);  // reset filtered data
  };

  const showSuccess = (msg) => setCustAlert({ type: "success", message: msg });
  const showError = (msg) => setCustAlert({ type: "error", message: msg });
  const handleCloseAlert = () => setCustAlert(null);

  // Pick data based on tab
  const activeData =
    tabs === 0 ? tableData.api2 || [] :
    tabs === 1 ? tableData.api1 || [] :
    tableData.api3 || [];

  // Live Search (SO No + Customer Name)
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(activeData);
      return;
    }

    const result = activeData.filter((row) =>
      String(row?.so_No).toLowerCase().includes(searchText.toLowerCase()) ||
      String(row?.customer_Name).toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(result);
    setPage(0);
  }, [searchText, activeData]);

  // Final data before pagination
  const finalData = searchText ? filteredData : activeData;

  const paginatedData = finalData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Transfer Record Logic
  async function handleTransferCredit(row, text, totalAmount) {
    try {
      let res;

      if (text === "Advance Payments") {
        res = await api.post(
          "BituRep/Api/Account/Credit_RE_insert",
          JSON.stringify({
            user_id: userId,
            Customer_Name: row?.customer_Name,
            Entry_Date: dayjs(new Date()),
            Recipt_type: text,
            So_No: row?.so_No,
            Tds: 0,
            Log_id: 0,
            Amount: row.bal_Adv,
            
          })
        );
      } else if (text === "Cash Payments") {
        for (const item of selectedRows) {
          res = await api.post(
            "BituRep/Api/Account/Credit_RE_insert",
            JSON.stringify({
              user_id: userId,
              Customer_Name: item?.customer_Name,
              Entry_Date: item.entry_Date,
              Recipt_type: "Cash Payments",
              So_No: item?.so_No,
              Tds: 0,
              Log_id: item.id,
              Amount: item.b_Bal_Amount,
            })
          );
        }
      }

      showSuccess("Transferred successfully");
      await fetchTableData();
      setSelectedRows([]);

    } catch (err) {
      showError("Error transferring to credit");
    }
  }

  return (
    <>
      <CustomPageHeader pageHeaderText="Account List" />
      <Paper sx={{ p: 2 }} elevation={0}>

        {/* Tabs */}
        <AccountTabs tabs={tabs} handleTabs={handleTabs} tableData={tableData} />

        {/* Live Search */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search by SO No or Customer Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              padding: "8px",
              width: "280px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Table */}
        <AccountTable
          tabs={tabs}
          paginatedData={paginatedData}
          navigate={navigate}
          handleTransferCredit={handleTransferCredit}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          userId={userId}
          setOpenRow={setOpenRow}
          openRow={openRow}
        />

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[25, 50, 75, 100]}
          component="div"
          count={finalData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {custAlert && (
        <CustomeAlerts
          type={custAlert.type}
          message={custAlert.message}
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
}
