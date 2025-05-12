import React, {   useId, useState } from "react";

import CustomPageHeader from "../../../commonComponent/CustomPageHeader/CustomPageHeader";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { validateVesselNumber } from "../../../utils/vesselNumberValid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import BlDataItems from "./blDataItems/BlDataItems";
import { authAxios } from "../../../utils/authAxios";
import dayjs from "dayjs";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";
import { vessalDataListapi, VesselDataBLapi} from "../../../Config/Api";

export default function VessalRequestForm() {
  const BlId=useId()
  const [vessalName, setVessalName] = useState("");
  const [vessalNameError, setVessalNameError] = useState(false);
  const [chaName, setChaName] = useState("");
  const [chaNameError, setChaNameError] = useState(false);
  const [vessalNumber, setVessalNumber] = useState("");
  const [vessalNumberError, setVessalNumberError] = useState({
    error: "",
    valid: true,
  });
  const [dischargeDate, setDisChargeDate] = useState(null);
  const [dischargeDateError, setDischargeDateError] = useState(false);
  const [fields, setFields] = useState([
  {
    shippingName: "",
    shippingNameError: "",
    quantity: 0,
    quantityError: "",
    BLNo: 0,
    BLNoError: "",
    blDate: null,
    blDateError: false,
    billing:"Select",
    billingError:false,
    portName:"Select",
    portNameError:false,
    ProductName:"Select",
    ProductNameError:false,
    billOfEntryError:"",
    billOfEntry:"",
    beDate:null,
    beDateError:false,
    grossQuantity:0,
    grossQuantityError:"",
    otrQut:0,
    otrQutError:"",
    otrpersent:0,
    otrpersentError:""
  }
]);
  // const [beDetailsfields, setBeDetailsfields] = useState(instialValueBedetails);
  
  const [blDataCheck, setBlDataCheck] = useState(true);
  
  const [custAlert, setCustAlert] = React.useState(null);
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleAddFieldsBlData = () => {
    setFields([
      ...fields,
      {
        // Custom: 0,
        shippingName: "",
        BLNo: 0,
        quantity: 0,
        blDate: null,
        beDate:null,
        ProductName:"Select",
        billing:"Select",
        portName:"Select",
        billOfEntry:"",
        grossQuantity:0,
        otrQut:0,
        otrpersent:0
        // cargoPrice: 0,
        // iGst: 0,
        // roe: 0,
        // blAmt: 0,
      },
    ]);
  };
  const handleRemoveFieldBlData = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };
  ;
  
  
  

  
  async function handleSubmit(event) {
    event.preventDefault();
    let hasError = false;
    if (vessalName === "") {
      setVessalNameError(true);
      hasError = true;
    } else if (vessalName !== "") {
      setVessalNameError(false);
    }
    if (dischargeDate == "" || dischargeDate == null) {
      setDischargeDateError(true);
      hasError = true;
    } else {
      setDischargeDateError(false);
      // hasError =false;
    }
    if (chaName === "") {
      setChaNameError(true);
      hasError = true;
    } else if (chaName !== "") {
      setChaNameError(false);
    }

    const { error, isValid } = validateVesselNumber(vessalNumber);
    setVessalNumberError({ error: error, valid: isValid });
    if (!isValid) {
      hasError = true;
    }

    let updatedFields;
    if (blDataCheck == true) {
      updatedFields = fields.map((field) => {
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
          updatedField.BLNoError = "BL .No is required";
          hasError = true;
        } else if (Number(field.BLNo) < 0) {
          updatedField.BLNoError = "BL .No cannot be negative";
          hasError = true;
        } else {
          updatedField.BLNoError = "";
        }
        if (field.grossQuantity === "" || Number(field.grossQuantity) === 0) {
          updatedField.grossQuantityError = "Gross Qut is required";
          hasError = true;
        } else if (Number(field.grossQuantity) < 0) {
          updatedField.grossQuantityError = "Gross Qut cannot be negative";
          hasError = true;
        } else {
          updatedField.grossQuantityError = "";
        }
        if (field.otrQut === "" || Number(field.otrQut) === 0) {
          updatedField.otrQutError = "Otr Qut is required";
          hasError = true;
        } else if (Number(field.otrQut) < 0) {
          updatedField.otrQutError = "Otr Qut cannot be negative";
          hasError = true;
        } else {
          updatedField.otrQutError = "";
        }
        
        if (field.quantity === "" || Number(field.quantity) === 0) {
          updatedField.quantityError = "Net Quantity is required";
          hasError = true;
        } else if (Number(field.quantity) < 0) {
          updatedField.quantityError = "Net Quantity cannot be negative";
          hasError = true;
        } else {
          updatedField.quantityError = "";
        }
        
        if (field.blDate === "" || field.blDate === null) {
          updatedField.blDateError = true;
          hasError = true;
        } else {
          updatedField.blDateError = false;
        }
        if (field.beDate === "" || field.beDate === null) {
          updatedField.beDateError = true;
          hasError = true;
        } else {
          updatedField.beDateError = false;
        }
        if (field.ProductName === "Select" || field.ProductName === null) {
          updatedField.ProductNameError = true;
          hasError = true;
        } else {
          updatedField.ProductNameError = false;
        }
        if (field.portName === "Select" || field.portName === null) {
          updatedField.portNameError = true;
          hasError = true;
        } else {
          updatedField.portNameError = false;
        }
        if (field.billOfEntry === "" || field.billOfEntry === null) {
          updatedField.billOfEntryError = true;
          hasError = true;
        } else {
          updatedField.billOfEntryError = false;
        }
        if (field.billing === "Select" || field.billing === null) {
          updatedField.billingError = true;
          hasError = true;
        } else {
          updatedField.billingError = false;
        }
        
        return updatedField;
      });
      setFields(updatedFields);
    }
    if (!hasError) { 
      if (blDataCheck === true) {
        console.log("Form bl data Submitted:", {
          vessalName,
          dischargeDate,
          vessalNumber,
          fields: updatedFields,
        });
        let count = 0;
        for (let arr of fields) {
          count++;
          let data = {
            User_Id: userId,
            Vessal_Name: vessalName,
            Vessal_No: vessalNumber,
            Produce_Name: arr?.ProductName,
            Port_Name:arr?.portName,
            Bl_Name:arr?.shippingName,
            Bl_No: arr.BLNo,
            BL_date: arr?.blDate,
            BL_Qty: arr?.quantity,
            BE_No: arr.BLNo,
            BE_Date: arr?.beDate ,
             BE_G_Qty:arr?.grossQuantity,
             BE_N_Qty:arr?.grossQuantity - arr?.otrQut,
             BE_OTR_Qty:arr?.otrQut,
             BE_Name: arr?.billing
          };
          await authAxios
            .post(VesselDataBLapi, JSON.stringify(data))
            .then((res) => {
              if (res.data.massage == "Entry Done") {
                showSuccess("Records Submited");
              } else {
                showError(res.data.message);
              }
              if (count === fields.length) {
               handleReset()
                vessalData();
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
      
    }
  }
  
 async function vessalData(){
    var data={
      "User_Id": userId,
      "Vessal_Name": vessalName,
      "Vessal_No": vessalNumber,
      "Discarge_Date": dischargeDate,
      "CHA_Name":chaName
    }
    await authAxios.post(vessalDataListapi,JSON.stringify(data))
          // .then((res)=>)
  }
  
  function BlReset(){
    setFields([
  {
    shippingName: "",
    shippingNameError: "",
    quantity: 0,
    quantityError: "",
    BLNo: 0,
    BLNoError: "",
    blDate: null,
    blDateError: false,
    billing:"Select",
    billingError:false,
    portName:"Select",
    portNameError:false,
    ProductName:"Select",
    ProductNameError:false,
    billOfEntryError:"",
    billOfEntry:"",
    beDate:null,
    beDateError:false,
    grossQuantity:0,
    grossQuantityError:"",
    otrQut:0,
    otrQutError:"",
    otrpersent:0,
    otrpersentError:""
  }]);//
  }
  function handleReset() {
     setVessalName("");
  setVessalNameError(false);

  setChaName("");
  setChaNameError(false);

  setVessalNumber("");
  setVessalNumberError({ error: "", valid: true });

  setDisChargeDate(null);

  BlReset();
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
  function ChaNameChange(event) {
    let value = event.target.value;
    if (value === "") {
      setChaNameError(true);
    } else {
      setChaNameError(false);
    }
    setChaName(value);
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
  const showSuccess = (data) => {
    setCustAlert({ type: "success", message: data });
  };
  const showError = (data) => {
    setCustAlert({ type: "error", message: data });
  };
  const handleClose = () => {
    setCustAlert(null);
  };
  function blDataCheckChange() {
    
    setBlDataCheck(!blDataCheck);
  }
  const validateFields = (field, index) => {
    const newFields = [...fields];
    let isValid = true;
    if (vessalName === "") {
      setVessalNameError(true);
      isValid = false;
    } else if (vessalName !== "") {
      setVessalNameError(false);
    }
    if (dischargeDate == "" || dischargeDate == null) {
      setDischargeDateError(true);
      isValid = false;
    } else {
      setDischargeDateError(false);
      // hasError =false;
    }
    if (chaName === "") {
      setChaNameError(true);
      isValid = false;
    } else if (chaName !== "") {
      setChaNameError(false);
    }

    const { error, isValids } = validateVesselNumber(vessalNumber);
    setVessalNumberError({ error: error, valid: isValids });
    if (!isValid) {
      isValid = false;
    }
    newFields.forEach((fieldItem, i) => {
      if (index === i) {
        // BL Date
        if (!fieldItem.blDate) {
          newFields[index].blDateError = true;
          isValid = false;
        }
  
        // Shipping Name
        if (!fieldItem.shippingName || !/^[A-Za-z\s]+$/.test(fieldItem.shippingName)) {
          newFields[index].shippingNameError = fieldItem.shippingName
            ? "Only letters and spaces allowed"
            : "Shipping Name is required";
          isValid = false;
        }
  
        // BL No
        if (!fieldItem.BLNo || Number(fieldItem.BLNo) <= 0) {
          newFields[index].BLNoError =
            Number(fieldItem.BLNo) < 0
              ? "BL No/Be No cannot be negative"
              : "BL No/Be No is required";
          isValid = false;
        }
        if (field.grossQuantity === "" || Number(field.grossQuantity) === 0) {
          newFields[index].grossQuantityError =
          Number(fieldItem.grossQuantity) < 0
            ? "Gross Quantity cannot be negative"
            : "Gross Quantity is required";
        isValid = false;} else {
          newFields[index].grossQuantityError = "";
          isValid = true;
        }
        if (fieldItem.otrQut === "" || Number(fieldItem.otrQut) === 0) {
          newFields[index].otrQutError =
          Number(fieldItem.otrQut) < 0
            ? "Gross Quantity cannot be negative"
            : "Gross Quantity is required";
        isValid = false;
        } else {
          newFields[index].otrQutError = "";
        }
        
        // Quantity
        if (!fieldItem.quantity || Number(fieldItem.quantity) <= 0) {
          newFields[index].quantityError =
            Number(fieldItem.quantity) < 0
              ? "Net Quantity cannot be negative"
              : "Net Quantity is required";
          isValid = false;
        }
  
        // BE Date
        if (!fieldItem.beDate) {
          newFields[index].beDateError = true;
          isValid = false;
        }
  
        // Bill of Entry
        if (!fieldItem.billOfEntry || fieldItem.billOfEntry.trim() === "") {
          newFields[index].billOfEntryError = "Bill of Entry is required";
          isValid = false;
        }
  
        // Billing Dropdown
        if (!fieldItem.billing || fieldItem.billing === "Select") {
          newFields[index].billingError = true;
          isValid = false;
        }
  
        // Product Dropdown
        if (!fieldItem.ProductName || fieldItem.ProductName === "Select") {
          newFields[index].ProductNameError = true;
          isValid = false;
        }
  
        // Port Dropdown
        if (!fieldItem.portName || fieldItem.portName === "Select") {
          newFields[index].portNameError = "Port name is required";
          isValid = false;
        }
      }
    });
  
    setFields(newFields);
    console.log(isValid + "" + index);
    return isValid;
  };
  React.useEffect(() => {
  handleReset() // reset when component mounts
}, []);
  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vessal Form" />
      <form onSubmit={handleSubmit}>
        <Paper elevation={0}>
          <Box
            sx={{
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: 2,
              p: 2,
              m: 2,
              mt: 2,
            }}
          >
            {/* Title on top border */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: -10,
                left: 12,
                backgroundColor: "#fff",
                px: 1,
                fontWeight: 500,
                color: "#555",
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
                    value={dayjs(dischargeDate)}
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
                    
                  />
                </LocalizationProvider>
              </FormControl>
              <TextField
                fullWidth
                size="small"
                margin="normal"
                id="chaName"
                name="ChaName"
                type="text"
                label="Cha Name"
                value={chaName}
                onChange={ChaNameChange}
                error={chaNameError}
                helperText={chaNameError && "Cha Name is required"}
              />
            </Stack>
          </Box>
          {/* <Stack></Stack> */}
          <Box sx={{ p: 2 }}>
            <Button
              disabled={!blDataCheck}
              variant="outlined"
              sx={{
                p: 1,
                pr: 3,
                fontSize: "12px",
                borderRadius: 6,
                textTransform: "capitalize",
              }}
              color="success"
              onClick={handleAddFieldsBlData}
            >
              <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
              Add BL data
            </Button>

            <Button
              variant="outlined"
              color="success"
              sx={{ m: 0, ml: 3, p: 0, borderRadius: 6 }}
            >
              <FormControlLabel
                sx={{
                  p: 1,
                  pt: 0,
                  pb: 0,
                  textTransform: "capitalize",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.68rem",
                  },
                }}
                control={
                  <Checkbox
                    defaultChecked
                    value={blDataCheck}
                    onChange={blDataCheckChange}
                    color="success"
                  />
                }
                label="bl Data"
              />
            </Button>
          </Box>
          {fields.map((field,BlId) => (
            <BlDataItems
              field={field}
              disabled={blDataCheck}
              index={BlId}
              fields={fields}
              vessalInfo={[vessalName, vessalNumber]}
              setFields={setFields}
              validateFields={validateFields}
              handleRemoveFieldBlData={handleRemoveFieldBlData}
            />
          ))}
          
          
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
      {custAlert && (
        <CustomeAlerts
          type={custAlert.type}
          message={custAlert.message}
          onClose={handleClose}
        />
      )}
    </React.Fragment>
  );
}
