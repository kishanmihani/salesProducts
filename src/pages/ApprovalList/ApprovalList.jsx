import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,  FormControl, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from "react-router";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPageHeader from '../../component/commonComponent/CustomPageHeader/CustomPageHeader';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import DeleteConfirmationDialog from '../../component/commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog';
// import { vehicleDelete } from '../../component/Config/Api'; 
import CancelIcon from '@mui/icons-material/Cancel';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CustomeAlerts from '../../component/commonComponent/CustomeAlert/CustomeAlert';
import api from '../../component/Config/Api';
import { vehiclelistapi } from '../../component/Config/Api/Api';
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
  "Approved",
  "Disapproved",
];

export default function ApprovalList() {
//   const [deleteDialog, setDeleteDialog] = React.useState({ isOpen: false, itemToDelete: null });
  // const [status,setStatus] =  React.useState("Awaiting Approval");
  // const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [custAlert, setCustAlert] = React.useState(null);
  const [statuslist,setStatuslist] = React.useState([]);
  const [checkStatusList,setCheckStatusList] = React.useState(true)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(checkStatusList){
      setCheckStatusList(false)
    api?.post("/BituRep/Api/Account/Status_List",JSON.stringify({
      "User_Id":userId
    }))
    .then(res=> setStatuslist(res.data))
    .catch(err=> console.log(err.message))
  }
  
  },[userId,statuslist,checkStatusList])
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
      try{
      fetchTableData();
      }catch(e){
        console.log(e)
      }
    }
  }, [checkTableData, tableData, userId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTableData = async () => {
      try {
        const response = await api.post(
        vehiclelistapi,
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        );
        setTableData(response.data);
        setCheckTableData(true)
      } catch (error) {
        setCheckTableData(true)
        // showError(error);
      } finally {
       setCheckTableData(true);
      }
    };
//   function StatusChange(row,value){
//     setTableData((prevState) => 
//       prevState.map((tableData) => {
//         if (tableData.table_id ===row.table_id) {
//           return { ...tableData, status_name: value };
//         }
//         return tableData;
//       })
      
//     );
//     const data={
//       "User_Id": userId,
//       "Table_Id": row?.table_id,
//       "Status_name": value
//     }
//     authAxios.post("BituRep/Api/Account/Status_update",data)
//     .then((res)=>{
//      showSuccess( res.data.message); 
//     }).catch((err)=>showError(err))
//   }
//   const handleDeleteClick = (item) => {
//     setDeleteDialog({ isOpen: true, itemToDelete: item });
//   };
//   const StatusOpen = (item) => {
//     setStatusDialog({ isOpen: true, itemToStatus: item.row,value:item.value });
//   };
 
//   const handleCloseStatusDialog = () => {
//     setStatusDialog({ isOpen: false, itemToDelete: null,value:null });
//   }
//    const handleCloseDeleteDialog = () => {
//     setDeleteDialog({ isOpen: false, itemToDelete: null });
//   }
//   const handleDeleteConfirm = async (item) => {
//      let data={
      
//   "user_id": userId,
//   "Table_Id": item.table_id
// }
    
//     authAxios.post(vehicleDelete,JSON.stringify(data))
//     .then(res =>{showSuccess("record delete");console.log(res);fetchTableData();})
//     .catch(err =>{showError(err.message);})
//   }
// function handleStatus(){
//     setStatus()
// }
  // const showSuccess = (data) => {
  //           setCustAlert({ type: "success", message: data });
  //         };
  //         const showError = (data) => {
  //           setCustAlert({ type: "error", message: data });
  //         };
  //         const handleCloseAlert = () => {
  //           setCustAlert(null);
  //         };
  return (
    <React.Fragment>
     <CustomPageHeader pageHeaderText="Approval List"/>
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
               <Button startIcon={<CheckCircleOutlineIcon />} color="success" variant='contained'>
                Approved
               </Button>
              </TableCell>
               <TableCell>
                <Button startIcon={<CancelIcon />} color="error" variant='contained'>
                Disapproved
               </Button>
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
       {/* <DeleteConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemToDelete={deleteDialog.itemToDelete}
      /> */}
      
      {custAlert && (
        <CustomeAlerts
          type={custAlert?.type}
          message={custAlert?.message}
          onClose={handleCloseAlert}
        />
      )}
    </React.Fragment>
  )
}
