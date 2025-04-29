import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, Paper,
    Stack,  IconButton,
    FormHelperText,
    TextField
  } from "@mui/material";
  import React, { useState } from "react";
  import { useNavigate } from "react-router";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
  import DeleteIcon from "@mui/icons-material/Delete";
import CustomerDropDownTwo from "../../../commonComponent/CustomerDropDown/CustomerDropDowntwo";
import PortDropDownTwo from "../../../commonComponent/PortDropdown/ProtDropDowntwo";

import { authAxios } from "../../../utils/authAxios";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";
import CustomPageHeader from "../../../commonComponent/CustomPageHeader/CustomPageHeader";
import { alhabetelysort } from "../../../utils/Sorted";
import { vhicleInsert } from "../../../Config/Api";
import ProductDropDownTwo from "../../../commonComponent/ProductDropDown/ProductDropDownTwo";
  export default function LogicRequestForm() {
    const navigate = useNavigate();
    const [vessalName,setVessalNmae] = React.useState("Select");
        const [vessalNameError,setVessalNameError] = React.useState(false)
        const [vessalData,setVessalData] = React.useState([])
        const [vessalInfo,setVessalInfo] = React.useState({
          be_No:"Select",
          be_NoError:false,
          wH_NAME:"Select",wH_NAMEError:false,
          tank:"Select",
          tankError:false,
          bl_No:"Select",
          bl_NoError:false,
          
         })
         
          const [vessalList,setVessalList] = React.useState([]);
    const [customerName, setCustomerName] = React.useState('Select');
    const [portName, setPortName] = React.useState('Select');
    // product_Name:"Select",
    //       product_NameError:false,
    const [productError,setProductError] = useState(false);
          const [selectedProduct,setSelectedProduct] = useState("Select")
    const [fields, setFields] = React.useState([{vehicleName: '',
      vehicleNameError: '',
      quantity: '',
      quantityError: '',transporter:"",transporterError: '' }]);
    const [errorsCustomerName, setErrorsCustomerName] = React.useState(false);
    const [errorsPortName, setErrorsPortName] = React.useState(false);
    const [remark, setRemark] = React.useState("");
    const [custAlert, setCustAlert] = React.useState(null);
    const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
    const showSuccess = (data) => {
      setCustAlert({ type: "success", message: data });
    };
    const showError = (data) => {
      setCustAlert({ type: "error", message: data });
    };
  
    const handleAddFields = () => {
      setFields([...fields, { vehicleName: "", quantity: 0 ,transporter:""}]);
    };
    
    const handleRemoveField = (index) => {
      const updatedFields = fields.filter((_, i) => i !== index);
      setFields(updatedFields);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      let hasError = false;
     
      if (customerName == "Select") {
        setErrorsCustomerName(true)
        hasError = true;
      }
      if (portName == "Select") {
        setErrorsPortName(true)
        hasError = true;
      }
      if(vessalName == "Select"){
        setVessalNameError(true)
        hasError = true;
      }
      if(vessalName !== "Select"){
        if(vessalInfo.be_No == "Select"){
          setVessalInfo((prev)=>({...prev,be_NoError:true }));
          hasError = true;
        }
        if(vessalInfo.bl_No == "Select"){
          setVessalInfo((prev)=>({...prev,bl_NoError:true }));
          hasError = true;
        }
        if(vessalInfo.tank == "Select"){
          setVessalInfo((prev)=>({...prev,tankError:true }));
          hasError = true;
        }
        if(vessalInfo.wH_NAME == "Select"){
          setVessalInfo((prev)=>({...prev,wH_NAMEError:true }));
          hasError = true;
        }
        
      }
      if(selectedProduct == "Select"){
        setProductError(false)
        // setVessalInfo((prev)=>({...prev,product_NameError:true}))
        hasError = true;
      }
      const updatedFields = fields.map((field) => {
        const updatedField = { ...field };
    
        if (field.vehicleName.trim() === "") {
          updatedField.vehicleNameError = "Vehicle Name is required";
          hasError = true;
        } else if (!/^[A-Za-z\s]+$/.test(field.vehicleName)) {
          updatedField.vehicleNameError = "Only letters and spaces allowed";
          hasError = true;
        } else {
          updatedField.vehicleNameError = "";
        }
    
        if (field.quantity === "" || Number(field.quantity) === 0) {
          updatedField.quantityError = "Quantity must be greater than 0";
          hasError = true;
        } else if (Number(field.quantity) < 0) {
          updatedField.quantityError = "Quantity cannot be negative";
          hasError = true;
        } else {
          updatedField.quantityError = "";
        }
        if(field.transporter == ""){
          updatedField.transporterError="Transporter name is required"
          hasError = true;
        } else if (!/^[A-Za-z\s]+$/.test(field.transporter)) {
          updatedField.transporterError = "Only letters and spaces allowed";
          hasError = true;
        }else {
          updatedField.transporterError = "";
        }
        return updatedField;
      });
    
      setFields(updatedFields);
    
      if (!hasError) {
        console.log("Form Data Submitted:", {
          customerName,
          portName,
          fields: updatedFields,
          remark,
        });
        let count=0;
        for(let arr of fields){
          
          count++;
         var data={
          "user_id": userId,
          "Customer_Name": customerName,
          "vehicle_Name": arr.vehicleName,
          "Transporter_Name":arr.transporter,
          "Port_Name": portName,
          "Quantity": arr.quantity,
          "Remark": remark,
          "Vessel_Name": vessalName.replaceAll("|", ",").split(",")?.[0],
          "Vessel_No": vessalName.replaceAll("|", ",").split(",")?.[1],
          "Tank_name": vessalInfo?.tank,
           "Produce_Name":selectedProduct,
          // "cha_No":vessalInfo?.cha_Name,
          "BE_No": vessalInfo.be_No,
          "BL_No": vessalInfo.bl_No,
          "Do_No": arr.quantity+"/"+arr.vehicleName+"/"+vessalInfo.bl_No+"/"+portName,
        }
          await authAxios.post(vhicleInsert,JSON.stringify(data))
          .then((res)=>{
          if (res.data.massage == "Entry Done") {
                      showSuccess("Records Submited")
                      }else {
                        showError(res.data.message)
                      }
                      if(count === fields.length ){
                        handleReset()
                        navigate("/dashboard/Logistic/Logistic_Pending_form")
                      }
         })
          .catch((err)=>{if (err.massage == "Network Error") {
          showError("Network Error")
          }else {
            showError(err.message)
          }})
        }
    
        
      }
    };
    const handleReset = () => {
      setCustomerName("Select");
      setPortName("Select");
      setRemark("");
      setFields([{vehicleName: '',
        vehicleNameError: '',
        quantity: '',
        quantityError: '',transporter:"",transporterError:"" }]);
      setErrorsCustomerName(false)
      setErrorsPortName(false)
     setVessalNmae("");
     setVessalInfo({
      be_No:"Select",
      be_NoError:false,
      wH_NAME:"Select",wH_NAMEError:false,
      tank:"Select",
      tankError:false,
      bl_No:"Select",
      bl_NoError:false,
     })
     setSelectedProduct("Select");
     setProductError(false);
    }
    const handleClose = () => {
      setCustAlert(null)
     };
    React.useEffect(()=>{
             if(vessalList.length == 0){
                 authAxios.post("/BituRep/Api/Account/VesselName_List",JSON.stringify({
                   "User_Id":userId
                 }))
                 .then(res=>setVessalList(res.data))
                 .catch(err=> console.log(err.message))
               }
         },[vessalList,setVessalList,userId])
         function VessalChange(value) {
          if(value == "Select"){
            setVessalNameError(true)
          }
          else{
            setVessalNameError(false)
          }
          setVessalNmae(value);
          const data = {
            "user_id": userId,
            "Vessal_Name": value.replaceAll("|", ",").split(",")?.[0],
            "Vessal_No": value.replaceAll("|", ",").split(",")?.[1],
          }
          authAxios.post("BituRep/Api/Account/Vessel_Detail_List",data)
          .then(res=>{setVessalData(res.data)
            setVessalInfo((prev)=>({...prev,be_No:"Select",
              be_NoError:false,
              wH_NAME:"Select",wH_NAMEError:false,
              tank:"Select",
              tankError:false,
              bl_No:"Select",
              bl_NoError:false}));  
          })
          .catch((err)=>err.message)
    
        }
    return (
      <React.Fragment>
        <CustomPageHeader pageHeaderText="Vhicle Form"/>
  
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 2 }} elevation={0}>
            <Stack
              spacing={2}
              direction={{ xs: "column", md: "row" }}
              sx={{ p: 2, pb: 0 }}
            >
                <CustomerDropDownTwo errorsCustomerName={errorsCustomerName} setErrorsCustomerName={setErrorsCustomerName} selectedCustomer={customerName} setSelectedCustomer={setCustomerName} />
                <PortDropDownTwo errorsPortName={errorsPortName} setErrorsPortName={setErrorsPortName} selectedPort={portName} setSelectedPort={setPortName} />
                
               <TextField
                fullWidth
                size="small"
                margin="normal"
                id="Remark"
                name="Remark"
                label="Remark"
                multiline
                rows={1}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Stack>
            <Stack
                        spacing={2}
                        direction={{ xs: "row" }}
                        sx={{
                          p: 2,
                          pb: 0,
                          justifyContent: "start",
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                        >
                         <ProductDropDownTwo variant="standard" errorsProduct={productError} setErrorsProduct={setProductError} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />          
                          <FormControl variant="standard" fullWidth size='small' error={vessalNameError}>
                             <InputLabel id="demo-simple-select-label">Vessal name</InputLabel>
                            <Select 
                            label="Vessal name"
                            value={vessalName }
                            onChange={(e)=>VessalChange(e.target.value)}  >
                             <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                            {vessalList.map(data=>(
                              <MenuItem key={data.vesselName_List}  value={data.vesselName_List}>{data.vesselName_List.replaceAll("|", ",").split(",")[0]}</MenuItem>
                            ))}
                            </Select>
                            {vessalNameError && <FormHelperText>Vessal name is required</FormHelperText>}
                            </FormControl>
                           {vessalData.length !== 0 && <FormControl variant="standard" fullWidth size='small' error={vessalInfo.be_NoError}>
                             <InputLabel id="demo-simple-select-label">Be No</InputLabel>
                            <Select 
                            label="Be No"
                            value={vessalInfo.be_No }
                            onChange={(e)=>{
                            let value=e.target.value;
                            if(value == "Select"){
                              setVessalInfo((prev)=>({...prev,be_NoError:true}));
                            }else{
                              setVessalInfo((prev)=>({...prev,be_NoError:false})); 
                            }
                            setVessalInfo((prev)=>({...prev,be_No:value}))
                            } } >
                             <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                            {alhabetelysort(vessalData?.bE_No,"view_List").map((data,index)=>(
                              <MenuItem key={`${data?.view_List}${index}`}  value={data?.view_List}>{data?.view_List}</MenuItem>
                            ))}
                            </Select>
                            {vessalInfo.be_NoError && <FormHelperText>Be No is required</FormHelperText>}
                            </FormControl>}
                            
                        </Stack>
                        <Stack
                        spacing={2}
                        direction={{ xs: "row" }}
                        sx={{
                          p: 2,
                          pb: 0,
                          justifyContent: "start",
                          borderWidth: 1,
                          borderColor: "black",
                        }}
                        >
                          {vessalData.length !== 0 && <FormControl variant="standard" fullWidth size='small' error={vessalInfo.bl_NoError}>
                             <InputLabel id="demo-simple-select-label">Bl No</InputLabel>
                            <Select 
                            label="Bl No"
                            value={vessalInfo.bl_No }
                            onChange={(e)=>{
                              let value=e.target.value;
                              if(value == "Select"){
                                setVessalInfo((prev)=>({...prev,bl_NoError:true}))
                              }else {
                                setVessalInfo((prev)=>({...prev,bl_NoError:false}))
                              }
                              setVessalInfo((prev)=>({...prev,bl_No:value}))}}  >
                             <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                            {alhabetelysort(vessalData?.bl_No,"view_List").map((data,index)=>(
                              <MenuItem key={`${data?.view_List}${index}`}  value={data?.view_List}>{data?.view_List}</MenuItem>
                            ))}
                            </Select>
                            {vessalInfo.bl_NoError && <FormHelperText>Bl No is required</FormHelperText> }
                            </FormControl>}
                          {vessalData.length !== 0 && <FormControl variant="standard" fullWidth size='small' error={vessalInfo.tankError}>
                             <InputLabel id="demo-simple-select-label">tank Name</InputLabel>
                            <Select 
                            label="tank Name"
                            value={vessalInfo.tank }
                            onChange={(e)=>{
                              let value=e.target.value;
                              if(value == "Select"){
                                setVessalInfo((prev)=>({...prev,tankError:true}))
                              }else{
                                setVessalInfo((prev)=>({...prev,tankError:false}))
                              }
                              setVessalInfo((prev)=>({...prev,tank:e.target.value}))}}  >
                             <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                            {alhabetelysort(vessalData?.tank,"view_List").map((data,index)=>(
                              <MenuItem key={`${data?.view_List}${index}`}  value={data?.view_List}>{data?.view_List}</MenuItem>
                            ))}
                            </Select>
                            {vessalInfo.tankError && <FormHelperText>tank is required</FormHelperText>}
                            </FormControl>}
                            {vessalData.length !== 0 && <FormControl variant="standard" fullWidth size='small' error={vessalInfo.wH_NAMEError}>
                             <InputLabel id="demo-simple-select-label">WareHouse Name</InputLabel>
                            <Select 
                            label="WareHouse Name"
                            value={vessalInfo.wH_NAME }
                            onChange={(e)=>{
                              let value=e.target.value;
                              if(value == "Select"){
                                setVessalInfo((prev)=>({...prev,wH_NAMEError:true}))
                              }
                              else{
                                setVessalInfo((prev)=>({...prev,wH_NAMEError:false}))
                              }
                              setVessalInfo((prev)=>({...prev,wH_NAME:value}))}}  >
                             <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                            {alhabetelysort(vessalData?.wH_NAME,"view_List").map((data,index)=>(
                              <MenuItem key={`${data?.view_List}${index}`}  value={data?.view_List}>{data?.view_List}</MenuItem>
                            ))}
                            </Select>
                            {vessalInfo.wH_NAMEError && <FormHelperText>WareHouse is required</FormHelperText>}
                            </FormControl>}
                            
                        </Stack>
            <Box sx={{ p: 2 }}>
              <Button
                variant="outlined"
                sx={{ p: 1, fontSize: "12px", borderRadius: 6 }}
                color="success"
                onClick={handleAddFields}
              >
                <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
                Add another value
              </Button>
            </Box>
  
            {fields.map((field, index) => (

              <Stack
                key={index}
                spacing={2}
                direction={{ xs: "row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <Box sx={{ width: "50%" }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="standard"
                    label="Vehicle Name"
                    id={`Vehicle_Name_${index}`}
                    value={field.vehicleName}
                    error={!!field.vehicleNameError}
                    helperText={field.vehicleNameError}
                    onChange={(e) => {
                      const newFields = [...fields];
                      const value = e.target.value;
                
                      if (value.trim() === "") {
                        newFields[index].vehicleNameError = "Vehicle Name is required";
                      } else if (!/^[A-Za-z\s]+$/.test(value)) {
                        newFields[index].vehicleNameError = "Only letters and spaces allowed";
                      } else {
                        newFields[index].vehicleNameError = "";
                      }
                
                      newFields[index].vehicleName = value;
                      setFields(newFields);
                    }}
                    // sx={{ px: 2 }}
                  />
                </Box>
                
                <Box sx={{ width: "50%" }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Quantity"
                    variant="standard"
                    id={`Quantity_${index}`}
                    type="number"
                    value={field.quantity}
                    error={!!field.quantityError}
                    helperText={field.quantityError}
                    onChange={(e) => {
                      const newFields = [...fields];
                      const value = e.target.value;
                
                      if (value === "" || Number(value) === 0) {
                        newFields[index].quantityError = "Quantity is required";
                      } else if (Number(value) < 0) {
                        newFields[index].quantityError = "Quantity cannot be negative";
                      } else {
                        newFields[index].quantityError = "";
                      }
                
                      newFields[index].quantity = value;
                      setFields(newFields);
                    }}
                  />
                </Box>
                
                <Box sx={{ width: "50%" }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Transporter Name"
                    variant="standard"
                    id={`Transporter_Name_${index}`}
                    value={field.transporter}
                    error={!!field.transporterError}
                    helperText={field.transporterError}
                    onChange={(e) => {
                      const newFields = [...fields];
                      const value = e.target.value;
                
                      if (value.trim() === "") {
                        newFields[index].transporterError = "Transporter Name is required";
                      } else if (!/^[A-Za-z\s]+$/.test(value)) {
                        newFields[index].transporterError = "Only letters and spaces allowed";
                      } else {
                        newFields[index].transporterError = "";
                      }
                
                      newFields[index].transporter = value;
                      setFields(newFields);
                    }}
                  />
                </Box>
  
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => handleRemoveField(index)}
                  disabled={fields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
      <Stack
               
                spacing={2}
                direction={{ xs: "row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "end",
                  borderWidth: 1,
                  borderColor: "black",
                  textTransform:"capitalize"
                }}
                >
           
            <Button sx={{textTransform:"capitalize"}} onClick={handleReset}  variant="contained" color="error"type="button">
                Cancel
              </Button>
              <Button sx={{textTransform:"capitalize"}} variant="contained" color="success" type="submit">
                Submit
              </Button>
            
            </Stack>
          </Paper>
        </form>
        {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />
      )}
      </React.Fragment>
    );
  }
  