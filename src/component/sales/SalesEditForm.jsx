import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useLocation, useNavigate } from "react-router";
import dayjs from "dayjs";

import BillingDropDown from "../commonComponent/billingDropDown/billingDropDown";
import PortDropDown from "../commonComponent/PortDropdown/ProtDropDown";
import CustomerDropDown from "../commonComponent/CustomerDropDown/CustomerDropDown";
import DeliveryDropDown from "../commonComponent/DeliveryDropDown/DeliveryDropDown";
import ProductDropDown from "../commonComponent/ProductDropDown/ProductDropDown";
import PaymentDropDown from "../commonComponent/PaymentDropDown/PaymentDropDown";
import CustomeAlerts from "../commonComponent/CustomeAlert/CustomeAlert";
import { authAxios } from "../utils/authAxios";

export default function SalesEditForm() {
      const [tableId, setTableId] = useState(null);
      const [finalPrice, setFinalPrice] = useState(0);
    const { state } = useLocation();
    const rowData = state?.rowData || null;
const [poNumber, setPoNumber] = useState(0);
  const [selectedBilling, setSelectedBilling] = useState("Select");
  const [selectedOrderDate, setSelectOrderDate] = useState(null);
  const [selectedValidityDate, setSelectedValidityDate] = useState(null);
  const [selectedPort, setSelectedPort] = useState("Select");
  const [selectedProduct, setSelectedProduct] = useState("Select");
  const [selectedCustomer, setSelectedCustomer] = useState("Select");
  const [selectedBitumenPrice, setSelectedBitumenPrice] = useState(null);
  const [selectedTransportation, setSelectedTransportation] = useState(0);
  const [selectedBillingPrice, setSelectedBillingPrice] = useState(0);
  const [selectedGST, setSelectedGST] = useState(0);
  const [selectedSellingPrice, setSelectedSellingPrice] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [selectedQuntity, setSelectedQuntity] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState("Select");
  const [selectedRemark, setSelectedRemark] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("Select");
  const [advance, setAdvance] = useState({ percent: "", value: "" });
  const [creditDays, setCreditDays] = useState("");
  const [selectedDiscountvalue, setSelectedDiscountvalue] = useState(0);
  const [selectedNetPrice, setSelectedNetPrice] = useState(0);
  const [selectedTransporter, setSelectedTransporter] = useState("Select");
  const [selectedSellingValue, setSelectedSellingValue] = useState(0);
  const [selectTransporterName, setSelectTransporterName] = useState("");
  const [errors, setErrors] = useState({});
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [custAlert, setCustAlert] = useState(null);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  const showSuccess = (data) => setCustAlert({ type: "success", message: data });
  const showError = (data) => setCustAlert({ type: "error", message: data });

  /** ------------------------- PRICE CALCULATIONS ------------------------- **/
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedBitumenPrice !== "" || selectedTransportation !== "") {
        setSelectedBillingPrice(
          ((Number(selectedBitumenPrice) * 100) / 118).toFixed(2)
        );
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedTransportation, selectedBitumenPrice]);
   function changeBitumessPtice(){
   setTimeout(() => {
      if (selectedBillingPrice !== "" || selectedBillingPrice !== 0) {
        const gstValue = (
          ((Number(selectedBillingPrice) + Number(selectedTransportation)) / 100) *
          18
        ).toFixed(2);
        setSelectedGST(parseFloat(gstValue));
      }

      const sellingPrice = (
        Number(selectedBillingPrice) +
        Number(selectedGST) +
        Number(selectedTransportation)
      ).toFixed(2);
      setSelectedSellingPrice(parseFloat(sellingPrice));

      const sellingValue = (selectedSellingPrice * selectedQuntity).toFixed(2);
      setSelectedSellingValue(parseFloat(sellingValue));
    }, 300);
   }
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedBillingPrice !== "" || selectedBillingPrice !== 0) {
        const gstValue = (
          ((Number(selectedBillingPrice) + Number(selectedTransportation)) / 100) *
          18
        ).toFixed(2);
        setSelectedGST(parseFloat(gstValue));
      }

      const sellingPrice = (
        Number(selectedBillingPrice) +
        Number(selectedGST) +
        Number(selectedTransportation)
      ).toFixed(2);
      setSelectedSellingPrice(parseFloat(sellingPrice));
      setFinalPrice(Number(selectedSellingPrice) - Number(selectedDiscount));
      const sellingValue = (selectedSellingPrice * selectedQuntity).toFixed(2);
      setSelectedSellingValue(parseFloat(sellingValue));
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedBillingPrice, selectedGST, selectedSellingPrice, selectedQuntity]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedDiscount !== 0 || selectedQuntity !== 0) {
        setSelectedDiscountvalue(selectedDiscount * selectedQuntity);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedQuntity, selectedDiscount]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedSellingValue !== 0 || selectedDiscountvalue !== 0) {
        setSelectedNetPrice(
          parseFloat(selectedSellingValue - selectedDiscountvalue).toFixed(2)
        );
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [selectedSellingValue, selectedDiscountvalue]);

  /** ------------------------- FORM HANDLER ------------------------- **/
  const resetForm = () => {
    setSelectedBilling("Select");
    setSelectOrderDate(null);
    setSelectedValidityDate(null);
    setSelectedPort("Select");
    setSelectedProduct("Select");
    setSelectedCustomer("Select");
    setSelectedBitumenPrice(0);
    setSelectedTransportation("");
    setSelectedBillingPrice(0);
    setSelectedGST(0);
    setSelectedSellingPrice(0);
    setSelectedDiscount(0);
    setSelectedSellingValue(0);
    setSelectedQuntity(0);
    setSelectedDelivery("Select");
    setSelectedRemark("");
    setSelectedPayment("Select");
    setSelectedDiscountvalue(0);
    setSelectedNetPrice(0);
    setSelectedTransporter("Select");
    setSelectTransporterName("");
  };

  const handleClose = () => setCustAlert(null);

  async function formSubmithandler(event) {
    event.preventDefault();
    setLoader(true);
    setSubmitDisabled(true);

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const newErrors = {};

    // ✅ Validation
    for (let key in formJson) {
      const value = formJson[key];
      if (key === "Remark") continue;

      if (value === "" || value === "Select") {
        newErrors[key] = `${key} is required`;
        continue;
      }

      if (["Transportation", "Bitumen Price", "Discount", "Quntity"].includes(key)) {
        if (parseFloat(value) < 0) {
          newErrors[key] = `${key} must not be negative`;
        }
      }
    }

    // ✅ Advance payment validation
    if (selectedPayment === "Advance Payments") {
      const advRaw = formJson["Advance Value"];
      const advVal = parseFloat(advRaw);

      if (!advRaw) {
        newErrors["Advance Value"] = "Advance payment value is required";
      } else if (isNaN(advVal)) {
        newErrors["Advance Value"] = "Advance payment value must be a number";
      } else if (advVal <= 0) {
        newErrors["Advance Value"] = "Advance payment value must be > 0";
      }
    }

    // ✅ Credit payment validation
    if (selectedPayment === "Credit Payments") {
      const cdRaw = formJson["Credit Days"];
      const cdVal = parseInt(cdRaw, 10);

      if (!cdRaw) {
        newErrors["Credit Days"] = "Credit Days is required";
      } else if (isNaN(cdVal)) {
        newErrors["Credit Days"] = "Credit Days must be a number";
      } else if (cdVal <= 0) {
        newErrors["Credit Days"] = "Credit Days must be > 0";
      }
    }

    // ✅ Error handling
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError("Please fill required fields.");
      setSubmitDisabled(false);
      setLoader(false);
      return;
    }

    // ✅ Submit data
    const data = {
      user_id: userId,
      Company_Name: formJson["Billing name"],
      Customer_Name: formJson["Customer name"],
      Transport_Name: formJson["Transporter name"],
      Transport_ON: formJson["Transporter"],
      Port_Name: formJson["Port name"],
      Delivery_Type: formJson["Delivery name"],
      Payment_Type: formJson["Payment name"],
      Product_Name: formJson["Product name"],
      price: formJson["Bitumen Price"],
      Transport: formJson["Transportation"],
      Gst: formJson["GST 18%"],
      Discount: formJson["Discount"],
      Quantity: formJson["Quntity"],
      Entry_Date: formJson["Order Date"],
      Validity_Date: formJson["Validity Date"],
      Remark: formJson["Remark"],
      poNumber:poNumber,
      Adv_Value:
        selectedPayment === "Advance" ? formJson["Advance Value"] : "",
      Adv_Per:
        selectedPayment === "Advance"
          ? formJson["Advance Payment %"]
          : "",
      c_Days:
        selectedPayment === "Credit Payments" ? formJson["Credit Days"] : "",
      Table_Id: rowData.table_Id,

    };

    try {
      const res = await authAxios.post("/BituRep/Api/Account/update_Sodata", data);
      if (res.data.message === "Data updated successfully") {
        showSuccess("Data updated successfully");
        resetForm();
        navigate(-1);
      } else {
        showError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      showError("An error occurred while submitting the form.");
    } finally {
      setLoader(false);
      setSubmitDisabled(false);
    }
  }
