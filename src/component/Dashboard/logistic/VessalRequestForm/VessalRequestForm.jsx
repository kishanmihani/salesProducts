import React, { useMemo, useState } from "react";

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
import BeDetailsItem from "./BeDetailsItems/BeDetailsItems";
import BlDataItems from "./blDataItems/BlDataItems";
import { authAxios } from "../../../utils/authAxios";
import dayjs from "dayjs";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";

const instialValueBedetails = [
  {
    billing: "Select",
    billingError: false,
    portName: "Select",
    portNameError: false,
    beProductName: "Select",
    beProductNameError: false,
    beDate: null,
    beDateError: false,
    netQuntity: 0,
    netQuntityError: "",
    billOfEntry: "",
    billOfEntryError: "",
    whereHouseName: "",
    whereHouseNameError: "",
    surveyerName: "",
    surveyerNameError: "",
  },
];
const instialValueBlData = [
  {
    shippingName: "",
    shippingNameError: "",
    quantity: 0,
    quantityError: "",
    BLNo: 0,
    BLNoError: "",
    blDate: null,
    blDateError: false,
    cargoPrice: 0,
    cargoPriceError: "",
    iGst: 0,
    iGstError: "",
    Custom: 0,
    CustomError: "",
    roe: 0,
    roeError: "",
    blAmt: 0,
    blAmtError: "",
  },
];
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
  const [fields, setFields] = useState(instialValueBlData);
  const [beDetailsfields, setBeDetailsfields] = useState(instialValueBedetails);
  const [blDataCheck, setBlDataCheck] = useState(true);
  const [bedetailsCheck, setBedetailsCheck] = useState(true);
  const [custAlert, setCustAlert] = React.useState(null);
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleAddFieldsBlData = () => {
    setFields([
      ...fields,
      {
        Custom: 0,
        shippingName: "",
        BLNo: 0,
        quantity: 0,
        blDate: null,
        cargoPrice: 0,
        iGst: 0,
        roe: 0,
        blAmt: 0,
      },
    ]);
  };
  const handleRemoveFieldBlData = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };
  const handleAddFieldsBeDetails = () => {
    setBeDetailsfields([
      ...beDetailsfields,
      {
        surveyerName: "",
        whereHouseName: "",
        beProductName: "Select",
        billing: "Select",
        billOfEntry: "",
        portName: "Select",
        beDate: null,
        netQuntity: 0,
      },
    ]);
  };
  const handleRemoveFieldBeDetails = (index) => {
    const updatedFieldsBedetails = beDetailsfields.filter(
      (_, i) => i !== index
    );
    setBeDetailsfields(updatedFieldsBedetails);
  };
  // const memoizedUpdatedBLFields = useMemo(() => {
  //   return fields.map((field) => ({
  //     ...field,
  //     shippingNameError: "",
  //     BLNoError: "",
  //     quantityError: "",
  //     CustomError: "",
  //     blAmtError: "",
  //     blDateError: false,
  //     cargoPriceError: "",
  //     iGstError: "",
  //     roeError: "",
  //   }));
  // }, [fields]);

  const memoizedUpdatedBEDetailsFields = useMemo(() => {
    return beDetailsfields.map((field) => ({
      ...field,
      billingError: false,
      portNameError: false,
      beProductNameError: false,
      beDateError: false,
      netQuntityError: "",
      billOfEntryError: "",
      whereHouseNameError: "",
      surveyerNameError: "",
    }));
  }, [beDetailsfields]);
  // useEffect(() => {
  //   if (!blDataCheck) {
  //     setFields(memoizedUpdatedBLFields);
  //   }
  //   if (!bedetailsCheck) {
  //     setBeDetailsfields(memoizedUpdatedBEDetailsFields);
  //   }
  // }, [blDataCheck, bedetailsCheck, memoizedUpdatedBLFields, memoizedUpdatedBEDetailsFields]);
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

    const { error, isValid } = validateVesselNumber(vessalNumber);
    setVessalNumberError({ error: error, valid: isValid });
    if (!isValid) {
      hasError = true;
    }

    var updatedFields;
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
        if (field.quantity === "" || Number(field.quantity) === 0) {
          updatedField.quantityError = "Net Quantity is required";
          hasError = true;
        } else if (Number(field.quantity) < 0) {
          updatedField.quantityError = "Net Quantity cannot be negative";
          hasError = true;
        } else {
          updatedField.quantityError = "";
        }
        if (field.Custom === "" || Number(field.Custom) === 0) {
          updatedField.CustomError = "Custom Duty is required";
          hasError = true;
        } else if (Number(field.Custom) < 0) {
          updatedField.CustomError = "Custom Duty cannot be negative";
          hasError = true;
        } else {
          updatedField.CustomError = "";
        }
        if (field.iGst === "" || Number(field.iGst) === 0) {
          updatedField.iGstError = "IGST is required";
          hasError = true;
        } else if (Number(field.iGst) < 0) {
          updatedField.iGstError = "IGST value cannot be negative";
          hasError = true;
        } else {
          updatedField.iGstError = "";
        }
        if (field.blAmt === "" || Number(field.blAmt) === 0) {
          updatedField.blAmtError = "Bl Amt is required";
          hasError = true;
        } else if (Number(field.blAmt) < 0) {
          updatedField.blAmtError = "Bl Amt value cannot be negative";
          hasError = true;
        } else {
          updatedField.blAmtError = "";
        }
        if (field.roe === "" || Number(field.iGst) === 0) {
          updatedField.roeError = "Roe is reqired";
          hasError = true;
        } else if (field.roe < 0) {
          updatedField.roeError = "Roe cannot be negative";
          hasError = true;
        } else {
          updatedField.roeError = "";
        }
        if (field.blDate === "" || field.blDate === null) {
          updatedField.blDateError = true;
          hasError = true;
        } else {
          updatedField.blDateError = false;
        }
        if (field.cargoPrice === "" || Number(field.cargoPrice) === 0) {
          updatedField.cargoPriceError = "Cargo Price is required ";
          hasError = true;
        } else if (field.cargoPrice < 0) {
          updatedField.cargoPriceError = "Cargo Price not negative value ";
          hasError = true;
        } else {
          updatedField.cargoPriceError = "";
        }
        return updatedField;
      });
      setFields(updatedFields);
    }
    var updatedFieldsBedetails;
    if (bedetailsCheck == true) {
      updatedFieldsBedetails = beDetailsfields.map((beDetailsfield) => {
        const updatedFieldBedetail = { ...beDetailsfield };
        if (beDetailsfield.beDate === null || beDetailsfield.beDate == "") {
          updatedFieldBedetail.beDateError = true;
          hasError = true;
        } else {
          updatedFieldBedetail.beDateError = false;
        }
        if (
          beDetailsfield.netQuntity === 0 ||
          beDetailsfield.netQuntity === ""
        ) {
          updatedFieldBedetail.netQuntityError = "Net Qunitty is required";
          hasError = true;
        } else {
          updatedFieldBedetail.netQuntityError = "";
        }
        if (beDetailsfield.billOfEntry === "") {
          updatedFieldBedetail.billOfEntryError = "Bill entry is required";
          hasError = true;
        } else {
          updatedFieldBedetail.billOfEntryError = "";
        }
        if (beDetailsfield.portName == "Select") {
          updatedFieldBedetail.portNameError = "Port name is required";
          hasError = true;
        } else {
          updatedFieldBedetail.portNameError = "";
        }
        if (beDetailsfield.beProductName == "Select") {
          updatedFieldBedetail.beProductNameError = "Product name is required";
          hasError = true;
        } else {
          updatedFieldBedetail.beProductNameError = "";
        }
        if (beDetailsfield.billing == "Select") {
          updatedFieldBedetail.billingError = true;
          hasError = true;
        } else {
          updatedFieldBedetail.billingError = false;
        }
        if (beDetailsfield.whereHouseName == "") {
          updatedFieldBedetail.whereHouseNameError =
            "where House Name is required";
          hasError = true;
        } else {
          updatedFieldBedetail.whereHouseNameError = "";
        }
        if (beDetailsfield.surveyerName == "") {
          updatedFieldBedetail.surveyerNameError = "Surveyer Name is required";
          hasError = true;
        } else {
          updatedFieldBedetail.surveyerNameError = "";
        }
        // billOfEntry
        // netQuntity:
        return updatedFieldBedetail;
      });
      setBeDetailsfields(updatedFieldsBedetails);
    }

    if (!hasError) {
      if (bedetailsCheck == true) {
        console.log("Form be details Submitted:", {
          vessalName,
          dischargeDate,
          vessalNumber,
          Bedetails: updatedFieldsBedetails,
        });
        let count = 0;
        for (let arr of updatedFieldsBedetails) {
          count++;
          let data = {
            User_Id: userId,
            Vessal_Name: vessalName,
            Vessal_No: vessalNumber,
            Discarge_Date: dischargeDate,
            BE_date: arr.beDate,
            BE_No: arr.billOfEntry,
            WH_NAME: arr.whereHouseName,
            Quantity: arr.netQuntity,
            S_NAME: arr.surveyerName,
            PORT: arr.portName,
            PRODUCE: arr.beProductName,
            COMPANY: arr.billing,
          };
          await authAxios
            .post("BituRep/Api/Account/Vessel_data_BE", JSON.stringify(data))
            .then((res) => {
              if (res.data.massage == "Entry Done") {
                showSuccess("Records Submited");
              } else {
                showError(res.data.message);
              }
              if (count === fields.length) {
                handleReset();
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
            Discarge_Date: dischargeDate,
            BL_date: arr.blDate,
            Bl_No: arr.BLNo,
            Shipping_Name: arr.shippingNameError,
            Quantity: arr.quantity,
            BI_Amt_USD: arr.quantity,
            ROE: arr.roe,
            BI_Amt_INR: arr.blAmt,
            C_Duty: arr.Custom,
            IGST: arr.iGst,
          };
          await authAxios
            .post("BituRep/Api/Account/Vessel_data_BL", JSON.stringify(data))
            .then((res) => {
              if (res.data.massage == "Entry Done") {
                showSuccess("Records Submited");
              } else {
                showError(res.data.message);
              }
              if (count === fields.length) {
                handleReset();
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
  function handleReset() {
    setVessalName("");
    setVessalNameError(false);
    setVessalNumber("");
    setVessalNumberError({ error: "", valid: true });
    setDisChargeDate(null);
    if (bedetailsCheck) {
      setBeDetailsfields(instialValueBedetails);
    }
    if (blDataCheck) {
      setFields(instialValueBlData);
    }
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
    if (blDataCheck === false) {
      setBeDetailsfields(memoizedUpdatedBEDetailsFields);
    }
    setBlDataCheck(!blDataCheck);
  }
  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vessal Request Form" />
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
          {fields.map((field, index) => (
            <BlDataItems
              field={field}
              key={`BlDataItems-${index}`}
              disabled={blDataCheck}
              index={index}
              fields={fields}
              setFields={setFields}
              handleRemoveFieldBlData={handleRemoveFieldBlData}
            />
          ))}
          <Box sx={{ p: 2 }}>
            <Button
              disabled={!bedetailsCheck}
              variant="outlined"
              sx={{
                p: 1,
                fontSize: "12px",
                borderRadius: 6,
                textTransform: "capitalize",
              }}
              color="success"
              onClick={handleAddFieldsBeDetails}
            >
              <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
              Add BE details
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
                    value={bedetailsCheck}
                    onChange={() => setBedetailsCheck(!bedetailsCheck)}
                    color="success"
                  />
                }
                label="Be details"
              />
            </Button>
          </Box>
          {beDetailsfields.map((field, index) => (
            <BeDetailsItem
              key={`beDetails-${index}`}
              index={index}
              disabled={bedetailsCheck}
              field={field}
              beDetailsfields={beDetailsfields}
              setBeDetailsfields={setBeDetailsfields}
              handleRemoveFieldBeDetails={handleRemoveFieldBeDetails}
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
