import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Stack,
  IconButton,
  FormHelperText,
  TextField,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerDropDownTwo from "../../../commonComponent/CustomerDropDown/CustomerDropDowntwo";
import PortDropDownTwo from "../../../commonComponent/PortDropdown/ProtDropDowntwo";
import { authAxios } from "../../../utils/authAxios";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";
import CustomPageHeader from "../../../commonComponent/CustomPageHeader/CustomPageHeader";
import { VessalFormData, Vessel_Detail_list, vhicleInsert } from "../../../Config/Api/Api";
import ProductDropDownTwo from "../../../commonComponent/ProductDropDown/ProductDropDownTwo";
import { useSelector } from "react-redux";

export default function LogicRequestForm() {
  const navigate = useNavigate();
  const sodata = useSelector((state) => state?.object?.data);
  const [vessalName, setVessalNmae] = React.useState("Select");
  const [vessalNameError, setVessalNameError] = React.useState(false);
  const [vessalData, setVessalData] = React.useState([]);
  const [loader, setloader] = React.useState(false);
  const [vessalInfo, setVessalInfo] = React.useState({
    be_No: "Select",
    be_NoError: false,
    wH_NAME: "Select",
    tank: "Select",
    tankError: false,
    bl_No: "8",
    bl_NoError: false,
  });
  const [selectedTank, setSelectedTank] = useState("Select");
  const [errorsTank, setErrorsTank] = useState(false);
  const [selectedWhereHouse, setSelectedWhereHouse] = useState("Select");
  const [errorsWhereHouse, setErrorsWhereHouse] = useState(false);
  const [vessalList, setVessalList] = React.useState([]);
  const [customerName, setCustomerName] = React.useState("Select");
  const [portName, setPortName] = React.useState("Select");
  const [productError, setProductError] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Select");
  const [fields, setFields] = React.useState([
    { vehicleName: "", vehicleNameError: "", quantity: "", quantityError: "", transporter: "", transporterError: "" },
  ]);
  const [errorsCustomerName, setErrorsCustomerName] = React.useState(false);
  const [errorsPortName, setErrorsPortName] = React.useState(false);
  const [remark, setRemark] = React.useState("");
  const [custAlert, setCustAlert] = React.useState(null);
  const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  const showSuccess = (data) => setCustAlert({ type: "success", message: data });
  const showError = (data) => setCustAlert({ type: "error", message: data });

  const handleAddFields = () => {
    setFields([...fields, { vehicleName: "", quantity: "", transporter: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    setloader(true);
    e.preventDefault();
    let hasError = false;

    if (customerName === "Select") {
      setErrorsCustomerName(true);
      hasError = true;
    }
    if (portName === "Select") {
      setErrorsPortName(true);
      hasError = true;
    }
    if (vessalName === "Select") {
      setVessalNameError(true);
      hasError = true;
    }
    if (vessalName !== "Select") {
      if (vessalInfo.be_No === "Select") {
        setVessalInfo((prev) => ({ ...prev, be_NoError: true }));
        hasError = true;
      }
      if (vessalInfo.tank === "Select") {
        setVessalInfo((prev) => ({ ...prev, tankError: true }));
        hasError = true;
      }
    }
    if (selectedProduct === "Select") {
      setProductError(true);
      hasError = true;
    }

    const updatedFields = fields.map((field) => {
      const updatedField = { ...field };
      if (field.vehicleName.trim() === "") {
        updatedField.vehicleNameError = "Vehicle Name is required";
        hasError = true;
      } else updatedField.vehicleNameError = "";

      if (field.quantity === "" || Number(field.quantity) <= 0) {
        updatedField.quantityError = "Quantity must be greater than 0";
        hasError = true;
      } else updatedField.quantityError = "";

      if (field.transporter === "") {
        updatedField.transporterError = "Transporter name is required";
        hasError = true;
      } else if (!/^[A-Za-z\s]+$/.test(field.transporter)) {
        updatedField.transporterError = "Only letters and spaces allowed";
        hasError = true;
      } else updatedField.transporterError = "";

      return updatedField;
    });

    setFields(updatedFields);

    if (!hasError) {
      let count = 0;
      for (let arr of fields) {
        count++;
        const data = {
          user_id: userId,
          Customer_Name: customerName,
          vehicle_Name: arr.vehicleName,
          Transporter_Name: arr.transporter,
          Port_Name: portName,
          Quantity: arr.quantity,
          Remark: remark,
          Vessel_Name: vessalName.replaceAll("|", ",").split(",")?.[0],
          Vessel_No: vessalName.replaceAll("|", ",").split(",")?.[1],
          Tank_name: vessalInfo.tank,
          Produce_Name: selectedProduct,
          Teminal_NAME: vessalInfo?.tank.replaceAll("|", ",").split(",")?.[0],
          BE_No: vessalInfo.be_No,
          So_No: sodata?.sO_N0,
          BL_No: vessalInfo.be_No.replaceAll("|", ",").split(",")?.[0],
          Do_No:
            
            arr.vehicleName +
            "/" +
            portName,
        };

        await authAxios
          .post(vhicleInsert, JSON.stringify(data))
          .then((res) => {
            if (res.data.massage === "Entry Done") showSuccess("Records Submitted");
            else showError(res.data.message);
            if (count === fields.length) {
              handleReset();
              navigate("/dashboard/Logistic/Logistic_Pending_form");
            }
          })
          .catch((err) => {
            if (err.massage === "Network Error") showError("Network Error");
            else showError(err.message);
          });
      }
    }
    setloader(false);
  };

  const handleReset = () => {
    setCustomerName("Select");
    setPortName("Select");
    setRemark("");
    setFields([{ vehicleName: "", vehicleNameError: "", quantity: "", quantityError: "", transporter: "", transporterError: "" }]);
    setErrorsCustomerName(false);
    setErrorsPortName(false);
    setVessalNmae("");
    setVessalInfo({
      be_No: "Select",
      be_NoError: false,
      wH_NAME: "Select",
      tank: "Select",
      tankError: false,
      bl_No: "Select",
      bl_NoError: false,
    });
    setErrorsWhereHouse(false);
    setSelectedProduct("Select");
    setProductError(false);
  };

  const handleClose = () => setCustAlert(null);

  React.useEffect(() => {
    if (vessalList.length === 0) {
      authAxios
        .post("/BituRep/Api/Account/VesselName_List", JSON.stringify({ User_Id: userId }))
        .then((res) => setVessalList(res.data))
        .catch((err) => showError(err.message));
    }
  }, [vessalList, userId]);

  async function VessalChange(value) {
    if (value === "Select") setVessalNameError(true);
    else setVessalNameError(false);

    setVessalNmae(value);
    const data = {
      user_id: userId,
      Vessal_Name: value.replaceAll("|", ",").split(",")?.[0],
      Vessal_No: value.replaceAll("|", ",").split(",")?.[1],
    };
    await authAxios
      .post(VessalFormData, data)
      .then((res) => {
        setVessalData(res.data);
        setVessalInfo({
          be_No: "Select",
          be_NoError: false,
          wH_NAME: "Select",
          tank: "Select",
          tankError: false,
          bl_No: "Select",
          bl_NoError: false,
        });
      })
      .catch((err) => showError(err.message));
  }

  React.useEffect(() => {
    try {
      setPortName(sodata?.port);
      setSelectedProduct(sodata?.product);
      setCustomerName(sodata?.c_Name);
    } catch (err) {
      showError("Failed to parse sodata");
    }
  }, [sodata]);

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="Vehicle Form" />
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 2 }} elevation={0}>
          <Stack spacing={2} direction={{ xs: "column", md: "row" }} sx={{ p: 2, pb: 0 }}>
            <CustomerDropDownTwo
              errorsCustomerName={errorsCustomerName}
              setErrorsCustomerName={setErrorsCustomerName}
              selectedCustomer={customerName}
              disabled
              setSelectedCustomer={setCustomerName}
            />
            <PortDropDownTwo
              errorsPortName={errorsPortName}
              setErrorsPortName={setErrorsPortName}
              selectedPort={portName}
              disabled
              setSelectedPort={setPortName}
            />
            <ProductDropDownTwo
              variant="outlined"
              errorsProduct={productError}
              setErrorsProduct={setProductError}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              disabled
            />
          </Stack>

          <Stack spacing={2} direction={{ xs: "row" }} sx={{ p: 2, gap: 2, pb: 0 }}>
            <TextField
              fullWidth
              size="small"
              id="bal_Qty"
              variant="standard"
              label="Bal Qty"
              disabled
              value={sodata?.bal_Qty}
            />
            <FormControl variant="standard" fullWidth size="small" error={vessalNameError}>
              <InputLabel>Voyage name</InputLabel>
              <Select value={vessalName} onChange={(e) => VessalChange(e.target.value)}>
                <MenuItem disabled value="Select">Please Select</MenuItem>
                {vessalList?.map((data) => (
                  <MenuItem key={data.vesselName_List} value={data.vesselName_List}>
                    {data.vesselName_List}
                  </MenuItem>
                ))}
              </Select>
              {vessalNameError && <FormHelperText>Voyage is required</FormHelperText>}
            </FormControl>

            {vessalData.length !== 0 && (
              <FormControl variant="standard" fullWidth size="small" error={vessalInfo.be_NoError}>
                <InputLabel>IN -BOE</InputLabel>
                <Select
                  label="IN -BOE"
                  value={vessalInfo.be_No}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVessalInfo((prev) => ({
                      ...prev,
                      be_No: value,
                      be_NoError: value === "Select",
                    }));
                  }}
                >
                  <MenuItem disabled value="Select">Please Select</MenuItem>
                  {vessalData[0]?.v_BE?.map((item, index) => (
                    <MenuItem key={`${item.bl}${index}`} value={item?.bl}>
                      {item?.bl}
                    </MenuItem>
                  ))}
                </Select>
                {vessalInfo.be_NoError && <FormHelperText>BOE No is required</FormHelperText>}
              </FormControl>
            )}
          </Stack>

          <Stack spacing={2} direction={{ xs: "row" }} sx={{ p: 2, pb: 0 }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              label="Remark"
              multiline
              rows={1}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            {vessalData.length !== 0 && (
              <FormControl variant="standard" fullWidth size="small" error={vessalInfo.tankError}>
                <InputLabel>Tank | Warehouse name</InputLabel>
                <Select
                  disabled={!vessalInfo.be_No}
                  label="tank Name"
                  value={vessalInfo.tank}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVessalInfo((prev) => ({
                      ...prev,
                      tank: value,
                      tankError: value === "Select",
                    }));
                  }}
                >
                  <MenuItem disabled value="Select">Please Select</MenuItem>
                  {vessalData[0]?.v_BE
                    .filter((item) => item.bl === vessalInfo.be_No)
                    .flatMap((item) =>
                      (item.wH_Name_Tank_Name || []).map((tank, index) => (
                        <MenuItem key={`${tank.wH_Name_Tank_Name}-${index}`} value={tank.wH_Name_Tank_Name}>
                          {tank.wH_Name_Tank_Name}
                        </MenuItem>
                      ))
                    )}
                </Select>
                {vessalInfo.tankError && <FormHelperText>Tank is required</FormHelperText>}
              </FormControl>
            )}
          </Stack>

          <Box sx={{ p: 2 }}>
            <Button variant="outlined" color="success" onClick={handleAddFields}>
              <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
              Add another value
            </Button>
          </Box>

          {fields.map((field, index) => (
            <Stack key={index} spacing={2} direction={{ xs: "row" }} sx={{ p: 2, pb: 0 }}>
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Vehicle Name"
                value={field.vehicleName}
                error={!!field.vehicleNameError}
                helperText={field.vehicleNameError}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].vehicleName = e.target.value;
                  newFields[index].vehicleNameError = e.target.value.trim() ? "" : "Vehicle Name is required";
                  setFields(newFields);
                }}
              />
              <TextField
                fullWidth
                size="small"
                type="number"
                variant="standard"
                label="Provisional Quantity"
                value={field.quantity}
                error={!!field.quantityError}
                helperText={field.quantityError}
                onChange={(e) => {
                  const newFields = [...fields];
                  const value = e.target.value;
                  newFields[index].quantity = value;
                  const totalQty = newFields.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                  if (!value || Number(value) <= 0)
                    newFields[index].quantityError = "Quantity must be greater than 0";
                  else if (totalQty > sodata?.bal_Qty)
                    newFields[index].quantityError = `Total quantity cannot exceed ${sodata?.bal_Qty}`;
                  else newFields[index].quantityError = "";
                  setFields(newFields);
                }}
              />
              <TextField
                fullWidth
                size="small"
                variant="standard"
                label="Transporter Name"
                value={field.transporter}
                error={!!field.transporterError}
                helperText={field.transporterError}
                onChange={(e) => {
                  const newFields = [...fields];
                  const value = e.target.value;
                  if (!value.trim()) newFields[index].transporterError = "Transporter Name is required";
                  else if (!/^[A-Za-z\s]+$/.test(value))
                    newFields[index].transporterError = "Only letters and spaces allowed";
                  else newFields[index].transporterError = "";
                  newFields[index].transporter = value;
                  setFields(newFields);
                }}
              />
              <IconButton color="error" onClick={() => handleRemoveField(index)} disabled={fields.length === 1}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Stack spacing={2} direction="row" sx={{ p: 2, justifyContent: "end" }}>
            <Button onClick={handleReset} variant="contained" color="error">Cancel</Button>
            <Button variant="contained" color="success" type="submit" disabled={loader}>
              {loader ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Stack>
        </Paper>
      </form>

      {custAlert && <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />}
    </React.Fragment>
  );
}
