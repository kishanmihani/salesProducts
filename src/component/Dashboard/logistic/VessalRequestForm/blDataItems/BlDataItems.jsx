import React, { useState } from "react";
import {
  Box,
  Stack,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import BillingDropDownTwo from "../../../../commonComponent/BillingDropDown/BillingDropDownTwo";
import PortDropDownTwo from "../../../../commonComponent/PortDropdown/ProtDropDowntwo";
import ProductDropDownTwo from "../../../../commonComponent/ProductDropDown/ProductDropDownTwo";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TankForm from "../TankForm/TankForm";
import XBondForm from "../XBondFrom/XBondFrom";

export default function BlDataItems({
  field,//
  disabled,
  index,//
  fields,//
  setFields,//
  handleRemoveFieldBlData,
  validateFields,//
  vessalInfo,//
  edit
}) {
  const [dataInfo,setDataInfo] = useState({BlNo:0,NetQuantity:0,grossQuantity:0,vessalName:0, vessalNumber:0})
  const [isValid,setIsValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [xbondOpen,setXbondOpen] = useState(false)
  const verify = (e) => {
    let value=e.target.value;
    setIsValid(validateFields(field, index));
    setDataInfo({BlNo:field.BLNo,NetQuantity:field.quantity,grossQuantity:field.grossQuantity,otrQut:field.otrQut,vessalName:vessalInfo[0], vessalNumber:vessalInfo[1]})
    if(isValid){
      if(value === "X-Bond"){
        setXbondOpen(true)
      }
      else if(value === "Open-tank"){
      setOpen(true);
      }
    }
    console.log(open,xbondOpen)
  };
// const [Valid,setValid] = useState(false)
const calculatePercentage = () => {
  const otr = parseFloat(field.otrQut);
  const gross = parseFloat(field.grossQuantity);
  if (!isNaN(otr) && !isNaN(gross) && gross !== 0) {
    return ((otr / gross) * 100).toFixed(2) +" "+ "%";
  }
  return 0 +" "+ "%";
};
   
  return (
    <React.Fragment>
    <Stack
      key={index}
      spacing={2}
      direction={{ xs: "column" }}
      style={{ display: !disabled ? "none" : "block" }}
      sx={{
        p: 2,
        pb: 0,
        // bgcolor:!disabled ? "rgb(0 0 0 / 9%)" :"#ffff",
        justifyContent: "start",
        borderWidth: 1,
        display: "flex",
        borderColor: "black",
      }}
      wrap="wrap"
    >
      <Box
        sx={{
          position: "relative",
          border: "1px solid #ccc",
          bgcolor: !disabled ? "rgb(0 0 0 / 9%)" : "#ffff",
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
          Bl data {index + 1}
        </Typography>
        <Stack
          // key={index}
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          sx={{
            p: 2,
            pb: 0,
            justifyContent: "start",
            borderWidth: 1,
            display: "flex",
            borderColor: "black",
          }}
          wrap="wrap"
        >
          <Box sx={{ width: "100%" }}>
            <FormControl  fullWidth size="small" error={!!field.blDateError}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Bl Date"
                  value={dayjs(field.blDate)}
                  onChange={(newValue) => {
                    const newFields = [...fields];
                    const isError = !newValue || newValue === "";
                    newFields[index].blDateError = isError;
                    newFields[index].blDate = newValue;
                    setFields(newFields);
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      id: `Bl_Date_${index}`,
                      variant: "standard",
                      fullWidth: true,
                      error: !!field.blDateError,
                      helperText: field.blDateError
                        ? "Bl Date is required"
                        : ``,
                    },
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </Box>
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Purchase Name"
              id={`shipping_Name_${index}`}
              value={field.shippingName}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value.trim() === "") {
                  newFields[index].shippingNameError =
                    "Shipping Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                  newFields[index].shippingNameError =
                    "Only letters and spaces allowed";
                } else {
                  newFields[index].shippingNameError = "";
                }

                newFields[index].shippingName = value;
                setFields(newFields);
              }}
              error={!!field.shippingNameError}
              helperText={field.shippingNameError || ""}
              variant="standard"
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="BL No/Be No"
              type="number"
              id={`BLNo_${index}`}
              value={field.BLNo}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].BLNoError = "BL No/Be No is required";
                } else if (Number(value) < 0) {
                  newFields[index].BLNoError = "BL No/Be No cannot be negative";
                } else {
                  newFields[index].BLNoError = "";
                }

                newFields[index].BLNo = value;
                setFields(newFields);
              }}
              error={!!field.BLNoError}
              helperText={field.BLNoError || ""}
              variant="standard"
            />
          </Box>
        </Stack>
        <Stack
          // key={index}
          spacing={2}
          direction={{ xs: "column", md: "row" }}
          sx={{
            p: 2,
            pb: 0,
            justifyContent: "start",
            borderWidth: 1,
            display: "flex",
            borderColor: "black",
          }}
          wrap="wrap"
        >
          
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Net Quantity"
              type="number"
              id={`Quantity_${index}`}
              value={field.quantity}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].quantityError = "Net Quantity is required";
                } else if (Number(value) < 0) {
                  newFields[index].quantityError =
                    "Net Quantity cannot be negative";
                } else {
                  newFields[index].quantityError = "";
                }

                newFields[index].quantity = value;
                setFields(newFields);
              }}
              error={!!field.quantityError}
              helperText={field.quantityError || ""}
              variant="standard" // or "outlined" / "filled" based on your design
            />
          </Box>
          <Box sx={{ width: "100%" }}>
                      <FormControl fullWidth size="small">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            htmlFor={`Be_${index}`}
                            label="Be Date"
                            name="BeDate"
                            value={dayjs(field.beDate)}
                            onChange={(newvalue) => {
                              const newFields = [...fields];
                              if (newvalue === null) {
                                newFields[index].beDateError = true;
                              } else {
                                newFields[index].beDateError = false;
                              }
                              newFields[index].beDate = newvalue;
          
                              // newFields[index].blDate = newvalue;
                              setFields(newFields);
                            }}
                            slotProps={{
                              textField: {
                                size: "small",
                                id: "beDate",
                                variant: "standard",
                                fullWidth: true,
                                error: !!field.beDateError,
                                helperText: !!field.beDateError && "Be Date is required",
                              },
                            }}
                            
                          />
                        </LocalizationProvider>
                      </FormControl>
                    </Box>
                    <Box sx={{ width: "100%" }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Bill Of Entry"
                        id={`Bill_Of_Entry_${index}`}
                        type="text"
                        value={field.billOfEntry}
                        onChange={(e) => {
                          const newFields = [...fields];
                          const value = e.target.value;
          
                          if (value === "") {
                            newFields[index].billOfEntryError =
                              "Bill of Entry is required";
                          } else {
                            newFields[index].billOfEntryError = "";
                          }
          
                          newFields[index].billOfEntry = value;
                          setFields(newFields);
                        }}
                        error={!!field.billOfEntryError}
                        helperText={field.billOfEntryError || ""}
                        variant="standard"
                      />
                    </Box>
        </Stack>
        <Stack
                  // key={index}
                  spacing={1}
                  direction={{ xs: "column", md: "row" }}
                  sx={{
                    p: 2,
                    pb: 0,
                    justifyContent: "start",
                    borderWidth: 1,
                    display: "flex",
                    borderColor: "black",
                  }}
                  wrap="wrap"
                >
                  <BillingDropDownTwo
                  label="saler name"
                    billing={field.billing}
                    variant="standard"
                    setBilling={(value) => {
                      if (value === "Select") {
                        field.billingError = true;
                      } else {
                        field.billingError = false;
                      }
                      const updatedFields = [...fields];
                      updatedFields[index].billing = value;
                      setFields(updatedFields);
                    }}
                    errorsBilling={field.billingError}
                    setErrorsBilling={(value) => {
                      const updatedFields = [...fields];
                      updatedFields[index].billingError = value;
                      setFields(updatedFields);
                    }}
                    NotIsList={true}
                  />
                  <ProductDropDownTwo
                    variant="standard"
                    selectedProduct={field.ProductName}
                    setSelectedProduct={(value) => {
                      if (value === "Select") {
                        field.ProductNameError = true;
                      } else {
                        field.ProductNameError = false;
                      }
                      const updatedFields = [...fields];
                      updatedFields[index].ProductName = value;
                      setFields(updatedFields);
                    }}
                    errorsProduct={field.ProductNameError}
                    setErrorsProduct={(value) => {
                      const updatedFields = [...fields];
                      updatedFields[index].ProductNameError = value;
                      setFields(updatedFields);
                    }}
                    NotIsList={true}
                  />
                  <PortDropDownTwo
                    variant="standard"
                    selectedPort={field.portName}
                    setSelectedPort={(value) => {
                      if (value === "Select") {
                        field.portNameError = "Port name is required";
                      } else {
                        field.portNameError = "";
                      }
                      const updatedFields = [...fields];
                      updatedFields[index].portName = value;
                      setFields(updatedFields);
                    }}
                    errorsPortName={field.portNameError}
                    setErrorsPortName={(value) => {
                      const updatedFields = [...fields];
                      updatedFields[index].portNameError = value;
                      setFields(updatedFields);
                    }}
                    NotIsList={true}
                  />
                </Stack>
                <Stack
                spacing={1}
                direction={{ xs: "column", md: "row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  display: "flex",
                  borderColor: "black",
                }}
                wrap="wrap">
                 <TextField
                  id="GrossQut"
                    name="GrossQut"
                    label="Gross Qut"
                    value={field.grossQuantity}
                    type="number"
                    onChange={(e)=>{
                      const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].grossQuantityError = "Gross Quantity is required";
                } else if (Number(value) < 0) {
                  newFields[index].grossQuantityError =
                    "Gross Quantity cannot be negative";
                } else {
                  newFields[index].grossQuantityError = "";
                }

                newFields[index].grossQuantity = value;
                setFields(newFields);
              
                    }}
                    error={field.grossQuantityError}
                    helperText={field.grossQuantityError || ""}
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                  id="QtrQut"
                    name="QtrQut"
                    label="Qtr  Qut"
                    value={field.otrQut}
                    error={field.otrQutError}
                    helperText={field.otrQutError}
                    onChange={(e)=>{
                      const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].otrQutError = "otrQut is required";
                } else if (Number(value) < 0) {
                  newFields[index].otrQutError =
                    "otrQut cannot be negative";
                } else {
                  newFields[index].otrQutError = "";
                }

                newFields[index].otrQut = value;
                setFields(newFields);
              
                    }}
                    type="number"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                  id="name"
                    name="name"
                    
                    label="Otr Persent"
                    value={calculatePercentage()}
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                </Stack>
        <Box
          sx={{
            mt:2,
            width: "100%",
            display:edit === true ? "none": "flex",
            position:"relative",
            justifyContent: "center",
          }}
        >
          <Button value="Open-tank" onClick={verify} variant="contained"  color="primary" sx={{p:1,textTransform:"capitalize",width:120}}  >
            Open Tank
          </Button>
          
          {/* <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleRemoveFieldBlData(index)}
            disabled={fields.length === 1}
          >
            <DeleteIcon />
          </IconButton> */}
          <Button startIcon={<DeleteIcon />} aria-label="delete"
            color="error"
            onClick={() => handleRemoveFieldBlData(index)}
            disabled={fields.length === 1}
            sx={{mx:2, textTransform:"capitalize"}}
            variant="contained"
            >Delete</Button>
          <Button value="X-Bond" onClick={verify}  variant="contained"  color="primary" sx={{p:1,textTransform:"capitalize",width:120}}  >
            X-Bond
          </Button>
        </Box>
      </Box>
      
    </Stack>
    <TankForm open={open} dataInfo={dataInfo}
        setOpen={setOpen} userId={userId}/>
    <XBondForm open={xbondOpen} dataInfo={dataInfo}
        setOpen={setXbondOpen} userId={userId}/>
    </React.Fragment>
  );
}
BlDataItems.propType = {
  vessalInfo:PropTypes.array,
  index:PropTypes.any,
  validateFields:PropTypes.func,
  setFields:PropTypes.func,
  handleRemoveFieldBlData:PropTypes.func,
  field:PropTypes.object,
  fields:PropTypes.array,
   disabled:PropTypes.bool
};
BlDataItems.defaultProps = {
  vessalInfo:[],
  index:0,
  validateFields:()=>{},
  setFields:()=>{},
  handleRemoveFieldBlData:()=>{},
  field:{},
  fields:[],
   disabled:false
};