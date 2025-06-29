// import React,{useState} from 'react'
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Typography, Box, TextField, Paper, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, TablePagination, IconButton } from '@mui/material';
import BillingDropDownTwo from '../../component/commonComponent/BillingDropDown/BillingDropDownTwo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteIcon from "@mui/icons-material/Delete"; 
import CustomeAlerts from '../../component/commonComponent/CustomeAlert/CustomeAlert';
import CustomerDropDownTwo from '../../component/commonComponent/CustomerDropDown/CustomerDropDowntwo';
import ReceiptTypeDropdown from '../../component/commonComponent/recipttype/ReceiptTypeDropdown';
import { authAxios } from '../../component/utils/authAxios';
import CustomPageHeader from '../../component/commonComponent/CustomPageHeader/CustomPageHeader';
import { TableRows } from '@mui/icons-material';
export default function ReciptFrom() {
const [tableHeaders] = useState([
  "S.N",
  "Customer Name",
  "payment_Type",
  "date",
  "so_No",
   "tds",
 "amount",
  "Delete"
]);
const [billing, setBilling] = useState("Select");
const [billingError, setBillingError] = useState(false);
const [entryDate,setEntryDate] = useState(null);
const [errorDate,seErrorDate] = useState(null);
const [reciptData,setReciptData] = useState([]);
const [reciptDataCheck,setReciptDataCheck] = useState(true)
const [custAlert, setCustAlert] = useState(null);
const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(5);
 const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
 const [recipt]=useState(JSON.parse(localStorage.getItem("ReciptFrom")));
  const [formData, setFormData] = useState({
    so_no: 0,
    tds: 0,
    amount: 0,
    errorSo_no:'',
    errorTds:"",
    errorAmount:"",
    receiptType: '',
     errorReceiptType: ''
  });
  useEffect(()=>{
    if(reciptDataCheck  == true){
  let data ={user_id:userId,Customer_Name:recipt.customer}
    
   authAxios.post("BituRep/Api/Account/Recipt_Entry_Select",JSON.stringify(data))
   .then((res)=>{setReciptData(res.data);setReciptDataCheck(false)})
   .catch(err =>{ showError(err.message);setReciptDataCheck(false)})
    }
    setBilling(recipt.customer);
    setFormData((prev) => ({
  ...prev,
  so_no: recipt.so_no}))
  },[userId,reciptData,reciptDataCheck,recipt])
  function Fetchdata(){
    let data ={user_id:userId,Customer_Name:billing}
    authAxios.post("BituRep/Api/Account/Recipt_Entry_Select",JSON.stringify(data))
   .then((res)=>{setReciptData(res.data);})
   .catch(err =>{ showError(err.message);})
    }
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
          const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedData = reciptData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  function handleSubmit() {
  let isValid = true;

  // Validate Billing Dropdown
  if (billing === "Select") {
    setBillingError(true);
    isValid = false;
  } else {
    setBillingError(false);
  }

  // Validate Entry Date
  if (!entryDate) {
    seErrorDate("Entry date is required");
    isValid = false;
  } else {
    seErrorDate("");
  }

  // Validate form fields
  let newErrors = {
    errorSo_no: '',
    errorTds: '',
    errorAmount: '',
    errorReceiptType:''
  };

  if (!formData.so_no || Number(formData.so_no) <= 0) {
    newErrors.errorSo_no = "SO No is required and must be > 0";
    isValid = false;
  }
  if (!formData.tds || Number(formData.tds) < 0) {
    newErrors.errorTds = "TDS must be 0 or greater";
    isValid = false;
  }
  if (!formData.amount || Number(formData.amount) <= 0) {
    newErrors.errorAmount = "Amount is required and must be > 0";
    isValid = false;
  }
  if (!formData.receiptType || Number(formData.receiptType) <= 0) {
    newErrors.errorReceiptType = "receiptType is required";
    isValid = false;
  }

  setFormData((prev) => ({
    ...prev,
    ...newErrors,
  }));

  // If valid, call API or log the data
  if (isValid) {
    const payload = {
      user_id:userId,
      Customer_Name:billing,
      Entry_Date: dayjs(entryDate).format("YYYY-MM-DD"),
      So_No: formData.so_no,
      Tds: formData.tds,
      Amount: formData.amount,
      Recipt_type: formData.receiptType,
    };
    authAxios.post("/BituRep/Api/Account/Recipt_Entry_insert",JSON.stringify(payload))
    .then((res)=>{if(res.data.massage=="Data insert"){showSuccess("Records Inserted");Fetchdata()}})
    .catch((err)=>{showError(err)})
    console.log("Submitting form with payload:", payload);
    
  }
}
  function ResetHandler(){
    setFormData({
    so_no: 0,
    tds: 0,
    amount: 0,
    errorSo_no:'',
    errorTds:"",
    errorAmount:"",
    receiptType: '',
     errorReceiptType: ''
  });
   setBilling("Select");
 setBillingError(false);
setEntryDate(null);
seErrorDate(null);
  }
  function handleDeleteClick(row){
    let datas={"user_id":userId,"Table_Id":row.id}
   authAxios.post("/BituRep/Api/Account/Recipt_Entry_Delete",datas)
   .then(res=>{showSuccess(res.data.message);Fetchdata() })
   .catch(err=> {Fetchdata();showError(err)})
  }

  return (
     <div>
      <CustomPageHeader pageHeaderText="Recipt Form"></CustomPageHeader>
       <Paper sx={{ p: 2 }} elevation={0}>
            <Box sx={{pt:1,display:'flex',gap:2}}>
              {/* <Typography fullWidth> */}
        <CustomerDropDownTwo  errorsCustomerName={billingError} selectedCustomer={billing} setSelectedCustomer={setBilling}setErrorsCustomerName={setBillingError} 
                    variant="standard"
                  />
        <FormControl sx={{pt:2}} fullWidth size="small" error={!!errorDate}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Entry Date"
                                  value={dayjs(entryDate)}
                onChange={(newValue) => {
                    // const newFields = [...fields];
                    const isError = !newValue || newValue === "";
                    if(isError){
                      seErrorDate("Entry date is required")
                    }
                    else{
                      seErrorDate("")
                    }
                    setEntryDate(newValue);
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      variant: "outlined",
                      fullWidth: true,
                      error: errorDate,
                      helperText: errorDate
                        ? "Entry date is required"
                        : ``,
                    },
                  }}
                >

                </DatePicker>
              </LocalizationProvider>
        </FormControl>
        </Box>
        <Box sx={{pt:2,display:'flex',gap:4}}>
        <TextField
            label="SO No"
            name="so_no"
            type="number"
            fullWidth
            variant= "standard"
            size="small"
            // margin="normal"
            value={formData.so_no}
             onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      so_no: value,
      errorSo_no:
        !value || Number(value) <= 0 ? "SO No must be greater than 0" : "",
    }))}}
