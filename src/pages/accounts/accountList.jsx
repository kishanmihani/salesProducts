import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField,  FormControl, MenuItem, Tabs, Tab, Badge } from '@mui/material';
import React, { useEffect } from 'react';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { Link, useNavigate } from "react-router";
import { authAxios } from '../../component/utils/authAxios';
import DeleteIcon from "@mui/icons-material/Delete";
import CustomPageHeader from '../../component/commonComponent/CustomPageHeader/CustomPageHeader';
import ReciptFrom  from '../reciptFrom/reciptFrom';
import DeleteConfirmationDialog from '../../component/commonComponent/DeleteConfirmationDialog/DeleteConfirmationDialog'; 
import CustomeAlerts from '../../component/commonComponent/CustomeAlert/CustomeAlert';
import { a11yProps } from '../../component/commonComponent/CustomTabPanel/CustomTabPanel';
import  { CustomTab } from '../../component/commonComponent/CustomTabs/CustomTabs';
import { AccountAdvance, AccountCreditApi, vehiclelistapi } from '../../component/Config/Api/Api';
// const tableHeaders = [
//   "So No",
//   "Customer Name",
//   "Vehicle Name",
//   "Actual Qty",
//   "BOE No.",
//   "Port Name",
  
  
//   "Remark",
//   "Status",
//  "Reacipt",
// ];
const cashHeaders = [
  "So No",
  "Customer Name",
  "Vehicle Name",
  "Actual Qty",
  "BOE No.",
  "Port Name",
  "transfer to credit",
  "Receipt",
];

const advanceHeaders = [
  "So No",
  "Customer Name",
   "Port Name",
  "Company name",
  "Advance Payment",
  "Balance Advance",
  // "Status",
  "Recived Amount",
  "transfer to credit",
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
  "Recipt"
];

export default function AccountList() {
  // const [deleteDialog, setDeleteDialog] = React.useState({ isOpen: false, itemToDelete: null });
  const [statusDialog,setStatusDialog] =  React.useState({ isOpen: false, itemToStatus: null });
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState({ api1: null, api2: null, api3: null });
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [custAlert, setCustAlert] = React.useState(null);
  const [statuslist,setStatuslist] = React.useState([]);
  const [checkStatusList,setCheckStatusList]= React.useState(false);
  // const [open, setOpen] = React.useState(false);
  
  const [tabs, setTabs] = React.useState(0);
                const handleTabs = (event, newValue) => {
                setTabs(newValue);
              };
              const activeHeaders =
  tabs === 0 ? advanceHeaders :
  tabs === 1 ? cashHeaders :
  creditHeaders;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(checkStatusList){
      setCheckStatusList(false);
    authAxios.post("/BituRep/Api/Account/Status_Acc_List",JSON.stringify({
      "User_Id":userId
    }))
    .then(res=> setStatuslist(res.data))
    .catch(err=> showError("Some thing went wrong:",err))
  }
  
  },[userId,statuslist,checkStatusList])
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const activeData =
  tabs === 0 ? tableData.api2 || [] :  // Advance tab
  tabs === 1 ? tableData.api1 || [] :  // Cash tab
  tableData.api3 || [];                // Credit tab

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
        vehiclelistapi,
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

    // store all 3 results separately
    setTableData({
      api1: resOne.data,  // cash
      api2: resTwo.data,  // advance
      api3: resThree.data // credit
    });

    setCheckTableData(true);
  } catch (error) {
    setCheckTableData(true);
    showError(error);
  }
};

  function StatusChange(row,value){
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
      "table_id": row?.table_id,
      "status_name": value
    }
    authAxios.post("BituRep/Api/Account/AStatus_update",data)
    .then((res)=>{
     showSuccess( res.data.massage); 
    console.log(res.data.message, res);
    }).catch((err)=>showError(err))
  }
  
  const StatusOpen = (item) => {
    setStatusDialog({ isOpen: true, itemToStatus: item.row,value:item.value });
  };
 
  const handleCloseStatusDialog = () => {
    setStatusDialog({ isOpen: false, itemToDelete: null,value:null });
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
     <CustomPageHeader pageHeaderText="Account List"/>
      <Paper sx={{ p: 2 }} elevation={0}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
                        <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example" sx={{width:"100%",justifyContent:"center"}}>
                     
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
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
  {activeHeaders.map((header, index) => (
    <TableCell
      key={index}
      align="left"
      sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}
    >
      {header}
    </TableCell>
  ))}
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
              {tabs == 0 && <React.Fragment>
                <TableCell align="left">{row?.so_No}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.port_Name}</TableCell>
              <TableCell align="left">{row?.company_Name}</TableCell>
              <TableCell align="left">{row?.adv_Value}</TableCell>
              <TableCell align="left">{row?.rec}</TableCell>
              <TableCell align="left">{row?.bal_Adv}</TableCell>
              <TableCell>
            <Button color="primary">
  Transfer to Credit
</Button>
                                </TableCell>
              <TableCell>
                <Button
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() =>{let data={so_no:row?.so_No,customer:row.customer_Name,Payment_Type:row?.payment_Type};
                                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString()
                                  navigate(`/dashboard/Account/ReciptFrom?${query}`)
                                }}
                                 
                                >
            Recipt
                </Button>
              </TableCell>
                </React.Fragment>}
              {tabs == 1 && 
              <React.Fragment>
              <TableCell align="left">{row?.so_No}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.vehicle_Name}</TableCell>
              <TableCell>
              {row?.a_Qty === ""? "No Actual quantity":row?.a_Qty}
              </TableCell>
              <TableCell>
                {row?.bE_No}
              </TableCell>
              <TableCell align="left">{row?.port_Name}</TableCell>
              <TableCell><Button color="primary">
  Transfer to Credit
</Button>
                                
              </TableCell>
              
              <TableCell>
                <Button
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() =>{let data={so_no:row?.so_No,customer:row?.customer_Name,Payment_Type:"cash Payments"};
                                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString()
                                  navigate(`/dashboard/Account/ReciptFrom?${query}`)
                                }}
                                 
                                >
            Recipt
                </Button>
              </TableCell>
              </React.Fragment>}
              {tabs == 2 && 
              <React.Fragment>
                <TableCell align="left">{row?.so_No}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.port_Name}</TableCell>
              <TableCell align="left">{row?.company_Name}</TableCell>
              <TableCell align="left">{row?.amount}</TableCell>
              <TableCell align="left">{row?.bal_Adv}</TableCell>
              <TableCell align="left">{row?.rec}</TableCell>
              <TableCell align="left">{row?.c_Days}</TableCell>
              <TableCell>
                <Button
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() =>{let data={so_no:row?.so_No,customer:row.customer_Name,Payment_Type:row?.payment_Type};
                                  const query = new URLSearchParams({ data: JSON.stringify(data) }).toString()
                                  navigate(`/dashboard/Account/ReciptFrom?${query}`)
                                }}
                                 
                                >
            Recipt
                </Button>
              </TableCell>
              </React.Fragment>
              }
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
      {/* <ReciptFrom open={open} setOpen={setOpen} handleClose={popupClose} handleOpen={popupOpen} /> */}
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