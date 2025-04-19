import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function DeliveryDropDown({
  selectedDelivery,
  setSelectedDelivery,
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
    setSelectedDelivery(event.target.value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Delivery_List",
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
    if (selectedDelivery === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Delivery List");

      setAddPortlink("BituRep/Api/Account/Delivery_List_Update");
    }
  }, [selectedDelivery]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setSelectedDelivery(() => addtolist)
      }else{
      setOptionlist((prev) => [...prev, { delivery_list: addtolist }]);
      setSelectedDelivery(() => addtolist);
      }
    }
    
  }, [addtolist, setSelectedDelivery]);
  return (
    <React.Fragment>
      <FormControl fullWidth size="small" margin="normal" error={!!errors?.['Delivery name']}>
        <InputLabel id="demo-simple-select-label">Delivery</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedDelivery}
          name="Delivery name"
          label="Delivery"
          defaultValue="Select"
          onChange={handleChange}
        >
          <MenuItem disabled value={"Select"}>
            Please select
          </MenuItem>
          {alhabetelysort(optionlist, "delivery_list").map((data) => (
            <MenuItem value={data.delivery_list}>{data.delivery_list}</MenuItem>
          ))}
          <MenuItem value={"Not in List"}>Not in List</MenuItem>
        </Select>
        {errors?.['Delivery name'] && (
    <p style={{ color: '#d32f2f',marginLeft:"14px", fontSize: '12px', marginTop: '4px' }}>
      {errors['Delivery name']}
    </p>
  )}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        label={addlabelPopup}
        paramName="Delivery_List_Update"
        setAddtolist={setAddtolist}
        apilink={addPortlink}
        dropname="Delivery name"
      />
    </React.Fragment>
  );
}
DeliveryDropDown.propType = {
  selectedDelivery: PropTypes.func,
  setSelectedDelivery: PropTypes.string,
};
DeliveryDropDown.defaultProps = {
  selectedDelivery: "Select",
  setSelectedDelivery: () => {},
};
