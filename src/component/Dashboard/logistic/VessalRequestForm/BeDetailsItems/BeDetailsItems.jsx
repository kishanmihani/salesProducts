import React from "react";
import {
  Box,
  Stack,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import BillingDropDownTwo from "../../../../commonComponent/BillingDropDown/BillingDropDownTwo";
import PortDropDownTwo from "../../../../commonComponent/PortDropdown/ProtDropDowntwo";
import ProductDropDownTwo from "../../../../commonComponent/ProductDropDown/ProductDropDownTwo";

const BeDetailsItem = ({ field, index, beDetailsfields, setBeDetailsfields, handleRemoveFieldBeDetails }) => {
  

  return (
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
                    <FormControl  fullWidth size="small" >
                  <LocalizationProvider  dateAdapter={AdapterDayjs}>
                    <DatePicker
                    htmlFor={`Be_${index}`}
                      label="Be Date"
                      name="BeDate"
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
  <TextField
    fullWidth
    size="small"
    label="Bill Of Entry"
    id={`Bill_Of_Entry_${index}`}
    type="text"
    value={field.billOfEntry}
    onChange={(e) => {
      const newFields = [...beDetailsfields];
      const value = e.target.value;

      if (value === "") {
        newFields[index].billOfEntryError = "Bill of Entry is required";
      } else {
        newFields[index].billOfEntryError = "";
      }

      newFields[index].billOfEntry = value;
      setBeDetailsfields(newFields);
    }}
    error={!!field.billOfEntryError}
    helperText={field.billOfEntryError || ""}
   
    variant="standard"
  />
</Box>

<Box sx={{ width: "100%" }}>
  <TextField
    fullWidth
    size="small"
    label="Net Quantity"
    id={`bNet_Quntity_${index}`}
    type="number"
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
    error={!!field.netQuntityError}
    helperText={field.netQuntityError || ""}
    
    variant="standard"
  />
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
                    </Stack>
  );
};

export default BeDetailsItem;
