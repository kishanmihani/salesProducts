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
import BillingDropDown from "../commonComponent/billingDropDown/billingDropDown";
import PortDropDown from "../commonComponent/PortDropdown/ProtDropDown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomerDropDown from "../commonComponent/CustomerDropDown/CustomerDropDown";
import DeliveryDropDown from "../commonComponent/DeliveryDropDown/DeliveryDropDown";
import ProductDropDown from "../commonComponent/ProductDropDown/ProductDropDown";
import PaymentDropDown from "../commonComponent/PaymentDropDown/PaymentDropDown";
import { authAxios } from "../utils/authAxios";
import { useNavigate } from "react-router";
import CustomeAlerts from "../commonComponent/CustomeAlert/CustomeAlert";
import dayjs from "dayjs";
export default function SalesRestitration() {
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
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [selectedQuntity, setSelectedQuntity] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState("Select");
  const [selectedRemark, setSelectedRemark] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("Select");
  const [advance, setAdvance] = useState({
    percent: "",
    value: "",
  });
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
  const showSuccess = (data) => {
    setCustAlert({ type: "success", message: data });
  };
  const showError = (data) => {
    setCustAlert({ type: "error", message: data });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedBitumenPrice !== "" || selectedTransportation !== "") {
        setSelectedBillingPrice(() =>
          ((Number(selectedBitumenPrice) * 100) / 118).toFixed(2)
        );
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [selectedTransportation, selectedBitumenPrice, selectedBillingPrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedBillingPrice !== "" || selectedBillingPrice !== 0) {
        console.log(selectedBillingPrice, selectedTransportation);
        setSelectedGST(
          parseFloat(
            ((Number(selectedBillingPrice) + Number(selectedTransportation)) /
              100) *
              18
          ).toFixed(2)
        );
      }
      if (
        selectedBillingPrice !== "" ||
        selectedBillingPrice !== 0 ||
        selectedGST !== 0 ||
        selectedGST !== ""
      ) {
        setSelectedSellingPrice(() =>
          parseFloat(
            Number(selectedBillingPrice) +
              Number(selectedGST) +
              Number(selectedTransportation)
          ).toFixed(2)
        );
      }
      if (selectedSellingPrice !== 0 || selectedQuntity !== 0) {
        setSelectedSellingValue(() =>
          parseFloat(selectedSellingPrice * selectedQuntity).toFixed(2)
        );
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [
    selectedBillingPrice,
    selectedBilling,
    selectedGST,
    selectedSellingPrice,
    selectedQuntity,
  ]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedDiscount !== 0 || selectedQuntity !== 0) {
        setSelectedDiscountvalue(() => selectedDiscount * selectedQuntity);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [selectedQuntity, selectedDiscount]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedSellingValue !== 0 || selectedDiscountvalue !== 0) {
        setSelectedNetPrice(() =>
          parseFloat(selectedSellingValue - selectedDiscountvalue).toFixed(2)
        );
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [selectedSellingValue, selectedDiscountvalue]);

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
  async function formSubmithandler(event) {
    setLoader(true);
    event.preventDefault();
    setSubmitDisabled(true);
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    let emptyFields = [];
    const newErrors = {};

    for (let key in formJson) {
      const value = formJson[key];

      if (key === "Remark") continue;

      if (value === "" || value === "Select") {
        newErrors[key] = `${key} is required`;
        emptyFields.push(key);
        continue;
      }

      if (
        ["Transportation", "Bitumen Price", "Discount", "Quntity"].includes(key)
      ) {
        if (parseFloat(value) < 0) {
          newErrors[key] = `${key} value must not be negative`;
        }
      }
      if (["Bitumen Price", "Quntity", "Bitumen Price"].includes(key)) {
        if (parseFloat(value) == 0) {
          newErrors[key] = `${key} not be zero`;
        }
      }
      if (["Transporter name"].includes(key)) {
        if (formJson?.["Transporter"] === "Seller") {
          if (key > 0) {
            newErrors[key] = `${key} name not be netative`;
          }
        }
      }
       if (selectedPayment === "Advance Payment") {
    // if (!formJson["Advance Value"] || parseFloat(formJson["Advance Value"]) <= 0) {
    //   newErrors["Advance Value"] = "Advance Value must be greater than 0";
    // }
    
    // else if(parseFloat(formJson["Advance Value"]) === "" || parseFloat(formJson["Advance Value"]) === null || (formJson["Advance Value"]) === NaN ){
    //   newErrors["Advance Value"] = "Advance Value is required";
    // }
    // debugger;
    const advRaw = formJson["Advance Value"];
const advVal = parseFloat(advRaw);

if (!advRaw) {
  // handles "", null, undefined
  newErrors["Advance Value"] = "Advance payment value is required";
} else if (isNaN(advVal)) {
  newErrors["Advance Value"] = "Advance payment value must be a number";
} else if (advVal < 0) {
  newErrors["Advance Value"] = "Advance payment value cannot be less than 0";
} else if (advVal === 0) {
  newErrors["Advance Value"] = "Advance payment value cannot be 0";
}

  }

  // ✅ Credit Payment validations
  if (selectedPayment === "Credit Payment") {
  const cdRaw = formJson["Credit Days"];
  const cdVal = parseInt(cdRaw, 10);

  if (!cdRaw) {
    newErrors["Credit Days"] = "Credit Days is required";
  } else if (isNaN(cdVal)) {
    newErrors["Credit Days"] = "Credit Days must be a number";
  } else if (cdVal < 0) {
    newErrors["Credit Days"] = "Credit Days cannot be less than 0";
  } else if (cdVal === 0) {
    newErrors["Credit Days"] = "Credit Days cannot be 0";
  }
}
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError("Please fill required fields.");

      setSubmitDisabled(false);
      setLoader(false);
      return;
    } else if (emptyFields.length === 0) {
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
        Adv_Value:selectedPayment === "Advance Payment" ? formJson["Advance Value"] : "",
        Adv_Per:selectedPayment === "Advance Payment" ? formJson["Advance %"] : "",
        c_Days:selectedPayment === "credit paysment" ? formJson["Credit Days"] : ""
      };

      try {
        const res = await authAxios.post(
          "BituRep/Api/Account/send_Sodata",
          data
        );

        if (res.data.message === "Email sent successfully") {
          showSuccess("Email sent successfully");
          setLoader(false);
          resetForm();
          setSubmitDisabled(false);
          navigate("/dashboard/sales/PendingApprovalForm");
          return;
        } else {
          showError(res.data.message);
          setLoader(false);
          setSubmitDisabled(false);
          return;
        }
      } catch (err) {
        console.error(err);
        setLoader(false);
        showError("An error occurred while submitting the form.");
        setSubmitDisabled(false);
      }
    }
  }

  const handleClose = () => {
    setCustAlert(null);
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
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            border: 1,
            borderColor: "#eee",
            width: 40,
            position: "relative",
          }}
        >
          <ArrowBackIcon width={90} color="#000" />
        </button>
        <Typography variant="h5" align="center" width="100%">
          &nbsp;Sales Request Form
        </Typography>
      </Box>
      <Paper sx={{ p: 2 }} elevation={0}>
        <form sx={{ p: 5 }} onSubmit={formSubmithandler}>
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ p: 2, pb: 0, justifyContent: "start" }}
          >
            <Box sx={{ width: "100%" }} md={{ width: "50%" }}>
              <BillingDropDown
                billing={selectedBilling}
                setBilling={setSelectedBilling}
                errors={errors}
              />

              <FormControl fullWidth margin="normal" size="small">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    size="small"
                    label="Order Date"
                    name="Order Date"
                    value={selectedOrderDate}
                    // minDate={dayjs().startOf('day')}
                    onChange={(newValue) => setSelectOrderDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} id="order-date-picker" />
                    )}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        id: "order-date-picker",
                        error: !!errors?.["Order Date"],
                        helperText: errors?.["Order Date"],
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              <ProductDropDown
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                errors={errors}
              />
              <CustomerDropDown
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                errors={errors}
              />

              <TextField
                fullWidth
                label="Price Before Trans (Incl GST)"
                name="Bitumen Price"
                margin="normal"
                type="number"
                size="small"
                placeholder="0"
                value={selectedBitumenPrice}
                onChange={(e) => {
                  setSelectedBitumenPrice(e.target.value);
                }}
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
                  let value = e.target.value;
                  setSelectedTransportation(value);
                  if (value == 0) {
                    setSelectedTransporter("Buyer");
                  } else if (value > 0) {
                    setSelectedTransporter("Seller");
                  }
                  // setSelectedBitumenPrice(selectedBillingPrice - value)
                }}
                error={!!errors?.["Transportation"]}
                helperText={errors?.["Transportation"]}
              />

              <TextField
                fullWidth
                label="Bitumen Basic Price (Excl GST)"
                name="Billing_Price"
                margin="normal"
                type="number"
                size="small"
                value={selectedBillingPrice}
              />
              <TextField
                fullWidth
                label="GST 18%"
                name="GST 18%"
                margin="normal"
                type="number"
                size="small"
                value={selectedGST}
              />
              <TextField
                fullWidth
                label="Selling Price (After GST)"
                name="Selling Price"
                margin="normal"
                type="number"
                size="small"
                // onChange={(e) => {
                //  let value = e.target.value;
                //  setSelectedSellingPrice(value);
                //   }}
                value={selectedSellingPrice}
              />
              <TextField
                fullWidth
                label="Discount through CN (Incl GST)"
                name="Discount"
                type="number"
                margin="normal"
                size="small"
                placeholder="0"
                value={selectedDiscount}
                error={!!errors?.["Discount"]}
                helperText={errors?.["Discount"]}
                onChange={(e) => {
                  setSelectedDiscount(e.target.value);
                }}
              />
            </Box>
            <Box sx={{ width: "100%" }} md={{ width: "50%" }}>
              <TextField
                fullWidth
                label="Qty in MTS"
                name="Quntity"
                type="number"
                size="small"
                placeholder="0"
                value={selectedQuntity}
                error={!!errors?.["Quntity"]}
                helperText={errors?.["Quntity"]}
                onChange={(e) => {
                  setSelectedQuntity(e.target.value);
                }}
              />
              <PortDropDown
                selectedPort={selectedPort}
                setSelectedPort={setSelectedPort}
                errors={errors}
              />

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
                        id: "validity-date-picker",
                        fullWidth: true,
                        error: !!errors?.["Validity Date"],
                        helperText: errors?.["Validity Date"],
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
              <DeliveryDropDown
                selectedDelivery={selectedDelivery}
                setSelectedDelivery={setSelectedDelivery}
                errors={errors}
              />
              <FormControl fullWidth size="small" margin="normal">
                <InputLabel id="Transporter">Transporter</InputLabel>
                <Select
                  labelId="Transporter"
                  id="Transporter"
                  value={selectedTransporter}
                  label="Transporter"
                  name="Transporter"
                  defaultValue="Select"
                  onChange={(e) => setSelectedTransporter(e.target.value)}
                  error={!!errors?.["Transporter"]}
                  helperText={errors?.["Transporter"]}
                  MenuProps={{ disableAutoFocusItem: true }}
                >
                  <MenuItem disabled value={"Select"}>
                    Please select
                  </MenuItem>
                  <MenuItem value={"Buyer"}>Buyer</MenuItem>
                  <MenuItem value={"Seller"}>Seller</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
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
                error={!!errors?.["Transporter name"]}
                helperText={errors?.["Transporter name"]}
                value={selectTransporterName}
                onChange={(e) => {
                  if (selectedTransporter === "Seller") {
                    setSelectTransporterName(e.target.value);
                  } else if (selectedTransporter === "Buyer") {
                    setSelectTransporterName("");
                  }
                }}
              />
              <TextField
                fullWidth
                label="Selling Value (After GST)"
                name="Selling value"
                margin="normal"
                size="small"
                type="number"
                value={selectedSellingValue}
              />
              <TextField
                fullWidth
                label="Discount value"
                name="DiscountValue"
                margin="normal"
                size="small"
                value={selectedDiscountvalue}
              />
              <TextField
                fullWidth
                label="Net Amount Recivable"
                name="Net Price"
                type="number"
                margin="normal"
                size="small"
                value={selectedNetPrice}
              />
              <TextField
              fullWidth
              size="small"
              margin="normal"
              id="Remark"
              name="Remark"
              label="Remark"
              multiline
              rows={1}
              value={selectedRemark}
              error={!!errors?.["Remark"]}
              helperText={errors?.["Remark"]}
              onChange={(e) => setSelectedRemark(e.target.value)}
            />
            
            </Box>
            
          </Stack>
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

  {selectedPayment === "Advance Payment" && (
    <React.Fragment>
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
          setAdvance((prev) => ({ ...prev, value: Number(e.target.value) }))
        }
         error={!!errors["Advance Value"]}
  helperText={errors["Advance Value"]}
      />
    </React.Fragment>
  )}

  {selectedPayment === "credit paysment" && (
    <TextField
      label="Credit Days"
      type="number"
      size="small"
      name="Credit Days"
      sx={{ width: { xs: "100%", md: "200px" } }}
      onChange={(e) => setCreditDays(e.target.value)}
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
              {!loader ? (
                "Submit"
              ) : (
                <CircularProgress sx={{ color: "white", fontSize: 17 }} />
              )}
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
