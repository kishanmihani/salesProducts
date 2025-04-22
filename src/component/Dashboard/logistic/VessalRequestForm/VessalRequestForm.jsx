import React, { useState } from "react";
import CustomPageHeader from "../../../commonComponent/CustomPageHeader/CustomPageHeader";
import { Box, Button, Chip, FormControl, FormHelperText, Input, InputLabel, Paper, Stack, TextField, Typography,IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { validateVesselNumber } from "../../../utils/vesselNumberValid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import BillingDropDownTwo from "../../../commonComponent/BillingDropDown/BillingDropDownTwo";
import PortDropDownTwo from "../../../commonComponent/PortDropdown/ProtDropDowntwo";
import ProductDropDownTwo from "../../../commonComponent/ProductDropDown/ProductDropDownTwo";
export default function VessalRequestForm() {
  const [vessalName, setVessalName] = useState("");
  const [vessalNameError, setVessalNameError] = useState(false);
  const [vessalNumber, setVessalNumber] = useState("");
  const [vessalNumberError, setVessalNumberError] = useState({
    error: "",
    valid: true,
  });
  const [dischargeDate, setDisChargeDate] = useState(null);
  const [dischargeDateError, setDischargeDateError] = useState(false);
  const [fields, setFields] = useState([{
    shippingName: '',shippingNameError: '',quantity: 0,quantityError: '',BLNo:0,
    BLNoError:'',blDate:null,blDateError:false,cargoPrice:0,
    cargoPriceError:'',iGst:'',iGstError:"",Custom:"",CustomError:"",
    roe:"",roeError:"",blAmt:0,blAmtError:""
  }]);
  const [beDetailsfields,setBeDetailsfields] = useState([{
  billing:"Select",
  billingError:false,
  portName:"Select",
  portNameError:false,
  beProductName:"Select",
  beProductNameError:false,
  beDate:null,
  beDateError:false,
  netQuntity:0,
  netQuntityError:"",
  billOfEntry:"",
  billOfEntryError:"",
  whereHouseName:"",
  whereHouseNameError:"",
  surveyerName:"",
  surveyerNameError:"",
  }])
  
        const handleAddFieldsBlData = () => {
            setFields([...fields, {Custom:"", shippingName: "",BLNo:"", quantity: 0 ,blDate:"",cargoPrice:0,iGst:0,Roe:"",blAmt:0}]);
          };
          const handleRemoveFieldBlData = (index) => {
            const updatedFields = fields.filter((_, i) => i !== index);
            setFields(updatedFields);
          };
          const handleAddFieldsBeDetails = () => {
            setBeDetailsfields([...beDetailsfields, {surveyerName:"",whereHouseName:"",beProductName:"Select",billing:"Select",billOfEntry:"",portName:"select",customerName:"Select",beDate:null,netQuntity:0,}]);
          };
          const handleRemoveFieldBeDetails = (index) => {
            const updatedFieldsBedetails = beDetailsfields.filter((_, i) => i !== index);
            setBeDetailsfields(updatedFieldsBedetails)
          }
  function handleSubmit(event) {
    event.preventDefault();
    let hasError = false;
    // console.log(hasError);
    if (vessalName === "") {
      setVessalNameError(true);
      hasError = true;
    } else if (vessalName !== "") {
      setVessalNameError(false);
      //   hasError = false;
    }
    if (dischargeDate == "" || dischargeDate == null) {
      setDischargeDateError(true);
      hasError = true;
    } else {
      setDischargeDateError(false);
      // hasError =false;
    }
    
    const { error, isValid } = validateVesselNumber(vessalNumber);
    setVessalNumberError({ error: error, valid: isValid });
    if(!isValid){
        hasError = true;
    }
    
    const updatedFields = fields.map((field) => {
        const updatedField = { ...field };
    
        if (field.shippingName.trim() === "") {
          updatedField.shippingNameError = "shipping Name is required";
          hasError = true;
        } else if (!/^[A-Za-z\s]+$/.test(field.shippingName)) {
          updatedField.shippingNameError = "Only letters and spaces allowed";
          hasError = true;
        } else {
          updatedField.shippingNameError = "";
        }
       
        if (field.BLNo === "" || Number(field.BLNo) === 0) {
            updatedField.BLNoError = "BL .No must be greater than 0";
            hasError = true;
          } else if (Number(field.BLNo) < 0) {
            updatedField.BLNoError = "BL .No cannot be negative";
            hasError = true;
          } else {
            updatedField.BLNoError = "";
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
        if (field.Custom === "" || Number(field.Custom) === 0) {
          updatedField.CustomError = "Custom Price value is required";
          hasError = true;
        } else if (Number(field.Custom) < 0) {
          updatedField.CustomError = "Custom Price cannot be negative";
          hasError = true;
        } else {
          updatedField.CustomError = "";
        }
        if (field.iGst === "" || Number(field.iGst) === 0) {
          updatedField.iGstError = "iGst must be greater than 0";
          hasError = true;
        } else if (Number(field.iGst) < 0) {
          updatedField.iGstError = "iGst value cannot be negative";
          hasError = true;
        } else {
          updatedField.iGstError = "";
        }
        if (field.blAmt === "" || Number(field.blAmt) === 0) {
          updatedField.blAmtError = "Bl Amt must be greater than 0";
          hasError = true;
        } else if (Number(field.blAmt) < 0) {
          updatedField.blAmtError = "Bl Amt value cannot be negative";
          hasError = true;
        } else {
          updatedField.blAmtError = "";
        }
        if (field.roe === "" || Number(field.iGst) === 0) {
          updatedField.roeError = "roe is reqired";
          hasError = true;
        } else {
          updatedField.roeError = "";
        }
        if (field.blDate === "") {
            updatedField.blDateError = true;
            hasError = true;
          
          } else {
            updatedField.blDateError = false;
          }
          if (field.cargoPrice === "" || Number(field.cargoPrice) === 0) {
            updatedField.cargoPriceError = "Cargo Price is required ";
            hasError = true;
          }else if (field.cargoPrice  < 0) {
            updatedField.cargoPriceError = "Cargo Price not negative value ";
            hasError = true;
          }
           else {
            updatedField.cargoPriceError = "";
          }
        return updatedField;
      });
      const updatedFieldsBedetails= beDetailsfields.map((beDetailsfield)=>{
        const updatedFieldBedetail = { ...beDetailsfield };
        if(beDetailsfield.beDate === null || beDetailsfield.beDate == "" ){
          updatedFieldBedetail.beDateError = true;
          hasError = true;
        }else{
          updatedFieldBedetail.beDateError=false
        }
        if(beDetailsfield.netQuntity === 0 || beDetailsfield.netQuntity === ""){
          updatedFieldBedetail.netQuntityError = "Net Qunitty is required"
          hasError = true;
        }else{
          updatedFieldBedetail.netQuntityError =""
        }
        if( beDetailsfield.billOfEntry === ""){
          updatedFieldBedetail.billOfEntryError = "Bill entry is required";
          hasError = true;
        }else{
          updatedFieldBedetail.billOfEntryError =""
        }
        if( beDetailsfield.portName == "Select"){
          updatedFieldBedetail.portNameError = "Port name is required";
          hasError = true;
        }else{
          updatedFieldBedetail.portNameError =""
        }
        if( beDetailsfield.beProductName == "Select"){
          updatedFieldBedetail.beProductNameError = "Product name is required";
          hasError = true;
        }else{
          updatedFieldBedetail.beProductNameError =""
        }
        if( beDetailsfield.billing == "Select"){
          updatedFieldBedetail.billingError = true;
          hasError = true;
        }else{
          updatedFieldBedetail.billingError =false
        }
        if( beDetailsfield.whereHouseName == ""){
          updatedFieldBedetail.whereHouseNameError = "where House Name is required";
          hasError = true;
        }else{
          updatedFieldBedetail.whereHouseNameError =""
        }
        if( beDetailsfield.surveyerName == ""){
          updatedFieldBedetail.surveyerNameError = "Surveyer Name is required";
          hasError = true;
        }else{
          updatedFieldBedetail.surveyerNameError =""
        }
        // billOfEntry
        // netQuntity:
        return updatedFieldBedetail;
      })
      setFields(updatedFields);
      setBeDetailsfields(updatedFieldsBedetails)
      if (!hasError) {
        console.log("Form Data Submitted:", {
        //   customerName,
        //   portName,
        vessalName,
        dischargeDate,
        vessalNumber,
          fields: updatedFields,
          Bedetails:updatedFieldsBedetails
        //   remark,
        });}
    
  }
  function handleReset() {
    setVessalName("");
    setVessalNameError(false);
    setVessalNumber("");
    setVessalNumberError({ error: "", valid: true });
  }
  function vessalNameChange(event) {
    let value = event.target.value;
    if (value === "") {
      setVessalNameError(true);
    } else {
      setVessalNameError(false);
    }
    setVessalName(value);
  }
  function vessalNumberChange(event) {
    const value = event.target.value;
    setVessalNumber(value);
    const { error, isValid } = validateVesselNumber(value);
    setVessalNumberError({ error: error, valid: isValid });
    
  }
  function dischargeDateChange(newvalue) {
    let value = newvalue;
    if (value === "") {
      setDischargeDateError(true);
    } else {
      setDischargeDateError(false);
    }
    setDisChargeDate(value);
  }
  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vessal Request Form" />
      <form onSubmit={handleSubmit}>
        <Paper elevation={0}>
        <Box sx={{ position: 'relative', border: '1px solid #ccc', borderRadius: 2, p:2,m: 2, mt: 2 }}>
      {/* Title on top border */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          top: -10,
          left: 12,
          backgroundColor: '#fff',
          px: 1,
          fontWeight: 500,
          color: '#555',
        }}
      >
        Vessal Info
      </Typography>
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ p: 0, pb: 0 }}
          >
            <TextField
              fullWidth
              size="small"
              margin="normal"
              id="VessalName"
              name="VessalName"
              type="text"
              label="Vessal Name"
              value={vessalName}
              onChange={vessalNameChange}
              error={vessalNameError}
              helperText={vessalNameError && "Vessal Name is required"}
            />
            <TextField
              fullWidth
              size="small"
              margin="normal"
              id="VessalNumber"
              name="VessalNumber"
              type="text"
              label="Vessal Number"
              value={vessalNumber}
              onChange={vessalNumberChange}
              error={!vessalNumberError.valid}
              helperText={vessalNumberError.error}
            />
            <FormControl fullWidth size="small" margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Discharge Date"
                  name="dischargeDate"
                  value={dischargeDate}
                  onChange={dischargeDateChange}
                  slotProps={{
                    textField: {
                      size: "small",
                      id: "validity-date-picker",
                      fullWidth: true,
                      error: dischargeDateError,
                      helperText:
                        dischargeDateError && "Discharge Date is required",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="validity-date-picker"
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Stack>
          </Box>
          {/* <Stack></Stack> */}
          <Box sx={{ p: 2 }}>
                        <Button
                          variant="outlined"
                          sx={{ p: 1, fontSize: "12px", borderRadius: 6,textTransform:"capitalize" }}
                          color="success"
                          onClick={handleAddFieldsBlData}
                        >
                          <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
                          Add BL data
                        </Button>
                      </Box>
                      {fields.map((field, index) => (
              <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column',}}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
                
                {/* <Box xs={{display:"flex",flexWrap:"wrap"}} sx={{display:"flex"}}> */}
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
                <Box sx={{ width: "100%" }}>

                <FormControl fullWidth size="small" error={!!field.shippingNameError}>
  <InputLabel htmlFor={`shipping_Name_${index}`}>Shipping Name</InputLabel>
  <Input
    id={`shipping_Name_${index}`}
    value={field.shippingName}
    MenuProps={{ disableAutoFocusItem: true }}
    sx={{px:2}}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value.trim() === "") {
        newFields[index].shippingNameError = "Shipping Name is required";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        newFields[index].shippingNameError = "Only letters and spaces allowed";
      } else {
        newFields[index].shippingNameError = "";
      }

      newFields[index].shippingName = value;
      setFields(newFields);
    }}
  />
  {field.shippingNameError && (
    <FormHelperText>{field.shippingNameError}</FormHelperText>
  )}
</FormControl>

                </Box>
  
                <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={!!field.quantityError}>
  <InputLabel htmlFor={`Quantity_${index}`}>Quantity</InputLabel>
  <Input
    id={`Quantity_${index}`}
    type="number"
    sx={{px:2}}
    value={field.quantity}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].quantityError = "Quantity must be greater than 0";
      } else if (Number(value) < 0) {
        newFields[index].quantityError = "Quantity cannot be negative";
      } else {
        newFields[index].quantityError = "";
      }

      newFields[index].quantity = value;
      setFields(newFields);
    }}
  />
  {field.quantityError && (
    <FormHelperText>{field.quantityError}</FormHelperText>
  )}
