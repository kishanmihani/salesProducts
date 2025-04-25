import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl,FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function BillingDropDownTwo({ billing, setBilling,errorsBilling,setErrorsBilling,variant,NotIsList }) {
  const [optionlist, setOptionlist] = useState([]);
  const [open, setOpen] = useState(false);
  const [addlabelPopup, setAddlabelPopup] = useState("");
  const [addPortlink, setAddPortlink] = useState("");
  const [addtolist, setAddtolist] = useState("");
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    let value=event.target.value
    if(value == "Select"){
      setErrorsBilling(true)
    }else if(value !== "Select"){
     setErrorsBilling(false)
    }
     setBilling(value);
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
      if(addtolist ==="Select"){
        setBilling(() => addtolist)
        setAddtolist("")
      }else{
      setOptionlist((prev) => [...prev, { companylist: addtolist }]);
      setBilling(() => addtolist);
      setAddtolist("")
      }
    }
  }, [addtolist, setBilling]);
  return (
    <React.Fragment>
      <FormControl variant={variant} fullWidth size="small" margin="normal"error={errorsBilling}>
        <InputLabel id="demo-simple-select-label">Billing</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={billing}
          name="Billing name"
          label="Billing"
          defaultValue="Select"
          onChange={handleChange}
        >
          <MenuItem disabled value={"Select"}>
            Please Select
          </MenuItem>
          {alhabetelysort(optionlist, "companylist").map((data) => (
            <MenuItem value={data.companylist}>{data.companylist}</MenuItem>
          ))}
          { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
        </Select>
         
        {errorsBilling && <FormHelperText>Billing name is required</FormHelperText>}
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
BillingDropDownTwo.propType = {
  setBilling: PropTypes.func,
  billing: PropTypes.string,
  errorsBilling: PropTypes.bool.isRequired,
  setErrorsBilling: PropTypes.func.isRequired,
  variant:PropTypes.string,
};
BillingDropDownTwo.defaultProps = {
  billing: "Select",
  setBilling: () => {},
  errorsBilling:false,
  setErrorsBilling:() => {} ,
  variant:"outlined"
};