useEffect(() => {
  console.log(rowData);
  if (rowData) {
    setSelectedBilling(rowData.company_Name || "");
    setSelectedCustomer(rowData.customer_Name || "");
    setSelectTransporterName(rowData.transport_Name || "");
    setSelectedPort(rowData.port_Name || "");
    setSelectedDelivery(rowData.delivery_Type || "");
    setSelectedPayment(rowData.payment_Type || "");
    setSelectedProduct(rowData.product_Name || "");
    setSelectedBitumenPrice(rowData.price || "");
    setSelectedTransportation(rowData.transport || "");
    setSelectedGST(rowData.Gst || "");
    setSelectedDiscount(rowData.discount || "");
    setSelectedQuntity(rowData.quantity || "");
    setSelectOrderDate(rowData.entry_Date ? dayjs(rowData.entry_Date) : null);
    setSelectedValidityDate(rowData.validity_Date ? dayjs(rowData.validity_Date) : null);
    setSelectedRemark(rowData.remark || "");
    setTableId(rowData.Table_Id || null);
    setPoNumber(rowData?.poNumber)

    // ✅ Transporter logic
    if (Number(rowData.transport) === 0) {
      setSelectedTransporter("Buyer");
    } else if (Number(rowData.transport) > 0) {
      setSelectedTransporter("Seller");
    } else {
      setSelectedTransporter("Other");
    }

    // ✅ Advance / Credit specific setup (optional if API supports it)
    debugger;
    if (rowData.payment_Type == "Advance") {
      setSelectedPayment("Advance Payments")
      setAdvance({
        percent: rowData.adv_Per || "",
        value: rowData.adv_Value || "",
      });
    } else if (rowData.payment_Type === "Credit Payments") {
      setCreditDays(Number(rowData.c_Days) || "");
    }
  }
}, [rowData]);
  /** ------------------------- RENDER ------------------------- **/
  return (
    <React.Fragment>
      {/* Header */}
      <Box
        sx={{
          p: 1,
          position: "sticky",
          top: 0,
          bgcolor: "#fff",
          borderBottom: 1,
          zIndex: 4,
          display: "flex",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            border: 1,
            borderColor: "#eee",
            width: 40,
          }}
        >
          <ArrowBackIcon color="#000" />
        </button>
        <Typography variant="h5" align="center" width="100%">
          &nbsp;Sales Edit Form
        </Typography>
      </Box>

      {/* Form Body */}
      <Paper sx={{ p: 2 }} elevation={0}>
        <form onSubmit={formSubmithandler}>
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ p: 2, pb: 0 }}
          >
            {/* Left Section */}
            <Box sx={{ width: "100%" }}>
              <BillingDropDown
                billing={selectedBilling}
                setBilling={setSelectedBilling}
                errors={errors}
              />
              <Box sx={{ margin: "auto", mb: 1 }}>
  <ProductDropDown
    selectedProduct={selectedProduct}
    setSelectedProduct={setSelectedProduct}
    errors={errors}
  />