</FormControl>

                </Box>
                <Box sx={{ width: "100%" }}>
                <FormControl variant="filled" fullWidth size="small" >
              <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <DatePicker
                htmlFor={`Quantity_${index}`}
                  label="Bl Date"
                  name="BlDate"
                  
                  value={dayjs(field.blDate)}
                  onChange={(newvalue)=>{
                    const newFields = [...fields]  
                    if (newvalue === null) {
                      newFields[index].blDateError = true;
                    } else {
                      newFields[index].blDateError = false;
                    }
                    newFields[index].blDate = newvalue;
                
                      // newFields[index].blDate = newvalue;
                      setFields(newFields);
                                 
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      id: "blDate",
                      fullWidth: true,
                      error:!!field.blDateError,
                      helperText:!!field.blDateError && "Bl Date is required",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="validity-date-picker"
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
                </Box>
                </Stack>
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
                <Box sx={{ width: "100%" }}>

                <FormControl fullWidth size="small" error={!!field.cargoPriceError}>
  <InputLabel htmlFor={`cargo_Price_${index}`}>Cargo Price</InputLabel>
  <Input
    id={`cargo_Price_${index}`}
    value={field.cargoPrice}
    MenuProps={{ disableAutoFocusItem: true }}
    sx={{px:2}}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value.trim() === "") {
        newFields[index].cargoPriceError = "Cargo Price is required";
      } else if (value < 0) {
        newFields[index].cargoPriceError = "Cargo Price not negative value";
      } else {
        newFields[index].cargoPriceError = "";
      }

      newFields[index].cargoPrice = value;
      setFields(newFields);
    }}
  />
  {field.cargoPriceError && (
    <FormHelperText>{field.cargoPriceError}</FormHelperText>
  )}
