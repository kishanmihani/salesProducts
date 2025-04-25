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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
export default function BlDataItems({
  field,
  disabled,
  index,
  fields,
  setFields,
  handleRemoveFieldBlData,
}) {
  return (
    <Stack
      key={`${index}`}
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
          key={`Bl${index}`}
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
            <FormControl fullWidth size="small" error={!!field.blDateError}>
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
              label="Shipping Name"
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
              label="BL No"
              type="number"
              id={`BLNo_${index}`}
              value={field.BLNo}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].BLNoError = "BL No is required";
                } else if (Number(value) < 0) {
                  newFields[index].BLNoError = "BL No cannot be negative";
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
              label="Bl Amt (AED)"
              type="number"
              id={`Bl_Amt_${index}`}
              value={field.blAmt}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].blAmtError = "Bl Amt is required";
                } else if (Number(value) < 0) {
                  newFields[index].blAmtError = "Bl Amt cannot be negative";
                } else {
                  newFields[index].blAmtError = "";
                }

                newFields[index].blAmt = value;
                setFields(newFields);
              }}
              error={!!field.blAmtError}
              helperText={field.blAmtError || ""}
              variant="standard"
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Roe"
              type="number"
              id={`Roe_${index}`}
              value={field.roe}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].roeError = "Roe is required";
                } else if (Number(value) < 0) {
                  newFields[index].roeError = "Roe cannot be negative";
                } else {
                  newFields[index].roeError = "";
                }

                newFields[index].roe = value;
                setFields(newFields);
              }}
              error={!!field.roeError}
              helperText={field.roeError || ""}
              variant="standard"
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="Cargo Price"
              type="number"
              id={`Cargo_Price_${index}`}
              value={field.cargoPrice}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value.trim() === "") {
                  newFields[index].cargoPriceError = "Cargo Price is required";
                } else if (Number(value) < 0) {
                  newFields[index].cargoPriceError =
                    "Cargo Price cannot be negative";
                } else {
                  newFields[index].cargoPriceError = "";
                }

                newFields[index].cargoPrice = value;
                setFields(newFields);
              }}
              error={!!field.cargoPriceError}
              helperText={field.cargoPriceError || ""}
              variant="standard"
            />
          </Box>
        </Stack>
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
            <TextField
              fullWidth
              size="small"
              type="number"
              variant="standard"
              label="Custom Duty"
              id={`Custom_${index}`}
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
              error={!!field.CustomError}
              helperText={field.CustomError}
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              size="small"
              label="IGST"
              type="number"
              id={`IGST_${index}`}
              value={field.iGst}
              onChange={(e) => {
                const newFields = [...fields];
                const value = e.target.value;

                if (value === "" || Number(value) === 0) {
                  newFields[index].iGstError = "IGST is required";
                } else if (Number(value) < 0) {
                  newFields[index].iGstError = "IGST cannot be negative";
                } else {
                  newFields[index].iGstError = "";
                }

                newFields[index].iGst = value;
                setFields(newFields);
              }}
              error={!!field.iGstError}
              helperText={field.iGstError || ""}
              variant="standard" // Use "outlined" or "filled" if preferred
            />
          </Box>
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
        </Stack>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleRemoveFieldBlData(index)}
            disabled={fields.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
}
