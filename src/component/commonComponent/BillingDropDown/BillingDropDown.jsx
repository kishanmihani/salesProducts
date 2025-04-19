import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function BillingDropDown({ billing, setBilling,errors }) {
  const [optionlist, setOptionlist] = useState([]);
  const [open, setOpen] = useState(false);
  const [addlabelPopup, setAddlabelPopup] = useState("");
  const [addPortlink, setAddPortlink] = useState("");
  const [addtolist, setAddtolist] = useState("");
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    setBilling(event.target.value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Company_List",
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
    if (billing === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Billing List");

      setAddPortlink("BituRep/Api/Account/Company_List_Update");
    }
  }, [billing]);
  useEffect(() => {
    if (addtolist !== "") {
      setOptionlist((prev) => [...prev, { companylist: addtolist }]);
      setBilling(() => addtolist);
    }
  }, [addtolist, setBilling]);
  return (
    <React.Fragment>
      <FormControl fullWidth size="small" error={!!errors?.['Billing name']}>
        <InputLabel id="demo-simple-select-label">Billing</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={billing}
          name="Billing name"
          label="Billing"
          defaultValue="Select"
          onChange={handleChange}
          error={!!errors?.['Billing name']}
        >
          <MenuItem disabled value={"Select"}>
            Please Select
          </MenuItem>
          {alhabetelysort(optionlist, "companylist").map((data) => (
            <MenuItem value={data.companylist}>{data.companylist}</MenuItem>
          ))}
          <MenuItem value={"Not in List"}>Not in List</MenuItem>
        </Select>
        {errors?.['Billing name'] && (
    <p style={{ color: '#d32f2f',marginLeft:"14px", fontSize: '12px', marginTop: '4px' }}>
      {errors['Billing name']}
    </p>
  )}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        paramName="Company_List_Update"
        label={addlabelPopup}
        apilink={addPortlink}
        setAddtolist={setAddtolist}
        dropname="Billing name"
      />
    </React.Fragment>
  );
}
BillingDropDown.propType = {
  setBilling: PropTypes.func,
  billing: PropTypes.string,
};
BillingDropDown.defaultProps = {
  billing: "Select",
  setBilling: () => {},
};
