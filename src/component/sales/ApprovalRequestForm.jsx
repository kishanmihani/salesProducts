/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,  
  TablePagination,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  List,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import { authAxios } from "../utils/authAxios";
import CustomeAlerts from "../commonComponent/CustomeAlert/CustomeAlert";
import { a11yProps, CustomTabPanel } from "../commonComponent/CustomTabPanel/CustomTabPanel";
import formatDateToUS from "../utils/DateFormate";
import ReceiptInnerTable from "../../pages/accounts/ReceiptInnerTable";
//import { authAxios } from "../component/utils/authAxios";

// ✅ Table Headers
const headers = [
  { key: "entry_Date", label: "Date" },
  { key: "so_No", label: "SO No" },
  { key: "customer_Name", label: "Customer Name" },
  { key: "port_Name", label: "Port Name" },
  { key: "vehicle_Name", label: "Vehicle Name" },
  { key: "type", label: "Type" },
  { key: "c_Days", label: "C_Days" },
  { key: "a_Qty", label: "Quantity" },
  { key: "rate", label: "Rate" },
  { key: "b_Amount", label: "Bill" },
  { key: "b_Amount_Used", label: "Paid" },
  { key: "b_Bal_Amount", label: "Balance" },
  { key: "status_name", label: "Status" },
  { key: "remark", label: "Remark" },
  { key: "actions", label: "Receipt" },
];

