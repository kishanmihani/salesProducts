import React, {  useEffect } from 'react';
import Dialog from "@mui/material/Dialog";
import { Box, Button, DialogContent, IconButton, Stack, Table, TableContainer, TableHead, TextField, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { DataGrid } from "@mui/x-data-grid";
import WhereHourseDropDown from '../../../../commonComponent/WhereHourseDropDown/WhereHourseDropDown';
// import { useDemoData } from '@mui/x-data-grid-generator';
import TankDropDownTwo from '../../../../commonComponent/TankDropDown/TankDropDownTwo';

import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { authAxios } from '../../../../utils/authAxios';
import CustomeAlerts from '../../../../commonComponent/CustomeAlert/CustomeAlert';
import { TankDeleteapi, VesselDataTankapi, VesselEditTankapi,vessailBE_Detail_List } from '../../../../Config/Api';


export default function TankForm({ open,
    setOpen,userId,dataInfo}) {
      const columns= [
  { field: "tank_ID", hide: true ,headerName:"Id"},
  { field: "terminal_Name", headerName: "WareHouse" },
  { field: "tank_name", headerName: "Tank"},
  { field: "net_Quantity", headerName: "Qut"},
  {field: "col3.5", headerName: "Edit", renderCell: (params) => (
    <IconButton color='primary' onClick={() => handleEdit(params.row)}>< EditSquareIcon /></IconButton>
  )},
  {field: "col4", headerName: "Delete", renderCell: (params) => (
    <IconButton color='error' onClick={() => handleDelete(params.row)}><DeleteIcon /></IconButton>
  )}
];
      const [selectedWhereHouse,setSelectedWhereHouse] = React.useState("Select")
      const [errorsWhereHouse,setErrorsWhereHouse] = React.useState(false);
      const [selectedTank,setSelectedTank] = React.useState("Select")
      const [errorsTank,setErrorsTank] = React.useState(false);
      const [quantity,setQuantity] = React.useState(0);
      const [quantityError,setQuantityError] = React.useState("")
      const [custAlert, setCustAlert] = React.useState(null);
      const [tanklist,setTanklist] = React.useState([]);
      const [tanklistCheck,setTanklistCheck] = React.useState(false);
      const [selectEdit,setSelectEdit] = React.useState(false);
      const [tankId,setTankId] = React.useState();
      let Tot=tanklist.map(data => Number(data?.net_Quantity)).reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
      const CustomFooter = () => (
        <Box sx={{ p: 1, textAlign: "right", backgroundColor: "#f9f9f9" }}>
           <Box display="flex" justifyContent="space-between" width="100%">
    <Box width="50%" sx={{textAlign:"start"}}>TOT Allocated</Box>:
    <Box width="50%" >{Tot}</Box>
  </Box>
  <Box display="flex" justifyContent="space-between" width="100%"><Box width="50%" sx={{textAlign:"start"}}>OTR Quantity</Box>:<Box width="50%">{dataInfo?.otrQut}</Box></Box>
          <Box display="flex" justifyContent="space-between" width="100%"><Box width="50%" sx={{textAlign:"start"}}>TOT Unallocated</Box>:<Box width="50%">{(dataInfo?.grossQuantity - Tot - dataInfo?.otrQut)}</Box></Box>
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
          async  function handleSubmit(){
           let hasError=false;
           if(selectedWhereHouse == "Select"){
            setErrorsWhereHouse(true);
            hasError=true;
           }
           else{
            setErrorsWhereHouse(false)
           }
           if(quantity == 0 || quantity == ""){
            setQuantityError("Quantity is required");
            hasError=true;
          }else if(quantity  < 0){
            setQuantityError("Quantity can not be nagetive");
            hasError=true;
          }else if(quantity > (dataInfo?.grossQuantity - Tot - dataInfo?.otrQut)){
                             setQuantityError("Quantity not greater Unallocated value")
                          hasError=true;
                            }else{
            setQuantityError("")
          }
          if(selectedTank == "Select"){
            setErrorsTank(true)
            hasError=true;
          }

           if(!hasError && !dataInfo?.isEdit){
            // let data={
            //   id:tanklist.length  + 1,
            //   col1:selectedWhereHouse,
            //   col2:selectedTank,
            //   col3:quantity
            // }
            let datasend={
              "User_Id": userId,
              "Vessal_Name": dataInfo?.vessalName,
              "Vessal_No": dataInfo?.vessalNumber,
              "BE_No": dataInfo.BoeNo,
              "Tank": selectedTank,
              "Terminal_Name":selectedWhereHouse ,
              "Quantity": quantity
            }
            await authAxios
                                    .post(VesselDataTankapi, JSON.stringify(datasend))
                                    .then((res) => {
                                      if (res.data.massage == "Entry Done") {
                                        showSuccess("Records Submited");
                                        Tanklist();
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
              // setTanklist((prev)=>([...prev,data]));
              setSelectedTank("Select");
              setSelectedWhereHouse("Select")
              setQuantity(0)
           }
           else if(!hasError  && dataInfo.isEdit){

            // alert(dataInfo.isEdit)
            authAxios.post(VesselEditTankapi,{
  "user_id": userId,
  "BE_No":dataInfo?.BoeNo,
  "Terminal_Name": selectedWhereHouse,
  "Tank_name": selectedTank,
  "Net_Quantity": quantity,
  "Tank_ID": dataInfo?.tank_ID
})
.then((res) => {
                                      if (res.data.massage == "Update Done") {
                                        showSuccess("Records Submited");
                                        
                                        // handleClose();
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
          }
          useEffect(()=>{
           const {tank_name,terminal_Name,Quantity,isEdit} = dataInfo;
           if(isEdit === true){
           setSelectedTank(tank_name);
                 setSelectedWhereHouse(terminal_Name);
                 setQuantity(Quantity);
           }
          },[dataInfo,setSelectedTank,setSelectedWhereHouse,setQuantity])
          
          
          // useEffect(()=>{

            // if(!tanklistCheck){
            //   setTanklistCheck(true)
            // Tanklist()
            
            // }
            useEffect(() => {
              // console.log("vvg gggggggggggggggggggggggggggggggg   no")
  if (!tanklistCheck) {
    // console.log("vvg gggggggggggggggggggggggggggggggg")
    // setTanklistCheck(true);
    let datasend={
              "User_Id": userId,
              "Vessal_Name": dataInfo?.vessalName,
              "Vessal_No": dataInfo?.vessalNumber,
              "BE_No": dataInfo.BoeNo,
            }
            authAxios.post(vessailBE_Detail_List,datasend)
            .then(res =>{ setTanklist(res?.data?.tanK_BE);setTanklistCheck(true);})
            .catch(err => console.log(err))
  }
}, [dataInfo.BoeNo, dataInfo.vessalName, dataInfo.vessalNumber, tanklistCheck, userId]);
          // },[ tanklistCheck])
       const  Tanklist= async () =>{
            let datasend={
              "User_Id": userId,
              "Vessal_Name": dataInfo?.vessalName,
              "Vessal_No": dataInfo?.vessalNumber,
              "BE_No": dataInfo.BoeNo,
            }
            authAxios.post(vessailBE_Detail_List,datasend)
            .then(res => setTanklist(res?.data?.tanK_BE))
            .catch(err => console.log(err))
          }
          function handleEdit(row){
              console.log(row)
              const {terminal_Name,
tank_ID,net_Quantity,tank_name
} = row
              setSelectedWhereHouse(terminal_Name);
              setSelectedTank(tank_name);
              setQuantity(net_Quantity);
              setSelectEdit(true);
              setTankId(tank_ID);
          }
         function handleSaveEdit(){
             authAxios.post(VesselEditTankapi,{
  "user_id": userId,
  "BE_No":dataInfo?.BoeNo,
  "Terminal_Name": selectedWhereHouse,
  "Tank_name": selectedTank,
  "Net_Quantity": quantity,
  "Tank_ID": tankId
})
.then((res) => {
                                      if (res.data.massage == "Update Done") {
                                        showSuccess("Records Submited");
                                        Tanklist();
                                        setQuantity(0);
                                        setSelectedWhereHouse();
                                        setTankId();
                                        setSelectedTank();
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
  "Tank_ID": row.tank_ID})
  .then(res => { if (res.data.massage == "Update Done") {
                                        showSuccess("Records Deleted");
                                        Tanklist()            
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
                  {dataInfo?.isEdit === true? "Edit " : ""} Tank Details
                  </Typography>
                  <IconButton onClick={handleClose}>
                  <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Stack spacing={2}
              direction={{ xs: "column", md: "row" }}
              sx={{ p: 1 }}>
            <DialogContent sx={{py:0}}>
              <TextField
                          required
                          id="name"
                          name="name"
                          label="BOE No"
                          disabled={true}
                          value={dataInfo?.BoeNo}
                          type="text"
                          fullWidth
                          variant="standard"
                        />
            </DialogContent>
            <DialogContent sx={{py:0}}>
              <TextField
                          
                          required
                          id="name"
                          name="name"
                          label="Gross Qut"
                          disabled={true}
                          value={dataInfo?.grossQuantity}
                          type="text"
                          fullWidth
                          variant="standard"
                        />
                        
            </DialogContent>
            <DialogContent sx={{py:0}}>
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
      mt: 0, // Applies to direct children only
    }}}>
            <WhereHourseDropDown selectedWhereHouse={selectedWhereHouse}
    setSelectedWhereHouse={setSelectedWhereHouse}
    errorsWhereHouse={errorsWhereHouse}
    setErrorsWhereHouse={setErrorsWhereHouse}
    variant="standard"
    NotIsLis={false} />
            </DialogContent>
            <DialogContent sx={{width:"100%",py:0,"& > div": {
      mt: 0, // Applies to direct children only
    },
}}>
           < TankDropDownTwo selectedTank={selectedTank}
  setSelectedTank={setSelectedTank}
  errorsTank={errorsTank}
  setErrorsTank={setErrorsTank}
  variant="standard"
  NotIsList={false} />
                        
            </DialogContent>
            <DialogContent sx={{width:"100%",py:0}}>
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
                            else if(value > (dataInfo?.grossQuantity - Tot - dataInfo?.otrQut)){
                             setQuantityError("Quantity not greater Unallocated value")
                            }else{
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
            p:2,
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
            <DataGrid disableColumnMenu={true} getRowId={(row) => row.tank_ID} rows={tanklist} columns={columns} 
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