</FormControl>

                </Box>
                <Box sx={{ width: "100%" }}>
                   <FormControl size="small" fullWidth error={!!fields?.BLNoError}>
                   <InputLabel htmlFor={`BLNo_${index}`}>BL No</InputLabel>
  <Input
    id={`BLNo_${index}`}
    type="number"
    sx={{px:2}}
    value={field.quantity}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].BLNoError = "BLNo must be greater than 0";
      } else if (Number(value) < 0) {
        newFields[index].BLNoError = "BLNo cannot be negative";
      } else {
        newFields[index].BLNoError = "";
      }

      newFields[index].BLNo = value;
      setFields(newFields);
    }}
  />
  {field.BLNoError && (
    <FormHelperText>{field.BLNoError}</FormHelperText>
  )}                
                   </FormControl>
                </Box>
                
                <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={!!field.CustomError}>
  <InputLabel htmlFor={`Custom_${index}`}>Custom Duty</InputLabel>
  <Input
    id={`Custom_${index}`}
    type="number"
    sx={{px:2}}
    value={field.Custom}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].CustomError = "Custom is required";
      } else if (Number(value) < 0) {
        newFields[index].CustomError = "Custom cannot be negative";
      } else {
        newFields[index].CustomError = "";
      }

      newFields[index].Custom = value;
      setFields(newFields);
    }}
  />
  {field.CustomError && (
    <FormHelperText>{field.CustomError}</FormHelperText>
  )}
