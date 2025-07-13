import React from "react";
import {
  Box,
  Stack,
  FormControl,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import BillingDropDownTwo from "../../../../commonComponent/BillingDropDown/BillingDropDownTwo";
import PortDropDownTwo from "../../../../commonComponent/PortDropdown/ProtDropDowntwo";
import ProductDropDownTwo from "../../../../commonComponent/ProductDropDown/ProductDropDownTwo";

const BeDetailsItem = ({
  field,
  disabled,
  index,
  beDetailsfields,
  setBeDetailsfields,
  handleRemoveFieldBeDetails,
}) => {
  return (
    <Stack
      key={index}
      spacing={2}
      style={{ display: !disabled ? "none" : "block" }}
      direction={{ xs: "column" }}
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
          Be details {index + 1}
        </Typography>
        
        <Stack
          key={index}
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
            <FormControl fullWidth size="small">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  htmlFor={`Be_${index}`}
                  label="BOE Date"
                  name="BeDate"
                  value={dayjs(field.beDate)}
                  onChange={(newvalue) => {
                    const newFields = [...beDetailsfields];
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
                      variant: "standard",
                      fullWidth: true,
                      error: !!field.beDateError,
                      helperText: !!field.beDateError && "BOE Date is required",
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
                const newFields = [...beDetailsfields];
                const value = e.target.value;

                if (value === "") {
                  newFields[index].billOfEntryError =
                    "Bill of Entry is required";
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

          {/* <Box sx={{ width: "100%" }}>
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
          </Box> */}
        </Stack>
        {/* <Stack
          key={index}
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
              id={`where_House_Name${index}`}
              name="whereHouseName"
              type="text"
              variant="standard"
              label="Where House Name"
              value={field.whereHouseName}
              onChange={(e) => {
                const newFields = [...beDetailsfields];
                const value = e.target.value;

                if (value === "") {
                  newFields[index].whereHouseNameError =
                    "where House Name is reqired";
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
              id={`survey_name${index}`}
              name="Survey_name"
              type="text"
              variant="standard"
              label="Surveyer_name"
              value={field.surveyerName}
              onChange={(e) => {
                const newFields = [...beDetailsfields];
                const value = e.target.value;

                if (value === "") {
                  newFields[index].surveyerNameError =
                    "Surveyer Name is reqired";
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
        </Stack> */}

        <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
          <IconButton
            aria-label="delete"
            color="error"
            size="medium"
            onClick={() => handleRemoveFieldBeDetails(index)}
            disabled={beDetailsfields.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
};

export default BeDetailsItem;
