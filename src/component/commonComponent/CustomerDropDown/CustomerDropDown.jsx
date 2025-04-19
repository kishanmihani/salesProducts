import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function CustomerDropDown({
  selectedCustomer,
  setSelectedCustomer,
  errors
}) {
  const [optionlist, setOptionlist] = useState([]);
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [addtolist, setAddtolist] = useState("");
  const [addlabelPopup, setAddlabelPopup] = useState("");
  const [addPortlink, setAddPortlink] = useState("");
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    setSelectedCustomer(event.target.value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Customer_List",
          JSON.stringify({
            user_id: userId,
          })
        )
        .then((res) => {
          setOptionlist(res.data);
          setOptionlistCheck(true);
        })
        .catch((err) => {
          console.error(err);
          setOptionlistCheck(true);
        });
  }, [optionlist, userId, optionlistCheck]);
  useEffect(() => {
    if (selectedCustomer === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Customer List");

      setAddPortlink("BituRep/Api/Account/Customer_List_Update");
    }
  }, [selectedCustomer]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setSelectedCustomer(() => addtolist)
      }else{
      setOptionlist((prev) => [...prev, { customer_list: addtolist }]);
      setSelectedCustomer(() => addtolist);
      }
    }
  }, [addtolist, setSelectedCustomer]);
  return (
    <React.Fragment>
      <FormControl fullWidth size="small" margin="normal"error={!!errors?.['Customer name']}>
        <InputLabel id="demo-simple-select-label">Customer name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedCustomer}
          name="Customer name"
          label="Customer name"
          defaultValue="Select"
          onChange={handleChange}
        >
          <MenuItem disabled value={"Select"}>
            Please select
          </MenuItem>
          {alhabetelysort(optionlist, "customer_list").map((data) => (
            <MenuItem value={data.customer_list}>{data.customer_list}</MenuItem>
          ))}
          <MenuItem value={"Not in List"}>Not in List</MenuItem>
        </Select>
        {errors?.['Customer name'] && (
    <p style={{ color: '#d32f2f',marginLeft:"14px", fontSize: '12px', marginTop: '4px' }}>
      {errors['Customer name']}
    </p>
  )}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        paramName="Customer_List_Update"
        label={addlabelPopup}
        setAddtolist={setAddtolist}
        apilink={addPortlink}
        dropname="Customer name"
      />
    </React.Fragment>
  );
}
CustomerDropDown.propType = {
  selectedCustomer: PropTypes.func,
  setSelectedCustomer: PropTypes.string,
};
CustomerDropDown.defaultProps = {
  selectedCustomer: "Select",
  setSelectedCustomer: () => {},
};
