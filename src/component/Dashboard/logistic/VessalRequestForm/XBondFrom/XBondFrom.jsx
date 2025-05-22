import React, { useEffect, useState } from 'react'
import CustomPageHeader from '../../../../commonComponent/CustomPageHeader/CustomPageHeader';
import Dialog from "@mui/material/Dialog";
import { Box, Button, DialogContent,FormControl, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { DataGrid } from "@mui/x-data-grid";
import WhereHourseDropDown from '../../../../commonComponent/WhereHourseDropDown/WhereHourseDropDown';
// import { useDemoData } from '@mui/x-data-grid-generator';
import TankDropDownTwo from '../../../../commonComponent/TankDropDown/TankDropDownTwo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { authAxios } from '../../../../utils/authAxios';
import CustomeAlerts from '../../../../commonComponent/CustomeAlert/CustomeAlert';
import {TankDeleteapi, vessailBE_Detail_List, VesselDataBEapi, VesselEditTankapi } from '../../../../Config/Api';
// import formatDateToUS from '../../../../utils/DateFormate';



export default function XBondForm({ open,
    setOpen,userId,dataInfo}) {
      const columns= [
  { field: "x_BE_ID", hide: true ,headerName:"id"},
  { field: "xbE_date", headerName: "Date" },
  { field: "xbE_NO", headerName: "Bill entry"},
  { field: "xbE_Qty", headerName: "Qut"},
  {field: "col3.5", headerName: "Edit", renderCell: (params) => (
    <IconButton color='primary' onClick={() => handleEdit(params?.row)}>< EditSquareIcon /></IconButton>
  )},
  {field: "col4", headerName: "Delete", renderCell: (params) => (
    <IconButton color='error' onClick={() => handleDelete(params.row)}><DeleteIcon /></IconButton>
  )}
];
      const [selectedDate,setSelectedDate] = React.useState("Select")
      const [errorsDate,setErrorsDate] = React.useState(false);
    const [Billentry,setBillEntry] = useState("")
    const [BillentryError,setBillentryError] = useState("")
      const [quantity,setQuantity] = React.useState(0);
      const [quantityError,setQuantityError] = React.useState("")
      const [xBondlist,setXBondlist] = React.useState([]);
      // const [tanklist,setTanklist] = React.useState([]);
      const [selectEdit,setSelectEdit] = React.useState(false);
      const [xBondId,setXBondId] = React.useState()
            const [xBondlistCheck,setXBondlistCheck] = React.useState(false);
      const [custAlert, setCustAlert] = React.useState(null);
      let Tot=xBondlist.map(data => Number(data?.xbE_Qty)).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
      const CustomFooter = () => (
        <Box sx={{ p: 1, textAlign: "right", backgroundColor: "#f9f9f9" }}>
           <Box display="flex" justifyContent="space-between" width="100%">
    <Box width="50%" sx={{textAlign:"start"}}>TOT Allocated</Box>:
    <Box width="50%" >{Tot}</Box>
  </Box>
  
          <Box display="flex" justifyContent="space-between" width="100%"><Box width="50%" sx={{textAlign:"start"}}>TOT Unallocated</Box>:<Box width="50%">{(dataInfo?.grossQuantity - Tot )}</Box></Box>
        </Box>
      );
        const handleClose = () => {
            setOpen(false);
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
        
       async   function handleSubmit(){
           let hasError=false;
        
           if(quantity == 0 || quantity == ""){
            setQuantityError("Quantity is required");
            hasError=true;
          }else if(quantity  < 0){
            setQuantityError("Quantity can not be nagetive");
            hasError=true;
          }else if(quantity > (dataInfo?.grossQuantity - Tot)){
                             setQuantityError("Quantity not greater Unallocated value")
                           hasError=true;
                            }else{
            setQuantityError("")
          }
        if(Billentry == 0 || Billentry == ""){
            setBillentryError("OutBond bill is required")
            hasError=true;
        }else if(Billentry  < 0){
            BillentryError("OutBond bill can not be nagetive");
            hasError=true;
        }
        if(selectedDate == 0 || selectedDate == ""|| selectedDate== null){
            setErrorsDate("bill date is required")
            hasError=true;
        }
           if(!hasError && !dataInfo?.isEdit){
            // let data={
            //   id:tanklist.length  + 1,
            //   col1:formatDateToUS( selectedDate),
            //   col2:Billentry,
            //   col3:quantity
            // }
            let datasend={
              "User_Id": userId,
             "Vessal_Name": dataInfo?.vessalName,
              "Vessal_No": dataInfo?.vessalNumber,
              "BE_No": dataInfo.BlNo,
              "XBE_date": selectedDate,
              "XBE_NO": Billentry,
              "XBE_Qty": quantity
            }
            await authAxios
                        .post(VesselDataBEapi, JSON.stringify(datasend))
                        .then((res) => {
                          if (res.data.massage == "Entry Done") {
                            showSuccess("Records Submited");
                            Xbondlist()
                          } else {
                            showError(res.data.message);
                          }
                        })
                        .catch((err) => {
                          if (err.massage == "Network Error") {
                            showError("Network Error");
                          } else {
                            showError(err.message);
                          }
                        });
                        Xbondlist()
              // setXBondlist((prev)=>([...prev,data]));
            setBillEntry("");
            setSelectedDate("")
              setQuantity(0)
           }
           else if(!hasError &&  dataInfo?.isEdit){
authAxios.post(VesselEditTankapi,{
  "user_id": userId,
  "BE_No":dataInfo?.BlNo,
  "XBE_date": selectedDate,
  "XBE_NO": Billentry,
  "Net_Quantity": quantity,
  "X_BE_ID": dataInfo?.X_BE_ID
})
.then((res) => {
                                      if (res?.data?.massage == "Update Done") {
                                        showSuccess("Records Submited");
                                        handleClose();
                                      } else {
                                        showError(res?.data?.message);
                                      }
                                    })
                                    .catch((err) => {
                                      if (err.massage == "Network Error") {
                                        showError("Network Error");
                                      } else {
                                        showError(err?.message);
                                       }
                                    });
           }
          }

          useEffect(()=>{
                     const {Quantity,XBE_date,xbE_NO,isEdit} = dataInfo;
                     if(isEdit === true){
                      setQuantity(Quantity)
                      setSelectedDate(XBE_date)
                      setBillEntry(xbE_NO)
                    //  setSelectedTank(tank_name);
                    //        setSelectedWhereHouse(terminal_Name);
                    //        setQuantity(Quantity);
                     }
                    },[dataInfo])
                    const  Xbondlist= async () =>{
                                let datasend={
                                  "User_Id": userId,
                                  "Vessal_Name": dataInfo?.vessalName,
                                  "Vessal_No": dataInfo?.vessalNumber,
                                  "BE_No": dataInfo.BlNo,
                                }
                                authAxios.post(vessailBE_Detail_List,datasend)
                                .then(res =>{ setXBondlist(res?.data?.xbE_BE);setXBondlistCheck(true)})
                                .catch(err => console.log(err))
                              }
                useEffect(() => {
                              // console.log("vvg gggggggggggggggggggggggggggggggg   no")
                  if (!xBondlistCheck) {
                    // console.log("vvg gggggggggggggggggggggggggggggggg")
                    // setTanklistCheck(true);
                    let datasend={
                              "User_Id": userId,
                              "Vessal_Name": dataInfo?.vessalName,
                              "Vessal_No": dataInfo?.vessalNumber,
                              "BE_No": dataInfo.BlNo,
                            }
                            authAxios.post(vessailBE_Detail_List,datasend)
                            .then(res => setXBondlist(res?.data?.xbE_BE))
                            .catch(err => console.log(err))
                  }
                }, [dataInfo.BlNo, dataInfo.vessalName, dataInfo.vessalNumber, xBondlistCheck, userId]);
    // bE_No: "99", xbE_date: "5/13/2025 12:00:00 AM", xbE_NO: "yy", xbE_Qty: "2", x_BE_ID: "21"
     function handleEdit(row){
              console.log(row)
              const {xbE_date,
x_BE_ID,xbE_Qty,xbE_NO
} = row  ;
   setSelectedDate(xbE_date);
   setQuantity(xbE_Qty);

   setSelectEdit(true);
   setXBondId(x_BE_ID);
   setBillEntry(xbE_NO)
     } 
     function handleSaveEdit(){
                  authAxios.post(VesselEditTankapi,{
       user_id: userId,
       BE_No:dataInfo?.BlNo,
       XBE_NO: Billentry,
       XBE_date: selectedDate,
       XBE_Qty: quantity,
       X_BE_ID: xBondId
     })
     .then((res) => {
                                           if (res.data.massage == "Update Done") {
                                             showSuccess("Records Submited");
                                            Xbondlist()
                                             setQuantity(0);
                                             setXBondId();
                                             setBillEntry("")
                                             setSelectedDate(null);
                                             setSelectEdit(false);
                                           } else {
                                             showError(res.data.message);
                                           }
                                         })
                                         .catch((err) => {
                                           if (err.massage == "Network Error") {
                                             showError("Network Error");
                                           } else {
                                             showError(err.message);
                                            }
                                         });
               }  
               function handleDelete(row){
                            authAxios.post(TankDeleteapi,{
                 "user_id": userId,
                 "X_BE_ID": row.x_BE_ID})
                 .then(res => { if (res.data.massage == "Update Done") {
                                                       showSuccess("Records Deleted");
                                                       Xbondlist()            
                                                       setSelectEdit(false);
                                                     } else {
                                                       showError(res.data.message);
                                                     }
                                                   })
                                                   .catch((err) => {
                                                     if (err.massage == "Network Error") {
                                                       showError("Network Error");
                                                     } else {
                                                       showError(err.message);
                                                      }
                                                   });
                         }
  return (
    <React.Fragment>
<Dialog sx={{minWidth:320,width:"100%"}}
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleClose();
          }
        }}
        slotProps={{
          paper: {
            component: "form"
          },
        }}
      >
        <Box
                  sx={{
                    p: 1,
                    position: "sticky",
                    top: 0,
                    bgcolor: "#ffff",
                    borderBottom: 1,
                    zIndex: 4,
                    display: "flex",
                  }}
                >
                
                  <Typography variant="h5" align="center" width="100%">
                    X-Bond Bill of Entry
                  </Typography>
                  <IconButton onClick={handleClose}>
                  <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Stack spacing={2}
              direction={{ xs: "column", md: "row" }}
              sx={{ p: 1,}}>
            <DialogContent sx={{py:0}}>
              <TextField
                          required
                          id="name"
                          name="name"
                          disabled={true}
                          label="Be No"
                          value={dataInfo?.BlNo}
                          type="text"
                          fullWidth
                          variant="standard"
                        />
            </DialogContent>
            <DialogContent sx={{py:0}}>
              <TextField
                          
                          required
                          id="name"
                          disabled={true}
                          name="name"
                          label="Bl Qut/Gross Qut"
                          value={dataInfo?.grossQuantity}
                          type="number"
                          fullWidth
                          variant="standard"
                        />
                        
            </DialogContent>
            <DialogContent sx={{py:0}} >
              <TextField
                          
                          required
                          id="name"
                          name="name"
                          disabled={true}
                          label="Net Qut"
                          value={dataInfo?.NetQuantity}
                          type="text"
                          fullWidth
                          variant="standard"
                        />
            </DialogContent>
            </Stack>
            <Stack spacing={2}
              direction={{ xs: "column", md: "row" }}
              sx={{ p: 1, py: 0,pt:0 }}>
            <DialogContent sx={{width:"100%",py:0,"& > div": {
      mt: 0, 
    }}}>
            <FormControl  fullWidth size="small" error={errorsDate}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Date"
                              value={dayjs(selectedDate)}
                              onChange={(newValue) => {
                                if(newValue == "" || newValue == null){
                                    setErrorsDate("Bill date is required")
                                }
                                setSelectedDate(newValue);
                              }}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  variant: "standard",
                                  fullWidth: true,
                                  error: errorsDate,
                                  helperText: errorsDate
                                    ? "Bill Date is required"
                                    : ``,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
            </DialogContent>
            <DialogContent sx={{width:"100%",py:0,"& > div": {
      mt: 0, // Applies to direct children only
    },
}}>
           <TextField
                          
                          required
                          size='small'
                          id="Quantity"
                          name="Quantity"
                          label="Outbond Bill of entry"
                          value={Billentry}
                          onChange={(e)=>{
                            let value=e.target.value;
                            if(value == 0 || value == ""){
                                setBillentryError("OutBond bill is required")
                            }else if(value  < 0){
                                BillentryError("OutBond bill can not be nagetive")
                            }
                            else{
                              setBillentryError("")
                            }
                            setBillEntry(value)
                          }}
                          type="text"
                          fullWidth
                          error={BillentryError}
                          helperText={BillentryError}
                          variant="standard"
                        />
                        
            </DialogContent>
            <DialogContent sx={{width:"100%",py:0}}>
            {/* <Box width={"100%"}> */}
              <TextField
                          
                          required
                          size='small'
                          id="Quantity"
                          name="Quantity"
                          label="Quantity"
                          value={quantity}
                          onChange={(e)=>{
                            let value=e.target.value;
                            if(value == 0 || value == ""){
                              setQuantityError("Quantity is required")
                            }else if(value  < 0){
                              setQuantityError("Quantity can not be nagetive")
                            }
                            else if(value > (dataInfo?.grossQuantity - Tot)){
                             setQuantityError("Quantity not greater Unallocated value")
                            }
                            else{
                              setQuantityError("")
                            }
                            setQuantity(value)
                          }}
                          type="number"
                          fullWidth
                          error={quantityError}
                          helperText={quantityError}
                          variant="standard"
                        />
            </DialogContent>
            {/* </Box> */}
            </Stack>
            <Box sx={{
            p:1,
            width: "100%",
            display: "flex",
            position:"relative",
            justifyContent: "flex-end",
          }}>
              {selectEdit !==true &&    <Button
                                          sx={{ textTransform: "capitalize",mr:1 }}
                                          variant="contained"
                                          color="success"
                                          type="button"
                                          onClick={handleSubmit}
                                        >
                                          Submit
                                        </Button>}
                          {selectEdit ==true &&    <Button
                                          sx={{ textTransform: "capitalize",mr:1 }}
                                          variant="contained"
                                          color="success"
                                          type="button"
                                          onClick={handleSaveEdit}
                                        >
                                          Save
                                        </Button>}
            </Box>
            <div style={{ width: "96%",margin:"auto", marginBottom:"3px",display:dataInfo?.isEdit === true ? "none":"block"}}>
            <DataGrid getRowId={(row) => row?.x_BE_ID} rows={xBondlist} columns={columns} 
             slots={{ footer: CustomFooter }}
  hideFooterPagination
   />
              
            </div>
            
      </Dialog>
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