</FormControl>

                </Box>
                </Stack>
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              > 
                <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={!!field.iGstError}>
  <InputLabel htmlFor={`iGst_${index}`}>IGST</InputLabel>
  <Input
    id={`IGST_${index}`}
    type="number"
    sx={{px:2}}
    value={field.iGst}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].iGstError = "IGST must be greater than 0";
      } else if (Number(value) < 0) {
        newFields[index].iGstError = "IGST cannot be negative";
      } else {
        newFields[index].iGstError = "";
      }

      newFields[index].iGst = value;
      setFields(newFields);
    }}
  />
  {field.iGstError && (
    <FormHelperText>{field.iGstError}</FormHelperText>
  )}
</FormControl>

                </Box>
                <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={!!field.roeError}>
  <InputLabel htmlFor={`roe_${index}`}>Roe</InputLabel>
  <Input
    id={`Roe_${index}`}
    type="number"
    sx={{px:2}}
    value={field.roe}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].roeError = "roe is reqired";
      } else {
        newFields[index].roeError = "";
      }

      newFields[index].roe = value;
      setFields(newFields);
    }}
  />
  {field.roeError && (
    <FormHelperText>{field.roeError}</FormHelperText>
  )}
</FormControl>

                </Box>

              <FormControl fullWidth size="small" error={!!field.blAmtError}>
  <InputLabel htmlFor={`Bl_Amt_${index}`}>Bl Amt(Aed)</InputLabel>
  <Input
    id={`Bl_Amt_${index}`}
    type="number"
    sx={{px:2}}
    value={field.blAmt}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].blAmtError = "blAmt is reqired";
      } else {
        newFields[index].blAmtError = "";
      }

      newFields[index].blAmt = value;
      setFields(newFields);
    }}
  />
  {field.blAmtError && (
    <FormHelperText>{field.blAmtError}</FormHelperText>
  )}