export default function ApprovalRequestForm() {
  const navigate = useNavigate();

  // ✅ State variables
  const [tableData, setTableData] = useState([]);
  const [checkTableData, setCheckTableData] = useState(true);
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [custAlert, setCustAlert] = useState(null);
  const [tabs, setTabs] = useState(0);

  // ✅ Popup & collapsible states
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [prodPopup, setProdPopup] = useState(false);
  const [showPopupDetails, setShowPopupDetails] = useState(null);

  const [openRow, setOpenRow] = useState(null);
  const [innerData, setInnerData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // ✅ Utility: show success alert
  const showSuccess = (message) => setCustAlert({ type: "success", message });
  const handleClose = () => setCustAlert(null);

  // ✅ Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = [...tableData]
    .sort((a, b) => new Date(b?.entry_Date) - new Date(a?.entry_Date))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // ✅ Fetch SO approval data
  const fetchTableData = async () => {
    try {
      const response = await authAxios.post(
        "BituRep/Api/Account/send_sodata_userwise",
        JSON.stringify({
          user_id: userId,
          Role: "Approver",
        })
      );
      setTableData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCheckTableData(false);
    }
  };

  // ✅ Fetch invoice release approval data
  const fetchLogisticData = async () => {
    try {
      const response = await authAxios.post(
        "/BituRep/Api/Account/logistic_data_Approvel_list",
        JSON.stringify({ user_id: userId })
      );
      setTableData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCheckTableData(false);
    }
  };

  // ✅ Fetch initial data
  useEffect(() => {
    if (checkTableData) fetchTableData();
  }, [checkTableData, userId]);

  // ✅ Actions
  async function ApproveAction(table_Id) {
    try {
      const res = await authAxios.post(
        "BituRep/Api/Account/send_sodata_Approved",
        JSON.stringify({ user_id: userId, table_Id })
      );
      if (res.data.massage1 === "Entry Done") {
        showSuccess("Bill Approved");
        fetchTableData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function DispproveAction(table_Id) {
    try {
      const res = await authAxios.post(
        "BituRep/Api/Account/send_sodata_Disapprve",
        JSON.stringify({ user_id: userId, table_Id })
      );
      if (res.data.massage === "Entry Done") {
        showSuccess("Bill Disapproved");
        fetchTableData();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleApprove = async (row) => {
    const payload = {
      User_Id: userId,
      table_id: row.table_id,
      status_name: row.status_name,
    };

    try {
      const response = await authAxios.post(
        "BituRep/Api/Account/Status_update_Approver",
        payload
      );
      if (response !== "") fetchLogisticData();
    } catch (error) {
      console.error("API Error:", error.message);
    }
  };

  // ✅ Toggle collapsible inner table
  const handleToggle = async (row) => {
    if (openRow === row.so_No) {
      setOpenRow(null);
    } else {
      setOpenRow(row.so_No);
      try {
        const res = await authAxios.post(
          "BituRep/Api/Account/Recipt_Detail_View",
          { user_id: userId, So_No: row.so_No }
        );
        setInnerData(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // ✅ Tooltip handlers
  const handleMouseEnter = (e, details) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left - 100 + window.scrollX });
    setShowPopup(true);
    setShowPopupDetails(details);
  };
  const handleMouseLeave = () => setShowPopup(false);
  const handleProdMouseEnter = (e, details) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setProdPopup(true);
    setShowPopupDetails(details);
  };
  const handleProdMouseLeave = () => setProdPopup(false);

  return (
    <React.Fragment>
      {/* Header */}
      <Box sx={{ p: 1, position: "sticky", top: 0, bgcolor: "#fff", borderBottom: 1, zIndex: 4, display: "flex" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            border: "1px solid #eee",
            width: 40,
            height: 40,
            background: "transparent",
          }}
        >
          <ArrowBackIcon color="primary" />
        </button>
        <Typography variant="h5" align="center" width="100%">
          &nbsp;Approval Request Form
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabs} onChange={(e, v) => setTabs(v)}>
          <Tab label="SO Approval" sx={{ width: "50%" }} onClick={fetchTableData} {...a11yProps(0)} />
          <Tab label="Invoice Release Approval" sx={{ width: "50%" }} onClick={fetchLogisticData} {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 2 }} elevation={0}>
        {/* SO Approval */}
        <CustomTabPanel value={tabs} index={0}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(25,118,210,0.08)" }}>
                <TableRow>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Validity</TableCell>
                  <TableCell>Billing</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Port Name</TableCell>
                  <TableCell>Approve</TableCell>
                  <TableCell>Reject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.table_Id}>
                    <TableCell>{new Date(row.entry_Date).toLocaleDateString()}</TableCell>
                    <TableCell>{row.validity_Days}</TableCell>
                    <TableCell>{row.company_Name}</TableCell>
                    <TableCell>{row.customer_Name}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell
                      onMouseEnter={(e) => handleProdMouseEnter(e, row)}
                      onMouseLeave={handleProdMouseLeave}
                    >
                      <Typography color="primary">{row.product_Name}</Typography>
                    </TableCell>
                    <TableCell
                      onMouseEnter={(e) => handleMouseEnter(e, row)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Typography color="primary">{row.price}</Typography>
                    </TableCell>
                    <TableCell>{row.port_Name}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="success" size="small" onClick={() => ApproveAction(row.table_Id)}>
                        Approve
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="secondary" size="small" onClick={() => DispproveAction(row.table_Id)}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        {/* Invoice Release Approval */}
        <CustomTabPanel value={tabs} index={1}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(25,118,210,0.08)" }}>
                <TableRow>
                  {headers.map((col) => (
                    <TableCell key={col.key}>{col.label}</TableCell>
                  ))}
                  <TableCell>Approve</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      {headers.map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "entry_Date"
                            ? formatDateToUS(row[col.key])
                            : col.key === "actions" ? (
                                <Button
                                  onClick={() => handleToggle(row)}
                                  color={openRow === row.so_No ? "error" : "primary"}
                                  variant="outlined"
                                  size="small"
                                >
                                  {openRow === row.so_No ? "Close" : "Open"}
                                </Button>
                              ) : (
                                row[col.key] || ""
                              )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          color="success"
                          onClick={() => handleApprove(row)}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* ✅ Collapsible Inner Table */}
                    {openRow === row.so_No && (
                      <TableRow>
                        <TableCell colSpan={headers.length + 1} sx={{ p: 0 }}>
                          <Collapse in={openRow === row.so_No} timeout="auto" unmountOnExit>
                            <List disablePadding>
                              <TableContainer component={Paper} sx={{ overflow: "auto", minWidth: 800 }}>
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
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* ✅ Alerts */}
      {custAlert && <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />}

      {/* ✅ Product Info Popup */}
      {prodPopup && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            padding: 1,
            width: 300,
            backgroundColor: "lightyellow",
            zIndex: 10,
          }}
        >
          <Typography variant="h6" textAlign="center" py={1}>Product Info</Typography>
          <Typography fontSize={13}>Payment Type: {showPopupDetails?.payment_Type}</Typography>
          <Typography fontSize={13}>Transportation: {showPopupDetails?.transport_ON}</Typography>
          <Typography fontSize={13}>Transporter: {showPopupDetails?.transport_Name}</Typography>
        </Paper>
      )}

      {/* ✅ Bill Info Popup */}
      {showPopup && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            padding: 1,
            width: 300,
            backgroundColor: "lightyellow",
            zIndex: 10,
          }}
        >
          <Typography variant="h6" textAlign="center" py={1}>Bill Info</Typography>
          <Typography fontSize={13}>
            Selling Price:{" "}
            {Math.ceil(
              Number(showPopupDetails.transport) +
                Number(showPopupDetails.gst) +
                (Number(showPopupDetails.price) * 100) / 118
            )}
          </Typography>
          <Typography fontSize={13}>Transportation: {showPopupDetails?.transport}</Typography>
          <Typography fontSize={13}>
            Billing Price: {((Number(showPopupDetails.price) * 100) / 118).toFixed(2)}
          </Typography>
          <Typography fontSize={13}>GST 18%: {showPopupDetails?.gst}</Typography>
          <Typography fontSize={13}>Bitumen Price: {showPopupDetails?.price}</Typography>
          <Typography fontSize={13}>Discount: {showPopupDetails?.discount}</Typography>
          <Typography fontSize={13}>
            Net Price:{" "}
            {Math.ceil(
              Number(showPopupDetails.transport) +
                Number(showPopupDetails.gst) +
                (Number(showPopupDetails.price) * 100) / 118
            ) - Number(showPopupDetails?.discount)}
          </Typography>
        </Paper>
      )}
    </React.Fragment>
  );
}
