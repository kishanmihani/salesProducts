import React, { useEffect, useState, useMemo } from "react";
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
import SearchInput from "../../component/commonComponent/SearchInput/SearchInput";

export default function AccountList() {
  const navigate = useNavigate();
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  // Tabs & table data
  const [tabs, setTabs] = useState(0);
  const [tableData, setTableData] = useState({ api1: [], api2: [], api3: [] });
  const [dataLoaded, setDataLoaded] = useState(false);

  // Alerts
  const [custAlert, setCustAlert] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Row selection
  const [selectedRows, setSelectedRows] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  // Search
  const [searchText, setSearchText] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("entry_Date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch all 3 APIs
  useEffect(() => {
    if (!dataLoaded) fetchTableData();
  }, [dataLoaded]);

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

      setDataLoaded(true);
    } catch (err) {
      showError("Error fetching data");
    }
  };

  // Active tab dataset
  const activeData = useMemo(() => {
    return tabs === 0 ? tableData.api2 : tabs === 1 ? tableData.api1 : tableData.api3;
  }, [tabs, tableData]);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Apply sorting
  const sortedData = useMemo(() => {
    return [...activeData].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];

      // Date sorting
      if (sortField.toLowerCase().includes("date")) {
        return sortOrder === "asc"
          ? new Date(av) - new Date(bv)
          : new Date(bv) - new Date(av);
      }

      // String/number sorting
      return sortOrder === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [activeData, sortField, sortOrder]);

  // Apply search (SO No, Customer Name, Remark)
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return sortedData;

    const s = searchText.toLowerCase();

    return sortedData.filter((row) =>
      String(row?.so_No).toLowerCase().includes(s) ||
      String(row?.customer_Name).toLowerCase().includes(s) ||
      String(row?.remark || row?.Remark || "").toLowerCase().includes(s)
    );
  }, [searchText, sortedData]);

  // Pagination data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Tab Change Reset
  const handleTabs = (e, newValue) => {
    setTabs(newValue);
    setPage(0);
    setSearchText("");
    setSortField("entry_Date");
    setSortOrder("desc");
    setOpenRow(null);
  };

  // Alerts
  const showSuccess = (msg) => setCustAlert({ type: "success", message: msg });
  const showError = (msg) => setCustAlert({ type: "error", message: msg });
  const closeAlert = () => setCustAlert(null);

  // Transfer to Credit
  async function handleTransferCredit(row, type) {
    try {
      let res;

      if (type === "Advance Payments") {
        res = await api.post(
          "BituRep/Api/Account/Credit_RE_insert",
          JSON.stringify({
            user_id: userId,
            Customer_Name: row.customer_Name,
            Entry_Date: dayjs(new Date()),
            Recipt_type: type,
            So_No: row.so_No,
            Tds: 0,
            Log_id: 0,
            Amount: row.bal_Adv,
          })
        );
      } else if (type === "Cash Payments") {
        for (const item of selectedRows) {
          res = await api.post(
            "BituRep/Api/Account/Credit_RE_insert",
            JSON.stringify({
              user_id: userId,
              Customer_Name: item.customer_Name,
              Entry_Date: item.entry_Date,
              Recipt_type: "Cash Payments",
              So_No: item.so_No,
              Tds: 0,
              Log_id: item.id,
              Amount: item.b_Bal_Amount,
            })
          );
        }
      }

      showSuccess("Transferred successfully");
      fetchTableData();
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

        {/* Search */}
        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by SO No, Customer Name or Remark"
        />

        {/* Table */}
        <AccountTable
          tabs={tabs}
          paginatedData={paginatedData}
          navigate={navigate}
          openRow={openRow}
          setOpenRow={setOpenRow}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleTransferCredit={handleTransferCredit}

          /* Sorting props */
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          rowsPerPageOptions={[25, 50, 75, 100]}
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
          onClose={closeAlert}
        />
      )}
    </>
  );
}