</FormControl>  
               </Stack> 
               <Box sx={{width:"100%",display:"flex",justifyContent:"center"}}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  
                  onClick={() => handleRemoveFieldBlData(index)}
                  disabled={fields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
                </Box>
              </Stack>
            ))}
                      <Box sx={{ p: 2 }}>
                        <Button
                          variant="outlined"
                          sx={{ p: 1, fontSize: "12px", borderRadius: 6 ,textTransform:"capitalize"}}
                          color="success"
                          onClick={handleAddFieldsBeDetails}
                        >
                          <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
                          Add BE details
                        </Button>
                      </Box>
                      {beDetailsfields.map((field, index) => (
              <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column',}}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
                >
        <BillingDropDownTwo 
         billing={field.billing}
         variant="standard"
         setBilling={(value) => {
           if(value === "Select"){
             field.billingError=true;
           }
           else {
             field.billingError=false
           }
           const updatedFields = [...beDetailsfields];
           updatedFields[index].billing = value;
           setBeDetailsfields(updatedFields);
         }}
         errorsBilling={field.billingError}
         setErrorsBilling={(value) => {
           const updatedFields = [...beDetailsfields];
           updatedFields[index].billingError = value;
           setBeDetailsfields(updatedFields);
         }}
        />
        <ProductDropDownTwo
        variant="standard" 
          selectedProduct={field.beProductName}
          setSelectedProduct={(value) => {
            if(value === "Select"){
              field.beProductNameError=true
            }
            else {
              field.beProductNameError=false; 
            }
            const updatedFields = [...beDetailsfields];
            updatedFields[index].beProductName = value;
            setBeDetailsfields(updatedFields);
          }}
          errorsProduct={field.beProductNameError}
          setErrorsProduct={(value) => {
            const updatedFields = [...beDetailsfields];
            updatedFields[index].beProductNameError = value;
            setBeDetailsfields(updatedFields);
          }} />
        <PortDropDownTwo
        variant="standard"
  selectedPort={field.portName}
  setSelectedPort={(value) => {
    if(value === "Select"){
      field.portNameError="Port name is required"
    }
    else {
      field.portNameError="" 
    }
    const updatedFields = [...beDetailsfields];
    updatedFields[index].portName = value;
    setBeDetailsfields(updatedFields);
  }}
  errorsPortName={field.portNameError}
  setErrorsPortName={(value) => {
    const updatedFields = [...beDetailsfields];
    updatedFields[index].portNameError = value;
    setBeDetailsfields(updatedFields);
  }}
/>
                </Stack>
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
                <Box sx={{ width: "100%" }}>
                <FormControl variant="filled" fullWidth size="small" >
              <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <DatePicker
                htmlFor={`Be_${index}`}
                  label="Be Date"
                  name="BeDate"
                  inputVariant="standard"
                  value={dayjs(field.beDate)}
                  onChange={(newvalue)=>{
                    const newFields = [...beDetailsfields]  
                    if (newvalue === null) {
                      newFields[index].beDateError = true;
                    } else {
                      newFields[index].beDateError = false;
                    }
                    newFields[index].beDate = newvalue;
                
                      // newFields[index].blDate = newvalue;
                      setBeDetailsfields(newFields);
                                 
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      id: "beDate",
                      variant:"standard",
                      fullWidth: true,
                      error:!!field.beDateError,
                      helperText:!!field.beDateError && "Be Date is required",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="beDate"
                      size="small"
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
                </Box>
                  <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={field.billOfEntryError}>
  <InputLabel htmlFor={`iGst_${index}`}>Bill Of Entry</InputLabel>
  <Input
    id={`Bill_Of_Entry_${index}`}
    type="text"
    sx={{px:2}}
    value={field.billOfEntry}
    onChange={(e) => {
      const newFields = [...beDetailsfields];
      const value = e.target.value;

      if (value === "" ) {
        newFields[index].billOfEntryError = "Bill of Entry is required";
      } else {
        newFields[index].billOfEntryError = "";
      }

      newFields[index].billOfEntry = value;
      setBeDetailsfields(newFields);
    }}
  />
  {field.billOfEntryError && (
    <FormHelperText>{field.billOfEntryError}</FormHelperText>
  )}
</FormControl>              
                </Box>
                <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" error={field.netQuntityError}>
  <InputLabel htmlFor={`bNet_Quntity_${index}`}>Net Quntity</InputLabel>
  <Input
    id={`bNet_Quntity_${index}`}
    type="number"
    sx={{px:2}}
    value={field.netQuntity}
    onChange={(e) => {
      const newFields = [...beDetailsfields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].netQuntityError = "Net Quntity is reqired";
      } else {
        newFields[index].netQuntityError = "";
      }

      newFields[index].netQuntity = value;
      setBeDetailsfields(newFields);
    }}
  />
  {field.netQuntityError&& (
    <FormHelperText>{field.netQuntityError}</FormHelperText>
  )}
</FormControl>

                </Box>
                </Stack>
                <Stack
                key={index}
                spacing={2}
                direction={{ xs: 'column', md:"row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display:"flex",
                  borderColor: "black",
                }}
                wrap="wrap"
              >
          <Box sx={{ width: "100%" }}>
          <TextField
              fullWidth
              size="small"
              id={`where_House_Name${index}` }
              name="whereHouseName"
              type="text"
              variant="standard"
              label="Where House Name"
              value={field.whereHouseName}
              onChange={(e)=>{
                const newFields = [...beDetailsfields];
      const value = e.target.value;

      if (value === "" ) {
        newFields[index].whereHouseNameError = "where House Name is reqired";
      } else {
        newFields[index].whereHouseNameError = "";
      }

      newFields[index].whereHouseName = value;
      setBeDetailsfields(newFields);
    }}
              error={field.whereHouseNameError}
              helperText={field.whereHouseNameError}
            />
          </Box>
          <Box sx={{ width: "100%" }}>
          <TextField
              fullWidth
              size="small"
              id={`survey_name${index}` }
              name="Survey_name"
              type="text"
              variant="standard"
              label="Surveyer_name"
              value={field.surveyerName}
              onChange={(e)=>{
                const newFields = [...beDetailsfields];
      const value = e.target.value;

      if (value === "" ) {
        newFields[index].surveyerNameError = "Surveyer Name is reqired";
      } else {
        newFields[index].surveyerNameError = "";
      }

      newFields[index].surveyerName = value;
      setBeDetailsfields(newFields);
    }}
              error={field.surveyerNameError}
              helperText={field.surveyerNameError}
            />
          </Box>
        </Stack>
                <Box sx={{width:"100%",display:"flex",justifyContent:"center"}}>
                <IconButton
                  aria-label="delete"
                  color="error"
                  
                  onClick={() => handleRemoveFieldBeDetails(index)}
                  disabled={beDetailsfields.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
                </Box>
                </Stack>))}
          <Stack
            spacing={2}
            direction={{ xs: "row" }}
            sx={{
              p: 2,
              justifyContent: "end",
              borderWidth: 1,
              borderColor: "black",
              textTransform: "capitalize",
            }}
          >
            <Button
              sx={{ textTransform: "capitalize" }}
              onClick={handleReset}
              variant="contained"
              color="error"
              type="button"
            >
              Cancel
            </Button>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="contained"
              color="success"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </Paper>
      </form>
      

      
    </React.Fragment>
  );
}
