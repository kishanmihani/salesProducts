import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
} from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function PaymentDropDown({
  selectedPayment,
  setSelectedPayment,
  errors
}) {
  const [optionlist, setOptionlist] = useState([]);
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [addtolist, setAddtolist] = useState("");
  const [addlabelPopup, setAddlabelPopup] = useState("Add Port list");
  const [addPortlink, setAddPortlink] = useState("");
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    setSelectedPayment(event.target.value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Payment_List",
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
    if (selectedPayment === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Payment List");

      setAddPortlink("BituRep/Api/Account/Payment_List_Update");
    }
  }, [selectedPayment]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setSelectedPayment(() => addtolist);
        setAddtolist("");
      }else{
      setOptionlist((prev) => [...prev, { payment_list: addtolist }]);
      setSelectedPayment(() => addtolist);
      setAddtolist("")
      }
    }
  }, [addtolist, setSelectedPayment]);
  return (
    <React.Fragment>
      <FormControl fullWidth size="small" margin="normal" error={!!errors?.['Payment name']}>
        <InputLabel id="demo-simple-select-label">Payment</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedPayment}
          label="Payment"
          name="Payment name"
          defaultValue="Select"
          onChange={handleChange}
          MenuProps={{ disableAutoFocusItem: true }}
          
        >
          <MenuItem disabled value={"Select"}>
            Please select
          </MenuItem>
          {alhabetelysort(optionlist, "payment_list").map((data) => (
            <MenuItem value={data.payment_list}>{data.payment_list}</MenuItem>
          ))}
          <MenuItem value={"Not in List"}>Not in List</MenuItem>
        </Select>
        {errors?.['Payment name'] && (
    <p style={{ color: '#d32f2f',marginLeft:"14px", fontSize: '12px', marginTop: '4px' }}>
      {errors['Payment name']}
    </p>
  )}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        label={addlabelPopup}
        apilink={addPortlink}
        paramName="Payment_List_Update"
        userId={userId}
        setAddtolist={setAddtolist}
        dropname="Payment name"
      />
    </React.Fragment>
  );
}
PaymentDropDown.propType = {
  setSelectedPayment: PropTypes.func,
  selectedPayment: PropTypes.string,
};
PaymentDropDown.defaultProps = {
  selectedPayment: "Select",
  setSelectedPayment: () => {},
};
