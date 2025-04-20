import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
  Paper,
  Grid,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import BillingDropDown from "../commonComponent/billingDropDown/billingDropDown";
// import DemoContainer
import PortDropDown from "../commonComponent/PortDropdown/ProtDropDown";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomerDropDown from "../commonComponent/CustomerDropDown/CustomerDropDown";
import DeliveryDropDown from "../commonComponent/DeliveryDropDown/DeliveryDropDown";
import ProductDropDown from "../commonComponent/ProductDropDown/ProductDropDown";
import PaymentDropDown from "../commonComponent/PaymentDropDown/PaymentDropDown";
import { toast, ToastContainer } from "react-toastify";
import { authAxios } from "../utils/authAxios";
import { useNavigate } from "react-router";
import CustomeAlerts from "../commonComponent/CustomeAlert/CustomeAlert";
export default function SalesRestitration() {
  const [selectedBilling, setSelectedBilling] = useState("Select");
  const [selectedOrderDate, setSelectOrderDate] = useState(null);
  const [selectedValidityDate, setSelectedValidityDate] = useState(null);
  const [selectedPort, setSelectedPort] = useState("Select");
  const [selectedProduct, setSelectedProduct] = useState("Select");
  const [selectedCustomer, setSelectedCustomer] = useState("Select");
  const [selectedBitumenPrice, setSelectedBitumenPrice] = useState(0);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [selectedBillingPrice, setSelectedBillingPrice] = useState(0);
  // const [BillingPriceError, setBillingPriceError] = useState("");
  const [selectedGST, setSelectedGST] = useState(0);
  const [selectedSellingPrice, setSelectedSellingPrice] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [selectedQuntity, setSelectedQuntity] = useState(0);
  const [selectedDelivery, setSelectedDelivery] = useState("Select");
  const [selectedRemark, setSelectedRemark] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("Select");
  const [selectedDiscountvalue, setSelectedDiscountvalue] = useState(0);
  const [selectedNetPrice, setSelectedNetPrice] = useState(0);
  const [selectedTransporter, setSelectedTransporter] = useState("Select");
  const [selectedSellingValue, setSelectedSellingValue] = useState(0);
  const [selectTransporterName, setSelectTransporterName] = useState("");
  const [errors, setErrors] = useState({});
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [submitDisabled,setSubmitDisabled] = useState(false);
  const [custAlert, setCustAlert] = useState(null);
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
        setSelectedBillingPrice(
          () => Number(selectedBitumenPrice) + Number(selectedTransportation)
        );
      }
    }, 300);
    return () => {
      clearTimeout(handler); // cleanup to avoid multiple calls
    };
  }, [selectedTransportation, selectedBitumenPrice, selectedBillingPrice]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedBillingPrice !== "" || selectedBillingPrice !== 0) {
        setSelectedGST(
          parseFloat((selectedBillingPrice / 100) * 18).toFixed(2)
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
            Number(selectedBillingPrice) + Number(selectedGST)
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
      clearTimeout(handler); // cleanup to avoid multiple calls
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
      clearTimeout(handler); // cleanup to avoid multiple calls
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
    setSelectedTransportation('');
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
    toast.dismiss("form-error");
    event.preventDefault();
    setSubmitDisabled(true)
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    let emptyFields = [];
    const newErrors = {};
  
    for (let key in formJson) {
      const value = formJson[key];
  
      // General check for empty or "Select"
      if (key === "Remark") continue;

      if (value === "" || value === "Select") {
        newErrors[key] = `${key} is required`;
        emptyFields.push(key);
        continue;
      }
  
      // Check for negative numbers in specific fields
      if (["Transportation", "Bitumen Price", "Discount", "Quntity"].includes(key)) {
        if (parseFloat(value) < 0) {
          newErrors[key] = `${key} value must not be negative`;
        }
      }
      if(["Bitumen Price","Quntity","Bitumen Price"].includes(key)){
        if (parseFloat(value) == 0) {
          newErrors[key] = `${key} not be zero`;
        }
      }
      if(['Transporter name'].includes(key)){
        if(formJson?.['Transporter'] ==="Seller"){
          if(key === ""){
            newErrors[key] = `${key} name not be zero`;
          }
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (!toast.isActive("form-error")) {
        // alert("Please fill required fields.")
        showError("Please fill required fields.")
        //  Invalid_alert("Please fill required fields.");
      }
         setSubmitDisabled(false)
         return 
    }
  else if(emptyFields.length === 0){
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
    };
  
    try {
      const res = await authAxios.post("BituRep/Api/Account/send_Sodata", data);
  
      if (res.data.message === "Email sent successfully") {
        // Success_alert("Email sent successfully")
        showSuccess("Email sent successfully")
        resetForm()
        setSubmitDisabled(false)
        return 
      } else {
        //  Invalid_alert(res.data.message);
        showError(res.data.message)
         setSubmitDisabled(false)
         return
      }
    } catch (err) {
      console.error(err);
      Invalid_alert("An error occurred while submitting the form.");
    }
  }
    
  }
  
  function Success_alert(data) {
    toast.success(data, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  }
  function Invalid_alert(data) {
    toast.warn(data, {
      toastId: "form-error",
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    });
  }
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
              {/* </Localizatio/</Paper>nProvider> */}
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
                label="Bitumen Price"
                name="Bitumen Price"
                margin="normal"
                type="number"
                size="small"
                value={selectedBitumenPrice}
                onChange={(e) => {
                  setSelectedBitumenPrice(e.target.value);
                }}
                error={!!errors?.["Bitumen Price"]}
                helperText={errors?.["Bitumen Price"]}
              />
              <TextField
                fullWidth
                label="Transportation"
                name="Transportation"
                margin="normal"
                type="number"
                size="small"
                value={selectedTransportation}
                onChange={(e) => {
                  let value = e.target.value;
                  // debugger;
                  setSelectedTransportation(value);
                  if(value == 0){
                    setSelectedTransporter("Buyer")
                  //  setErrors(`Transportation is required`);
                  }else if(value > 0){
                    setSelectedTransporter("Seller")
                    // setErrors(`Transportation cost not be negative`);
                  }else {
                    // setErrors(``);
                  }

                }}
                error={!!errors?.["Transportation"]}
                helperText={errors?.["Transportation"]}
              />

              <TextField
                fullWidth
                label="Billing Price"
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
                label="Selling Price"
                name="Selling Price"
                margin="normal"
                type="number"
                size="small"
                value={selectedSellingPrice}
              />
              <TextField
                fullWidth
                label="Discount"
                name="Discount"
                type="number"
                margin="normal"
                size="small"
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
              <PaymentDropDown
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
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
                
                onChange={(e) =>{ 
                  if(selectedTransporter === "Seller"){
                  setSelectTransporterName(e.target.value)
                }else if(selectedTransporter === "Buyer"){
                  setSelectTransporterName("")
                }
                  }
                  
                }
              />
              <TextField
                fullWidth
                label="Selling value"
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
                label="Net Price"
                name="Net Price"
                type="number"
                margin="normal"
                size="small"
                value={selectedNetPrice}
              />
            </Box>
          </Stack>
          <Stack
            spacing={2}
            direction={{ xs: "column", md: "row" }}
            sx={{ p: 2, justifyContent: "start" }}
          >
            <TextField
              fullWidth
              size="small"
              margin="normal"
              id="Remark"
              name="Remark"
              label="Remark"
              multiline
              rows={2}
              value={selectedRemark}
              error={!!errors?.["Remark"]}
              helperText={errors?.["Remark"]}
              onChange={(e) => setSelectedRemark(e.target.value)}
            />
          </Stack>
          <Box mr={2} align="right">
            <Button
              variant="contained"
              color="success"
              size="small"
              // className=""
              type="submit"
              // onClick={formSubmithandler}
              disabled={submitDisabled}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>

      {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      ></ToastContainer>
    </React.Fragment>
  );
}
