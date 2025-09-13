import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Badge,
  Collapse,
  List,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { authAxios } from "../../component/utils/authAxios";
import CustomPageHeader from "../../component/commonComponent/CustomPageHeader/CustomPageHeader";
import CustomeAlerts from "../../component/commonComponent/CustomeAlert/CustomeAlert";
import { CustomTab } from "../../component/commonComponent/CustomTabs/CustomTabs";
import { AccountAdvance, AccountCreditApi } from "../../component/Config/Api/Api";
import api from "../../component/Config/Api";
import dayjs from "dayjs";

const cashHeaders = [
  "So No",
  "Customer Name",
  "Port Name",
  "Company name",
  "Balance Advance",
  "Recived Amount",
  "Transfer to Credit",
  "Receipt Details",
  "Receipt",
];

const advanceHeaders = [
  "So No",
  "Customer Name",
  "Port Name",
  "Company name",
  "Advance Payment",
  "Balance Advance",
  "Recived Amount",
  "Transfer to Credit",
  "Receipt",
];

const creditHeaders = [
  "So No.",
  "Customer Name",
  "Port Name",
  "Company Name",
  "Amount",
  "Balance Advance",
  "Recived Amount",
  "Credit Days",
  "Recipt",
];

const vehicle_head = [
  "id",
  "customer Name",
  "vehicle Name",
  "a Qty",
  "so No",
  "entry Date",
  "b Amount",
  "b Bal Amount",
  "b P Flag",
  "recipt ID",
];

