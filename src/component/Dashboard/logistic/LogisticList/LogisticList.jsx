import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, 
  Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, FormControl, MenuItem 
} from '@mui/material';
import React, { useEffect } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from "react-router";
import { authAxios } from '../../../utils/authAxios';
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader';
import DeleteConfirmationDialog from '../../../commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { vehicleDelete } from '../../../Config/Api/Api';
import CustomeAlerts from '../../../commonComponent/CustomeAlert/CustomeAlert';

const tableHeaders = [
  "So No", "Customer Name", "Vehicle Name", "Estimated Quantity", "Actual Qty", 
  "Voyage name", "BOE No.", "Port Name", "Transporter Name", "Product Name", 
  "Tank Name", "Xboe", "Remark", "Status", "Edit", "Delete"
];

export default function Logisticlist() {
  const [deleteDialog, setDeleteDialog] = React.useState({ isOpen: false, itemToDelete: null });
  const [statusDialog, setStatusDialog] = React.useState({ isOpen: false, itemToStatus: null });
  const [statusError, setStatusError] = React.useState(null);

  const navigate = useNavigate();
  const [tableData, setTableData] = React.useState([]);
  const [checkTableData, setCheckTableData] = React.useState(false);
  const [statusListCheck, setStatusListCheck] = React.useState(true);
  const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [custAlert, setCustAlert] = React.useState(null);
  const [statuslist, setStatuslist] = React.useState([]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pagination slice
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    if (statusListCheck === true) {
      authAxios.post("/BituRep/Api/Account/Status_List", JSON.stringify({ "User_Id": userId }))
        .then(res => { setStatuslist(res.data); setStatusListCheck(false) })
        .catch(err => { console.log(err.message); setStatusListCheck(false) });
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
      setCheckTableData(true);
    } catch (error) {
      setCheckTableData(true);
      showError(error);
    } finally {
      setCheckTableData(true);
    }
  };

  async function StatusChange(row, value) {
    setTableData((prevState) => 
      prevState.map((tableData) => 
        tableData.table_id === row.table_id ? { ...tableData, status_name: value } : tableData
      )
    );
    const data = { "User_Id": userId, "Table_Id": row?.table_id, "Status_name": value };
    await authAxios.post("BituRep/Api/Account/Status_update", data)
      .then((res) => { showSuccess(res.data.massage); })
      .catch((err) => showError(err));
  }

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, itemToDelete: item });
  const handleCloseDeleteDialog = () => setDeleteDialog({ isOpen: false, itemToDelete: null });
  const handleCloseStatusDialog = () => setStatusDialog({ isOpen: false, itemToStatus: null, value: null });

  const handleDeleteConfirm = async (item) => {
    let data = { "user_id": userId, "Table_Id": item.table_id };
    authAxios.post(vehicleDelete, JSON.stringify(data))
      .then(res => { showSuccess("Record deleted"); fetchTableData(); })
      .catch(err => { showError(err.message); });
  };

  const StatusOpen = (item) => {
    const row = item.row;
    const selectedStatus = item.value;

    if (selectedStatus !== "No Reported" && selectedStatus !== "Reported") {
      if (!row?.a_Qty || Number(row?.a_Qty) === 0) {
        setStatusError("Actual Quantity is zero. Please update Actual Quantity before changing status.");
        return;
      }
    }
    setStatusDialog({ isOpen: true, itemToStatus: row, value: selectedStatus });
  };

  const showSuccess = (data) => setCustAlert({ type: "success", message: data });
  const showError = (data) => setCustAlert({ type: "error", message: data });
  const handleCloseAlert = () => setCustAlert(null);

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vehicle Pool"/>
      <Paper sx={{ p: 2 }} elevation={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ fontSize: 14, fontWeight: 600, bgcolor:"rgba(25, 118, 210, 0.08)" }}>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableCell key={index} align="left" sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow 
                  key={row.table_id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'grey.200' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell align="left">{row?.so_No}</TableCell>
                  <TableCell align="left">{row?.customer_Name}</TableCell>
                  <TableCell align="left">{row?.vehicle_Name}</TableCell>
                  <TableCell align="left">{row?.quantity}</TableCell>
                  <TableCell align="left">{row?.a_Qty === "" ? "No Actual quantity" : row?.a_Qty}</TableCell>
                  <TableCell align="left">{row?.vessel_Name === "" ? "No Vessel Name" : row?.vessel_Name}</TableCell>
                  <TableCell align="left">{row?.bE_No === "" ? "No BOE No." : row?.bE_No}</TableCell>
                  <TableCell align="left">{row?.port_Name}</TableCell>
                  <TableCell align="left">{row?.transporter_Name === "" ? "No transporter" : row?.transporter_Name}</TableCell>
                  <TableCell align="left">{row?.produce_Name === "" ? "No Product" : row?.produce_Name}</TableCell>
                  <TableCell align="left">{row?.tank_name === "" ? "No tank name" : row?.tank_name}</TableCell>
                  <TableCell align="left">{row?.Xboe === "" ? "No Xboe name" : row?.exboe}</TableCell>
                  <TableCell align="left">{row?.remark}</TableCell>

                  {/* Status Column */}
                  <TableCell>
                    <FormControl fullWidth size='small'>
                      <Select
                        value={row?.status_name || "Select"}
                        onChange={(e)=>{ let rowthis = { "value": e.target.value, "row": row }; StatusOpen(rowthis) }}
                      >
                        <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                        {statuslist.map(data => (
                          <MenuItem key={data.status_id} value={data.status_Name}>{data.status_Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  
                  {/* Edit */}
                  <TableCell>
                    <IconButton
                      disabled={
                        row?.a_Qty === 0 || row?.a_Qty === "" || 
                        !["No Reported", "Reported"].includes(row?.status_name)
                      }
                      aria-label="Edit"
                      onClick={() => navigate("/dashboard/Logistic/logistic_list_Edit_Form/" + row?.table_id)}
                    >
                      <EditSquareIcon 
                        color={
                          row?.a_Qty === 0 || row?.a_Qty === "" ||
                          !["No Reported", "Reported"].includes(row?.status_name)
                            ? "disabled"
                            : "primary"
                        }
                      />
                    </IconButton>
                  </TableCell>

                  {/* Delete */}
                  <TableCell>
                    <IconButton 
                      aria-label='Delete' 
                      disabled={row?.a_Qty === 0 || row?.a_Qty === ""} 
                      onClick={() => handleDeleteClick(row)}
                    >
                      <DeleteIcon color={
                          row?.a_Qty === 0 || row?.a_Qty === "" ||
                          !["No Reported", "Reported"].includes(row?.status_name)
                            ? "disabled"
                            : "primary"
                        } />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
      <StatusComfirm
        isOpen={statusDialog.isOpen}
        onClose={handleCloseStatusDialog}
        onConfirm={StatusChange}
        itemToStatus={statusDialog?.itemToStatus}
        value={statusDialog?.value}
      />

      {/* Error when a_Qty === 0 */}
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
        <CustomeAlerts
          type={custAlert.type}
          message={custAlert.message}
          onClose={handleCloseAlert}
        />
      )}
    </React.Fragment>
  );
}

// Status Confirmation Component
function StatusComfirm({ isOpen, onClose, onConfirm, itemToStatus, value }) {
  const handleClose = () => onClose();
  const handleConfirm = () => { onConfirm(itemToStatus, value); onClose(); };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        {itemToStatus ? (
          <>
            <Typography>Are you sure you want to change the status for the following order?</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Order ID:</Typography> {itemToStatus?.table_id}</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Customer:</Typography> {itemToStatus?.customer_Name}</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Product:</Typography> {itemToStatus?.produce_Name}</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Quantity:</Typography> {itemToStatus?.quantity}</Typography>
          </>
        ) : 'No item selected.'}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
