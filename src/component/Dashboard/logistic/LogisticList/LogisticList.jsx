import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, 
  Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, FormControl, MenuItem, TextField, Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { authAxios } from '../../../utils/authAxios';
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader';
import DeleteConfirmationDialog from '../../../commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog';
import CustomeAlerts from '../../../commonComponent/CustomeAlert/CustomeAlert';
import { vehicleDelete } from '../../../Config/Api/Api';
import dayjs from "dayjs";
import SearchInput from '../../../commonComponent/SearchInput/SearchInput';

const tableHeaders = [
  { label: "Date", key: "entry_Date" },
  { label: "So No", key: "so_No" },
  { label: "Customer", key: "customer_Name" },
  { label: "Vehicle No", key: "vehicle_Name" },
  { label: "AQty", key: "a_Qty" },
  { label: "Voyage" },
  { label: "Port" },
  { label: "Transporter" },
  { label: "Tank" },
  { label: "Remark" },
  { label: "Status" },
  { label: "Edit" },
  { label: "Delete" },
];

export default function Logisticlist() {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemToDelete: null });
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, itemToStatus: null });
  const [statusError, setStatusError] = useState(null);
  const [custAlert, setCustAlert] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [checkTableData, setCheckTableData] = useState(false);
  const [statusListCheck, setStatusListCheck] = useState(true);
  const [statuslist, setStatuslist] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [orderBy, setOrderBy] = useState("entry_Date");   // default sorting column
  const [order, setOrder] = useState("desc");             // default descending

  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("userInfo"))?.id;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    if (!column) return;
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  useEffect(() => {
    if (statusListCheck) {
      authAxios.post("/BituRep/Api/Account/Status_List", JSON.stringify({ "User_Id": userId }))
        .then(res => { setStatuslist(res.data); setStatusListCheck(false) })
        .catch(() => setStatusListCheck(false));
    }
  }, [userId, statusListCheck]);

  useEffect(() => {
    if (!checkTableData && tableData.length === 0) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId]);

  const fetchTableData = async () => {
    try {
      const response = await authAxios.post(
        "BituRep/Api/Account/logistic_data_list",
        JSON.stringify({ user_id: userId, Role: "entry" })
      );
      setTableData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      showError(error);
    } finally {
      setCheckTableData(true);
    }
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(tableData);
      return;
    }

    const text = searchText.toLowerCase();

    const result = tableData.filter((row) => {
      return (
        String(row?.so_No).toLowerCase().includes(text) ||
        String(row?.customer_Name).toLowerCase().includes(text) ||
        String(row?.vehicle_Name || row?.vehicle_No || row?.vessel_No || "")
          .toLowerCase()
          .includes(text)
      );
    });

    setFilteredData(result);
    setPage(0);
  }, [searchText, tableData]);

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (orderBy === "entry_Date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  async function StatusChange(row, value) {
    setTableData((prevState) =>
      prevState.map((tableData) =>
        tableData.table_id === row.table_id ? { ...tableData, status_name: value } : tableData
      )
    );
    try {
      const data = { "User_Id": userId, "Table_Id": row?.table_id, "Status_name": value };
      const res = await authAxios.post("BituRep/Api/Account/Status_update", data);
      showSuccess(res.data.massage);
    } catch (err) {
      showError(err);
    }
  }

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, itemToDelete: item });
  const handleCloseDeleteDialog = () => setDeleteDialog({ isOpen: false, itemToDelete: null });

  const handleDeleteConfirm = async (item) => {
    try {
      await authAxios.post(vehicleDelete, JSON.stringify({ "user_id": userId, "Table_Id": item.table_id }));
      showSuccess("Record deleted");
      fetchTableData();
    } catch (err) {
      showError(err.message);
    }
  };

  const StatusOpen = (item) => {
    const { row, value } = item;
    if (!["No Reported", "Reported"].includes(value) && (!row?.a_Qty || Number(row?.a_Qty) === 0)) {
      setStatusError("Actual Quantity is zero. Please update Actual Quantity before changing status.");
      return;
    }
    setStatusDialog({ isOpen: true, itemToStatus: row, value: value });
  };

  const showSuccess = (message) => setCustAlert({ type: "success", message });
  const showError = (message) => setCustAlert({ type: "error", message });
  const handleCloseAlert = () => setCustAlert(null);

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vehicle Pool" />

      <Box sx={{ width: "96%", margin: "auto", mb: 2 }}>
        {/* <TextField
          label="Search SO No, Customer, Vehicle No"
          variant="outlined"
          size="small"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        /> */}
        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search SO No, Customer, Vehicle No"
        />
      </Box>

      <Paper sx={{ p: 2 }} elevation={0}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "rgba(25, 118, 210, 0.08)" }}>
              <TableRow>
                {tableHeaders.map((col, index) => (
                  <TableCell
                    key={index}
                    onClick={() => col.key && handleSort(col.key)}
                    sx={{
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: col.key ? "pointer" : "default",
                      userSelect: "none"
                    }}
                  >
                    {col.label}

                    {col.key && orderBy === col.key && (
                      <span style={{ marginLeft: 4 }}>
                        {order === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => {
                let bgColor = "white";
                let isDisabled = false;

                switch (row.status_name) {
                  case "Reported":
                    bgColor = "#eabbbbff";
                    break;
                  case "Weight Slip":
                    bgColor = "#FFF5E6";
                    isDisabled = true;
                    break;
                  case "Released From Terminal":
                    bgColor = "#FFFFE0";
                    isDisabled = true;
                    break;
                  default:
                    bgColor = "white";
                }

                return (
                  <TableRow
                    key={row.table_id}
                    sx={{
                      backgroundColor: bgColor,
                      "&:hover": { backgroundColor: isDisabled ? bgColor : "#f2f2f2" },
                      "& td, & th": { color: "black" },
                      opacity: isDisabled ? 0.7 : 1,
                      pointerEvents: isDisabled ? "none" : "auto",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                  <TableCell>{row?.entry_Date ? dayjs(row.entry_Date).format("DD-MMM-YY") : ""}</TableCell>
                    <TableCell>{row?.so_No}</TableCell>
                    <TableCell>{row?.customer_Name}</TableCell>
                    <TableCell>{row?.vehicle_Name}</TableCell>
                    <TableCell>{row?.a_Qty || "No Actual quantity"}</TableCell>
                    <TableCell>{`${row?.vessel_Name || "No Vessel Name"} | ${row?.vessel_No}`}</TableCell>
                    <TableCell>{row?.port_Name}</TableCell>
                    <TableCell>{row?.transporter_Name || "No Transporter Name"}</TableCell>
                    <TableCell>{row?.tank_name || "No tank name"}</TableCell>
                    <TableCell>{row?.remark}</TableCell>

                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={row?.status_name || "Select"}
                          onChange={(e) => StatusOpen({ row, value: e.target.value })}
                          sx={{
                            color: "black",
                            ".MuiSelect-icon": { color: "black" },
                          }}
                          disabled={isDisabled}
                        >
                          <MenuItem disabled value="Select" sx={{ color: "black" }}>
                            Please Select
                          </MenuItem>
                          {statuslist.map((data) => (
                            <MenuItem key={data.status_id} value={data.status_Name} sx={{ color: "black" }}>
                              {data.status_Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        disabled={
                          isDisabled ||
                          row?.a_Qty === 0 ||
                          row?.a_Qty === "" ||
                          !["No Reported", "Reported"].includes(row?.status_name)
                        }
                        onClick={() =>
                          navigate("/dashboard/Logistic/logistic_list_Edit_Form/" + row?.table_id)
                        }
                      >
                        <EditSquareIcon sx={{ color: isDisabled ? "gray" : "black" }} />
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        disabled={isDisabled || row?.a_Qty !== ""}
                        onClick={() => handleDeleteClick(row)}
                      >
                        <DeleteIcon sx={{ color: isDisabled || row?.a_Qty !== "" ? "gray" : "black" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[25, 50, 75,100]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemToDelete={deleteDialog.itemToDelete}
      />

      <StatusConfirm
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, itemToStatus: null, value: null })}
        onConfirm={StatusChange}
        itemToStatus={statusDialog?.itemToStatus}
        value={statusDialog?.value}
      />

      <Dialog open={Boolean(statusError)} onClose={() => setStatusError(null)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent><Typography>{statusError}</Typography></DialogContent>
        <DialogActions><Button onClick={() => setStatusError(null)}>OK</Button></DialogActions>
      </Dialog>

      {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleCloseAlert} />
      )}
    </React.Fragment>
  );
}

function StatusConfirm({ isOpen, onClose, onConfirm, itemToStatus, value }) {
  const handleConfirm = () => { onConfirm(itemToStatus, value); onClose(); };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to change status to <strong>{value}</strong>?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
