import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, 
  Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, FormControl, MenuItem 
} from '@mui/material';
import React, { useEffect } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router";
import { authAxios } from '../../../utils/authAxios';
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader';
import DeleteConfirmationDialog from '../../../commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog';
import CustomeAlerts from '../../../commonComponent/CustomeAlert/CustomeAlert';
import { vehicleDelete } from '../../../Config/Api/Api';
import dayjs from "dayjs";

const tableHeaders = [
  "Date", "So No", "Customer", "Vehicle No", "AQty", "Voyage", 
  "Port", "Transporter", "Tank", "Remark", "Status", "Edit", "Delete"
];

export default function Logisticlist() {
  const [deleteDialog, setDeleteDialog] = React.useState({ isOpen: false, itemToDelete: null });
  const [statusDialog, setStatusDialog] = React.useState({ isOpen: false, itemToStatus: null });
  const [statusError, setStatusError] = React.useState(null);
  const [custAlert, setCustAlert] = React.useState(null);

  const [tableData, setTableData] = React.useState([]);
  const [checkTableData, setCheckTableData] = React.useState(false);
  const [statusListCheck, setStatusListCheck] = React.useState(true);
  const [statuslist, setStatuslist] = React.useState([]);
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const navigate = useNavigate();
  const userId = JSON.parse(sessionStorage.getItem("userInfo"))?.id;

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch Status List
  useEffect(() => {
    if (statusListCheck) {
      authAxios.post("/BituRep/Api/Account/Status_List", JSON.stringify({ "User_Id": userId }))
        .then(res => { setStatuslist(res.data); setStatusListCheck(false) })
        .catch(err => { console.log(err.message); setStatusListCheck(false); });
    }
  }, [userId, statusListCheck]);

  // Fetch Table Data
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
    } catch (error) {
      showError(error);
    } finally {
      setCheckTableData(true);
    }
  };

  // Status change handler
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

  // Delete handlers
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

  // Status dialog
  const StatusOpen = (item) => {
    const { row, value } = item;
    if (!["No Reported", "Reported"].includes(value) && (!row?.a_Qty || Number(row?.a_Qty) === 0)) {
      setStatusError("Actual Quantity is zero. Please update Actual Quantity before changing status.");
      return;
    }
    setStatusDialog({ isOpen: true, itemToStatus: row, value: value });
  };

  // Alert helpers
  const showSuccess = (message) => setCustAlert({ type: "success", message });
  const showError = (message) => setCustAlert({ type: "error", message });
  const handleCloseAlert = () => setCustAlert(null);

  // Sort data
  const sortedData = [...tableData].sort((a, b) => {
    const dateA = new Date(a.entry_Date), dateB = new Date(b.entry_Date);
    if (dateB - dateA !== 0) return dateB - dateA;
    const customerA = (a.customer_Name || "").toLowerCase();
    const customerB = (b.customer_Name || "").toLowerCase();
    if (customerA !== customerB) return customerA.localeCompare(customerB);
    return (a.so_No || "").toString().localeCompare((b.so_No || "").toString());
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vehicle Pool" />
      <Paper sx={{ p: 2 }} elevation={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead sx={{ bgcolor: "rgba(25, 118, 210, 0.08)" }}>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

          <TableBody>
  {paginatedData.map((row) => {
    // 🎨 Background colors by status
    let bgColor = "white";
    let isDisabled = false;

    switch (row.status_name) {
      //case "No Reported":
      //  bgColor = "#FFF5E6"; // very light orange
      //  break;   
      case "Reported":
        bgColor = "#eabbbbff"; // light pink
        break;
      case "Weight Slip":
        bgColor = "#FFF5E6"; // very light orange
        isDisabled = true;
        break;
      case "Released From Terminal":
        bgColor = "#FFFFE0"; // very light yellow
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
          "&:hover": {
            backgroundColor: isDisabled ? bgColor : "#f2f2f2",
          },
          "& td, & th": { color: "black" }, // 🖤 Force black text in all cells
          opacity: isDisabled ? 0.7 : 1,
          pointerEvents: isDisabled ? "none" : "auto",
          transition: "background-color 0.3s ease",
        }}
      >
        <TableCell>{row?.entry_Date ? dayjs(row.entry_Date).format("DD-MM-YY") : ""}</TableCell>
        <TableCell>{row?.so_No}</TableCell>
        <TableCell>{row?.customer_Name}</TableCell>
        <TableCell>{row?.vehicle_Name}</TableCell>
        <TableCell>{row?.a_Qty || "No Actual quantity"}</TableCell>
        <TableCell>{`${row?.vessel_Name || "No Vessel Name"} | ${row?.vessel_No}`}</TableCell>
        <TableCell>{row?.port_Name}</TableCell>
        <TableCell>{row?.transporter_Name || "No Transporter Name"}</TableCell>
        <TableCell>{row?.tank_name || "No tank name"}</TableCell>
        <TableCell>{row?.remark}</TableCell>

        {/* Status */}
        <TableCell>
          <FormControl fullWidth size="small">
            <Select
              value={row?.status_name || "Select"}
              onChange={(e) => StatusOpen({ row, value: e.target.value })}
              sx={{
                color: "black", // 🖤 always black text in dropdown
                ".MuiSelect-icon": { color: "black" }, // make the dropdown arrow black too
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

        {/* Edit */}
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
            <EditSquareIcon
              sx={{ color: isDisabled ? "gray" : "black" }} // black icon if active, gray if disabled
            />
          </IconButton>
        </TableCell>

        {/* Delete */}
        <TableCell>
          <IconButton
            disabled={isDisabled || row?.a_Qty !== ""}
            onClick={() => handleDeleteClick(row)}
          >
            <DeleteIcon
              sx={{ color: isDisabled || row?.a_Qty !== "" ? "gray" : "black" }} // black if active, gray if disabled
            />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>


          </Table>
        </TableContainer>

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

      {/* Delete Confirmation */}
      <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemToDelete={deleteDialog.itemToDelete}
      />

      {/* Status Confirmation */}
      <StatusConfirm
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, itemToStatus: null, value: null })}
        onConfirm={StatusChange}
        itemToStatus={statusDialog?.itemToStatus}
        value={statusDialog?.value}
      />

      {/* Status Error */}
      <Dialog open={Boolean(statusError)} onClose={() => setStatusError(null)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{statusError}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusError(null)} color="primary">OK</Button>
        </DialogActions>
      </Dialog>

      {/* Custom Alerts */}
      {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleCloseAlert} />
      )}
    </React.Fragment>
  );
}

// Status Confirmation Component
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
