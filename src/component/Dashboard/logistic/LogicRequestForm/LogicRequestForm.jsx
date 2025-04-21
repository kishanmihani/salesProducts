import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, Paper,
    Stack, Typography, IconButton,
    Input,
    FormHelperText,
    TextField
  } from "@mui/material";
  import React from "react";
  import { useNavigate } from "react-router";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  
  import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
  import DeleteIcon from "@mui/icons-material/Delete";
// import { authAxios } from "../../../utils/authAxios";
  import PortDropDown from "../../../commonComponent/PortDropdown/ProtDropDown";
  import CustomerDropDown from "../../../commonComponent/CustomerDropDown/CustomerDropDown";
import CustomerDropDownTwo from "../../../commonComponent/CustomerDropDown/CustomerDropDowntwo";
import PortDropDownTwo from "../../../commonComponent/PortDropdown/ProtDropDowntwo";
import { authAxios } from "../../../utils/authAxios";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";
  export default function LogicRequestForm() {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = React.useState('Select');
    const [portName, setPortName] = React.useState('Select');
    
    const [fields, setFields] = React.useState([{vehicleName: '',
      vehicleNameError: '',
      quantity: '',
      quantityError: '', }]);
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
      setFields([...fields, { vehicleName: "", quantity: 0 }]);
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
        // var count=0;
        let count=0;
        for(let arr of fields){
          
          count++;
         var data={
          "user_id": userId,
          "Customer_Name": customerName,
          "vehicle_Name": arr.vehicleName,
          "Port_Name": portName,
          "Quantity": arr.quantity,
          "Remark": remark
        }
          await authAxios.post('BituRep/Api/Account/logistic_data',JSON.stringify(data))
          .then((res)=>{
          if (res.data.massage == "Entry Done") {
                      showSuccess("Records Submited")
                      }else {
                        showError(res.data.message)
                      }
                      if(count === fields.length ){
                        handleReset()
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
        quantityError: '', }]);
      setErrorsCustomerName(false)
      setErrorsPortName(false)
     
    };
    const handleClose = () => {
      setCustAlert(null)
     };
    return (
      <React.Fragment>
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
          <Button
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: "50%",
              border: 1,
              borderColor: "#eee",
              width: 40,
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Typography variant="h5" align="center" width="100%">
            Logistic Request Form
          </Typography>
        </Box>
  
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
              {/* </Box> */}
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
                <FormControl fullWidth size="small" error={!!field.vehicleNameError}>
  <InputLabel htmlFor={`Vehicle_Name_${index}`}>Vehicle Name</InputLabel>
  <Input
    id={`Vehicle_Name_${index}`}
    value={field.vehicleName}
    MenuProps={{ disableAutoFocusItem: true }}
    sx={{px:2}}
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
  />
  {field.vehicleNameError && (
    <FormHelperText>{field.vehicleNameError}</FormHelperText>
  )}
</FormControl>

                </Box>
  
                <Box sx={{ width: "50%" }}>
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
  