error={!!formData.errorSo_no}
  helperText={formData.errorSo_no}
          />
          <TextField
            label="TDS"
            name="Tds"
            type="number"
            variant= "standard"
            fullWidth
            size='small'
            // margin="dense"
            value={formData.tds}
           onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tds: value,
      errorTds:
        value === "" || Number(value) < 0 ? "TDS must be 0 or greater" : "",
    }));
  }}
  error={!!formData.errorTds}
  helperText={formData.errorTds}
          />
          </Box>
          <Box sx={{pt:2,display:'flex',gap:4}}>
          <TextField
            label="Amount"
            name="Amount"
            fullWidth
            type="number"
            variant= "standard"
            margin="dense"
            value={formData.amount}
             onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      amount: value,
      errorAmount:
        !value || Number(value) <= 0
          ? "Amount must be greater than 0"
          : "",
    }));
  }}
  error={!!formData.errorAmount}
  helperText={formData.errorAmount}
          />
         <ReceiptTypeDropdown
   value={formData.receiptType}
  onChange={(e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      receiptType: value,
      errorReceiptType: value === "" || value === "Select" ? "Please select receipt type" : "",
    }));
  }}
  error={!!formData.errorReceiptType}
  helperText={formData.errorReceiptType}
/>
          </Box>
        {/* <DialogActions> */}
        <Box sx={{display:"flex",justifyContent:"end", gap:2 ,pt:2}}>
          <Button variant="contained" onClick={ResetHandler} color="error" >Cancel</Button>
          <Button variant="contained" color='success' onClick={handleSubmit} >
            Submit
          </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
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
                </TableRow>
              </TableHead>
              <TableBody>
              {paginatedData.map((row) =>
                <TableRow 
                              key={row.id}
                              sx={{ '&:hover': {
                             backgroundColor: 'grey.200',
                           },'&:last-child td, &:last-child th': { border: 0 } }}
                            >
              <TableCell align="left">{row?.id}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.payment_Type}</TableCell>
              <TableCell align="left">{row?.date}</TableCell>
              <TableCell align="left">{row?.so_No}</TableCell>
              <TableCell align="left">{row?.tds}</TableCell>
              <TableCell align="left">{row?.amount}</TableCell>
              <TableCell align="left"><IconButton aria-label='Delete' onClick={()=>handleDeleteClick(row)} >
                  <DeleteIcon  color='error'/>
                </IconButton></TableCell>
                            </TableRow>
              )} 
                  
                {/* </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
           <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={reciptData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
          </Paper>
          {custAlert && (
                  <CustomeAlerts
                    type={custAlert.type}
                    message={custAlert.message}
                    onClose={handleCloseAlert}
                  />
                )}
        {/* </DialogActions> */}
</div>        
  )
}