export default function AccountList() {
  const [statusDialog, setStatusDialog] = React.useState({
    isOpen: false,
    itemToStatus: null,
  });
  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState({
    api1: null,
    api2: null,
    api3: null,
  });
  const [checkTableData, setCheckTableData] = React.useState(false);
  const [userId] = React.useState(
    JSON.parse(sessionStorage.getItem("userInfo"))?.id
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [custAlert, setCustAlert] = React.useState(null);
  const [openRow, setOpenRow] = React.useState(null);
  const [innerData, setInnerData] = React.useState([]);
  const [tabs, setTabs] = React.useState(0);

  const handleTabs = (event, newValue) => {
    setTabs(newValue);
  };

  const activeHeaders =
    tabs === 0 ? advanceHeaders : tabs === 1 ? cashHeaders : creditHeaders;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const activeData =
    tabs === 0
      ? tableData.api2 || []
      : tabs === 1
      ? tableData.api1 || []
      : tableData.api3 || [];

  const paginatedData = activeData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    if (!checkTableData) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId]);

  const fetchTableData = async () => {
    try {
      const [resOne, resTwo, resThree] = await Promise.all([
        authAxios.post(
          "/BituRep/Api/Account/Account_CH",
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        ),
        authAxios.post(
          AccountAdvance,
          JSON.stringify({
            user_id: userId,
          })
        ),
        authAxios.post(
          AccountCreditApi,
          JSON.stringify({
            user_id: userId,
          })
        ),
      ]);

      setTableData({
        api1: resOne.data, // cash
        api2: resTwo.data, // advance
        api3: resThree.data, // credit
      });

      setCheckTableData(true);
    } catch (error) {
      setCheckTableData(true);
      showError(error);
    }
  };

  const showSuccess = (data) => {
    setCustAlert({ type: "success", message: data });
  };
  const showError = (data) => {
    setCustAlert({ type: "error", message: data });
  };
  const handleCloseAlert = () => {
    setCustAlert(null);
  };

  async function handleTransferCredit(row, text) {
    try {
      const res = await api.post(
        "BituRep/Api/Account/Credit_RE_insert",
        JSON.stringify({
          user_id: userId,
          Customer_Name: row?.Customer_Name,
          Entry_Date: dayjs(new Date()),
          Recipt_type: text,
          So_No: row?.so_No,
          Tds: 0,
          Amount: row?.bal_Adv,
        })
      );
      showSuccess(res.data?.message || "Transferred successfully");
      fetchTableData();
    } catch (err) {
      showError("Error transferring to credit");
    }
  }

  const handleToggle = async (data) => {
    if (openRow === data.so_No) {
      setOpenRow(null);
    } else {
      setOpenRow(data.so_No);
      try {
        const res = await authAxios.post(
          "BituRep/Api/Account/Recipt_Detail_View",
          {
            user_id: userId,
            So_No: data?.so_No,
          }
        );
        setInnerData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Account List" />
      <Paper sx={{ p: 2 }} elevation={0}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs
            value={tabs}
            onChange={handleTabs}
            aria-label="basic tabs example"
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <CustomTab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  Advance Payment List
                  <Badge
                    badgeContent={tableData.api2?.length || 0}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "12px",
                        height: "20px",
                        minWidth: "20px",
                        borderRadius: "50%",
                      },
                    }}
                  />
                </Box>
              }
              sx={{ width: "33%" }}
            />

            <CustomTab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  Cash Payment List
                  <Badge
                    badgeContent={tableData.api1?.length || 0}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "12px",
                        height: "20px",
                        minWidth: "20px",
                        borderRadius: "50%",
                      },
                    }}
                  />
                </Box>
              }
              sx={{ width: "33%" }}
            />

            <CustomTab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  Credit Payment List
                  <Badge
                    badgeContent={tableData.api3?.length || 0}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "12px",
                        height: "20px",
                        minWidth: "20px",
                        borderRadius: "50%",
                      },
                    }}
                  />
                </Box>
              }
              sx={{ width: "33%" }}
            />
          </Tabs>
        </Box>

        {/* Main Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                {activeHeaders.map((header, index) => (
                  <TableCell
                    key={index}
                    align="left"
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <React.Fragment key={row?.so_No}>
                  {/* Outer Table Row */}
                  <TableRow
                    sx={{
                      "&:hover": { backgroundColor: "grey.200" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {tabs === 0 && (
                      <>
                        <TableCell>{row?.so_No}</TableCell>
                        <TableCell>{row?.customer_Name}</TableCell>
                        <TableCell>{row?.port_Name}</TableCell>
                        <TableCell>{row?.company_Name}</TableCell>
                        <TableCell>{row?.adv_Value}</TableCell>
                        <TableCell>{row?.bal_Adv}</TableCell>
                        <TableCell>{row?.rec}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleTransferCredit(row, "Advance Payments")
                            }
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
                              const query = new URLSearchParams({
                                data: JSON.stringify(data),
                              }).toString();
                              navigate(`/dashboard/Account/ReciptFrom?${query}`);
                            }}
                          >
                            Recipt
                          </Button>
                        </TableCell>
                      </>
                    )}

                    {tabs === 1 && (
                      <>
                        <TableCell>{row?.so_No}</TableCell>
                        <TableCell>{row?.customer_Name}</TableCell>
                        <TableCell>{row?.port_Name}</TableCell>
                        <TableCell>{row?.company_Name}</TableCell>
                        <TableCell>{row?.bal_Adv}</TableCell>
                        <TableCell>{row?.rec}</TableCell>
                        <TableCell>
                          <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleTransferCredit(row, "Cash Payments")
                            }
                          >
                            Transfer to Credit
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleToggle(row)}
                            color={
                              openRow === row.so_No ? "error" : "primary"
                            }
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
                              const query = new URLSearchParams({
                                data: JSON.stringify(data),
                              }).toString();
                              navigate(`/dashboard/Account/ReciptFrom?${query}`);
                            }}
                          >
                            Recipt
                          </Button>
                        </TableCell>
                      </>
                    )}

                    {tabs === 2 && (
                      <>
                        <TableCell>{row?.so_No}</TableCell>
                        <TableCell>{row?.customer_Name}</TableCell>
                        <TableCell>{row?.port_Name}</TableCell>
                        <TableCell>{row?.company_Name}</TableCell>
                        <TableCell>{row?.amount}</TableCell>
                        <TableCell>{row?.bal_Adv}</TableCell>
                        <TableCell>{row?.rec}</TableCell>
                        <TableCell>{row?.c_Days}</TableCell>
                        <TableCell>
                          <Button
                            color="primary"
                            onClick={() => {
                              let data = {
                                so_no: row?.so_No,
                                customer: row.customer_Name,
                                Payment_Type: row?.payment_Type,
                              };
                              const query = new URLSearchParams({
                                data: JSON.stringify(data),
                              }).toString();
                              navigate(`/dashboard/Account/ReciptFrom?${query}`);
                            }}
                          >
                            Recipt
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>

                  {/* Inner Collapsible Table */}
                  {tabs === 1 && (
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={16}
                      >
                        <Collapse
                          in={openRow === row.so_No}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            <TableContainer
                              elevation={0}
                              component={Paper}
                              style={{ overflow: "auto", minWidth: 800 }}
                            >
                              <Table size="small">
                                <TableHead
                                  sx={{
                                    fontWeight: 500,
                                    bgcolor: "rgba(240, 114, 223, 0.08)",
                                  }}
                                >
                                  <TableRow>
                                    {vehicle_head.map((head, index) => (
                                      <TableCell
                                        key={index}
                                        align="left"
                                        sx={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {head}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {innerData?.map((vRow, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{vRow?.id}</TableCell>
                                      <TableCell>
                                        {vRow?.customer_Name}
                                      </TableCell>
                                      <TableCell>
                                        {vRow?.vehicle_Name}
                                      </TableCell>
                                      <TableCell>{vRow?.a_Qty}</TableCell>
                                      <TableCell>{vRow?.so_No}</TableCell>
                                      <TableCell>
                                        {dayjs(vRow?.entry_Date).format(
                                          "DD-MM-YYYY"
                                        )}
                                      </TableCell>
                                      <TableCell>{vRow?.b_Amount}</TableCell>
                                      <TableCell>
                                        {vRow?.b_Bal_Amount}
                                      </TableCell>
                                      <TableCell>{vRow?.b_P_Flag}</TableCell>
                                      <TableCell>{vRow?.recipt_ID}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={activeData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Alerts */}
      {custAlert && (
        <CustomeAlerts
          type={custAlert.type}
          message={custAlert.message}
          onClose={handleCloseAlert}
        />
      )}
    </React.Fragment>
  );
}