</Box>

              <TextField
                fullWidth
                label="Qty in MTS"
                name="Quntity"
                type="number"
                size="small"
                value={selectedQuntity}
                onChange={(e) => setSelectedQuntity(e.target.value)}
                error={!!errors?.["Quntity"]}
                helperText={errors?.["Quntity"]}
              />

              {/* Validity Date */}
              <FormControl fullWidth size="small" margin="normal">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Validity Date"
                    name="Validity Date"
                    value={selectedValidityDate}
                    minDate={dayjs().startOf("day")}
                    onChange={(newValue) => setSelectedValidityDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors?.["Validity Date"],
                        helperText: errors?.["Validity Date"],
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>

              {/* Pricing Fields */}
              <TextField
                fullWidth
                label="Price Before Trans (Incl GST)"
                name="Bitumen Price"
                margin="normal"
                type="number"
                size="small"
                value={selectedBitumenPrice}
                onChange={(e) => setSelectedBitumenPrice(e.target.value)}
                error={!!errors?.["Bitumen Price"]}
                helperText={errors?.["Bitumen Price"]}
              />

              <TextField
                fullWidth
                label="Transportation (Excl GST)"
                name="Transportation"
                margin="normal"
                type="number"
                size="small"
                value={selectedTransportation}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTransportation(value);
                  if (value == 0) setSelectedTransporter("Buyer");
                  else if (value > 0) setSelectedTransporter("Seller");
                  changeBitumessPtice()
                }}
                error={!!errors?.["Transportation"]}
                helperText={errors?.["Transportation"]}
              />

              <TextField
                fullWidth
                label="Discount through CN (Incl GST)"
                name="Discount"
                type="number"
                margin="normal"
                size="small"
                value={selectedDiscount}
                onChange={(e) => setSelectedDiscount(e.target.value)}
                error={!!errors?.["Discount"]}
                helperText={errors?.["Discount"]}
              />

              <TextField
                fullWidth
                label="Bitumen Basic Price (Excl GST)"
                name="Billing_Price"
                margin="normal"
                type="number"
                size="small"
                value={selectedBillingPrice}
                 sx={{ 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                    '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                  }}
              />

              <TextField
                fullWidth
                label="GST 18%"
                name="GST 18%"
                margin="normal"
                type="number"
                size="small"
                value={selectedGST}
                 sx={{ 
                  backgroundColor: "#e3f2fd", 
                  borderRadius: 1,
                  '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                  '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                   }}
              />

              <TextField
              fullWidth
                  label="Selling Price (After GST)"
                  name="Selling Price"
                  margin="normal"
                  type="number"
                  size="small"
                  value={selectedSellingPrice}
                  sx={{ 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                    '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                  }}
                />

              <TextField
                            fullWidth
                                label="Final pirce after discount"
                                name="Selling Price"
                                margin="normal"
                                type="number"
                                size="small"
                                value={finalPrice}
                                sx={{ 
                                  backgroundColor: "#e3f2fd", 
                                  borderRadius: 1,
                                  '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                                  '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                                }}
                              />
            </Box>

            {/* Right Section */}
            <Box sx={{ width: "100%" }}>


             


              <FormControl fullWidth  size="small">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Order Date"
                    name="Order Date"
                    value={selectedOrderDate}
                    onChange={(newValue) => setSelectOrderDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors?.["Order Date"],
                        helperText: errors?.["Order Date"],
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>

              <CustomerDropDown
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                errors={errors}
              />

              <PortDropDown
                selectedPort={selectedPort}
                setSelectedPort={setSelectedPort}
                errors={errors}
              />

              <DeliveryDropDown
                selectedDelivery={selectedDelivery}
                setSelectedDelivery={setSelectedDelivery}
                errors={errors}
              />

              {/* Transporter */}
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="Transporter">Transporter</InputLabel>
                <Select
                  labelId="Transporter"
                  id="Transporter"
                  value={selectedTransporter}
                  label="Transporter"
                  name="Transporter"
                  onChange={(e) => setSelectedTransporter(e.target.value)}
                >
                  <MenuItem disabled value="Select">
                    Please select
                  </MenuItem>
                  <MenuItem value="Buyer">Buyer</MenuItem>
                  <MenuItem value="Seller">Seller</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Transporter name"
                name="Transporter name"
                margin="normal"
                size="small"
                disabled={selectedTransporter === "Buyer"}
                type="text"
                value={selectTransporterName}
                onChange={(e) =>
                  setSelectTransporterName(
                    selectedTransporter === "Seller" ? e.target.value : ""
                  )
                }
                error={!!errors?.["Transporter name"]}
                helperText={errors?.["Transporter name"]}
              />

              <TextField
                fullWidth
                label="Selling Value (After GST)"
                name="Selling value"
                margin="normal"
                size="small"
                type="number"
                value={selectedSellingValue}
                sx={{ 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                    '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                  }}
              />

              <TextField
                fullWidth
                label="Discount value"
                name="DiscountValue"
                margin="normal"
                size="small"
                value={selectedDiscountvalue}
                sx={{ 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                    '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                  }}
              />

              <TextField
                fullWidth
                label="Net Amount Receivable"
                name="Net Price"
                type="number"
                margin="normal"
                size="small"
                value={selectedNetPrice}
                sx={{ 
                    backgroundColor: "#e3f2fd", 
                    borderRadius: 1,
                    '& .MuiInputBase-input': { color: 'black', fontWeight: 'bold' }, // input text
                    '& .MuiInputLabel-root': { color: 'black', fontWeight: 'bold' }  // label text
                  }}
              />

                <TextField
                fullWidth
                label="PO Number"
                name="Remark"
                margin="normal"
                size="small"
                multiline
                rows={1}
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
              />

             <TextField
                fullWidth
                label="Remark"
                name="Remark"
                margin="normal"
                size="small"
                multiline
                rows={1}
                value={selectedRemark}
                onChange={(e) => setSelectedRemark(e.target.value)}
              />
            </Box>
          </Stack>

          {/* Payment Conditional Fields */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ p: 2, justifyContent: "flex-start" }}
          >

             <PaymentDropDown
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
                errors={errors}
              />
            {selectedPayment === "Advance Payments" && (
              <>
                <TextField
                  label="Advance Payment %"
                  size="small"
                  type="number"
                  name="Advance Payment %"
                  value={
                    selectedNetPrice && advance.value
                      ? ((advance.value / selectedNetPrice) * 100).toFixed(2)
                      : ""
                  }
                  InputProps={{ readOnly: true }}
                />

                <TextField
                  label="Advance Payment Value"
                  type="number"
                  size="small"
                  name="Advance Value"
                  value={advance.value}
                  onChange={(e) =>
                    setAdvance((prev) => ({
                      ...prev,
                      value: Number(e.target.value),
                    }))
                  }
                  error={!!errors["Advance Value"]}
                  helperText={errors["Advance Value"]}
                />
              </>
            )}

            {selectedPayment === "Credit Payments" && (
              <TextField
                label="Credit Days"
                type="number"
                size="small"
                name="Credit Days"
                sx={{ width: { xs: "100%", md: "200px" } }}
                onChange={(e) => setCreditDays(e.target.value)}
                value={creditDays}
                error={!!errors["Credit Days"]}
                helperText={errors["Credit Days"]}
              />
            )}
          </Stack>

          <Box mr={2} align="right">
            <Button
              variant="contained"
              color="success"
              size="small"
              type="submit"
              disabled={submitDisabled}
            >
              {!loader ? "Submit" : <CircularProgress sx={{ color: "white" }} />}
            </Button>
          </Box>
        </form>
      </Paper>

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
