import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const EditForm = ({ tableData, checkTableData, tableId, userId }) => {
  const [vessalData, setVessalData] = useState([]);
  const [vessalInfo, setVessalInfo] = useState({
    be_No: "",
    bl_No: "",
    soNo: "",
    actualQuantity: "",
    location: "",
  });
  const [errors, setErrors] = useState({
    soNo: false,
    actualQuantity: false,  
  });

  // Simulated fetch for vessalData
  useEffect(() => {
    // Replace with your API call
    const fetchVessalData = async () => {
      const data = await Promise.resolve([
        {
          v_BE: [{ id: 1, name: "BE123" }],
          v_BL: [{ id: 1, name: "BL456" }],
        },
      ]);
      setVessalData(data);
    };
    fetchVessalData();
  }, []);

  // Update vessalInfo when tableData or tableId changes
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const info = tableData.find((item) => item.id === tableId);
      if (info) {
        setVessalInfo({
          be_No: info.be_No || "",
          bl_No: info.bl_No || "",
          soNo: info.soNo || "",
          actualQuantity: info.actualQuantity || "",
          location: info.location || "",
        });
      }
    }
  }, [tableData, tableId]);

  // Handle input changes
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setVessalInfo((prev) => ({ ...prev, [field]: value }));

    // Optional: simple validation
    if (field === "soNo") {
      setErrors((prev) => ({ ...prev, soNo: value === "" }));
    }
    if (field === "actualQuantity") {
      setErrors((prev) => ({
        ...prev,
        actualQuantity: value === "" || isNaN(Number(value)),
      }));
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="be-label">BE No</InputLabel>
          <Select
            labelId="be-label"
            value={vessalInfo.be_No}
            onChange={handleChange("be_No")}
          >
            {vessalData[0]?.v_BE?.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel id="bl-label">BL No</InputLabel>
          <Select
            labelId="bl-label"
            value={vessalInfo.bl_No}
            onChange={handleChange("bl_No")}
          >
            {vessalData[0]?.v_BL?.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="SO No"
          fullWidth
          value={vessalInfo.soNo}
          onChange={handleChange("soNo")}
          error={errors.soNo}
          helperText={errors.soNo ? "SO No is required" : ""}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Actual Quantity"
          fullWidth
          value={vessalInfo.actualQuantity}
          onChange={handleChange("actualQuantity")}
          error={errors.actualQuantity}
          helperText={errors.actualQuantity ? "Enter a valid number" : ""}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Location"
          fullWidth
          value={vessalInfo.location}
          onChange={handleChange("location")}
        />
      </Grid>
    </Grid>
  );
};

export default EditForm;
