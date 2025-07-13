import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,  FormControl, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from "react-router";
import { authAxios } from '../../../utils/authAxios';
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader';

import DeleteConfirmationDialog from '../../../commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { vehicleDelete } from '../../../Config/Api';
import CustomeAlerts from '../../../commonComponent/CustomeAlert/CustomeAlert';
const tableHeaders = [
  "So No",
  "Customer Name",
  "Vehicle Name",
  "Estimated Quantity",
  "Actual Qty",
  "Vessal Name",
  "BOE No.",
  "Port Name",
  "Transporter Name",
  "Product Name",
  "Tank Name",
  
  
  
  "Remark",
  "Status",
  "Edit",
  "Delete"
];

export default function Logisticlist() {
  const [deleteDialog, setDeleteDialog] = React.useState({ isOpen: false, itemToDelete: null });
  const [statusDialog,setStatusDialog] =  React.useState({ isOpen: false, itemToStatus: null });
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [statusListCheck,setStatusListCheck] = React.useState(true);
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [custAlert, setCustAlert] = React.useState(null);
  const [statuslist,setStatuslist] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(statusListCheck == true ){
    authAxios.post("/BituRep/Api/Account/Status_List",JSON.stringify({
      "User_Id":userId
    }))
    .then(res=> {setStatuslist(res.data);setStatusListCheck(false)})
    .catch(err=>{ console.log(err.message);setStatusListCheck(false)})
  } 
  
  },[userId, statuslist, statusListCheck])
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pagination slice
  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    
  
    if (!checkTableData && tableData.length === 0) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId]);
  const fetchTableData = async () => {
      try {
        const response = await authAxios.post(
          "BituRep/Api/Account/logistic_data_list",
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        );
        setTableData(response.data);
        setCheckTableData(true)
      } catch (error) {
        setCheckTableData(true)
        showError(error);
      } finally {
       setCheckTableData(true);
      }
    };
 async function StatusChange(row,value){
    setTableData((prevState) => 
      prevState.map((tableData) => {
        if (tableData.table_id ===row.table_id) {
          return { ...tableData, status_name: value };
        }
        return tableData;
      })
      
    );
    const data={
      "User_Id": userId,
      "Table_Id": row?.table_id,
      "Status_name": value
    }
  await  authAxios.post("BituRep/Api/Account/Status_update",data)
    .then((res)=>{
     showSuccess( res.data.massage); 
    }).catch((err)=>showError(err))
  }
  const handleDeleteClick = (item) => {
    setDeleteDialog({ isOpen: true, itemToDelete: item });
  };
  const StatusOpen = (item) => {
    setStatusDialog({ isOpen: true, itemToStatus: item.row,value:item.value });
  };
 
  const handleCloseStatusDialog = () => {
    setStatusDialog({ isOpen: false, itemToDelete: null,value:null });
  }
   const handleCloseDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, itemToDelete: null });
  }
  const handleDeleteConfirm = async (item) => {
     let data={
      
  "user_id": userId,
  "Table_Id": item.table_id
}
    
    authAxios.post(vehicleDelete,JSON.stringify(data))
    .then(res =>{showSuccess("record delete");console.log(res.message);fetchTableData();})
    .catch(err =>{showError(err.message);})
  }
  const showSuccess = (data) => {
            setCustAlert({ type: "success", message: data });
          };
          const showError = (data) => {
            setCustAlert({ type: "error", message: data });
          };
          const handleCloseAlert = () => {
            setCustAlert(null);
          };
  return (
    <React.Fragment>
     <CustomPageHeader pageHeaderText="Vehicle Pull"/>
      <Paper sx={{ p: 2 }} elevation={0}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          {/* <TableRow> */}
          <TableRow>
  {tableHeaders.map((header, index) => (
    <TableCell
      key={index}
      align="left"
      sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}
    >
      {header}
    </TableCell>
  ))}
{/* </TableRow> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) =>
            (
            
            <TableRow 
              key={row.table_id}
              sx={{ '&:hover': {
             backgroundColor: 'grey.200',
           },'&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row?.so_No}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.vehicle_Name}</TableCell>
              <TableCell align="left">{row?.quantity}</TableCell>
              <TableCell>
              {row?.a_Qty === ""? "No Actual quantity":row?.a_Qty}
              </TableCell>
                      <TableCell>
                {row?.vessel_Name == ""? "No Vessel Name" : row?.vessel_Name}
              </TableCell><TableCell align="left">{row?.bE_No === ""? "No BOE No.":row?.bE_No}</TableCell>
              <TableCell align="left">{row?.port_Name}</TableCell>
              <TableCell align="left">{row?.transporter_Name === ""? "No transporter":row?.transporter_Name}</TableCell>
              
              <TableCell align="left">{row?.produce_Name === ""? "No Product":row?.produce_Name}</TableCell>
              <TableCell align="left">{row?.tank_name === ""? "No tank name":row?.tank_name}</TableCell>
      
              
              <TableCell align="left">{row?.remark}</TableCell>
              <TableCell>
               <FormControl fullWidth size='small'>
                <Select
                value={row?.status_name || "Select"}
                onChange={(e)=>{let rowthis={"value":e.target.value,"row":row};StatusOpen(rowthis)}} >
                  <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                {statuslist.map(data=>(
                  <MenuItem key={data.status_id}  value={data.status_Name}>{data.status_Name}</MenuItem>
                ))}
                </Select>
               </FormControl>
              </TableCell>
              <TableCell>
                <IconButton
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() => navigate("/dashboard/Logistic/logistic_list_Edit_Form/"+row?.table_id)}
                                 
                                >
                <EditSquareIcon color='primary' />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton aria-label='Delete' onClick={()=>handleDeleteClick(row)} >
                  <DeleteIcon  color='error'/>
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
       <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemToDelete={deleteDialog.itemToDelete}
      />
      <StatusComfirm
        isOpen={statusDialog.isOpen}
        onClose={handleCloseStatusDialog}
        onConfirm={StatusChange}
        itemToStatus={statusDialog?.itemToStatus}
        value={statusDialog?.value}
      />
      {custAlert && (
        <CustomeAlerts
          type={custAlert.type}
          message={custAlert.message}
          onClose={handleCloseAlert}
        />
      )}
    </React.Fragment>
  )
}


function StatusComfirm({ isOpen, onClose, onConfirm, itemToStatus,value }){
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(itemToStatus,value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Confirm Status Change</DialogTitle>
      <DialogContent>
        {itemToStatus ? (
          <>
            <Typography>Are you sure you want to status change the following order?</Typography>
            <Typography variant="body2" sx={{display:"flex"}} ><Typography  sx={{width:"100px",fontWeight:800}}>Order ID:</Typography> {itemToStatus?.table_id}</Typography>
            <Typography variant="body2" sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Customer:</Typography> {itemToStatus?.customer_Name}</Typography>
            <Typography variant="body2"sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}} >Product:</Typography> {itemToStatus?.produce_Name}</Typography>
            <Typography variant="body2"sx={{display:"flex"}}><Typography sx={{width:"100px",fontWeight:800}}>Quantity:</Typography> {itemToStatus?.quantity}</Typography>
          </>
        ) : (
          'No item selected.'
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

}