import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl,FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function VessalNameDropDown({ vessalName, setVessalName,errorsVessalName,setErrorsVessalName,variant,NotIsList,label,disabled }) {
  const [optionlist, setOptionlist] = useState([]);
  const [open, setOpen] = useState(false);
  const [addlabelPopup, setAddlabelPopup] = useState("");
  const [addPortlink, setAddPortlink] = useState("");
  const [addtolist, setAddtolist] = useState("");
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    let value=event.target.value
    if(value == "Select"){
      setErrorsVessalName(true)
    }else if(value !== "Select"){
     setErrorsVessalName(false)
    }
     setVessalName(value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Vessel_list",
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
    if (vessalName === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Cha List");

      setAddPortlink("BituRep/Api/Account/Vessel_List_Update");
    }
  }, [vessalName]);
    const fetchList = useCallback(async () => {
     try {
       const res = await authAxios.post(
         "BituRep/Api/Account/Vessel_list",
         JSON.stringify({ user_id: userId })
       );
       setOptionlist(res.data);
       // setOptionlistCheck(true);
     } catch (err) {
       console.error(err);
       // setOptionlistCheck(true);
     }
   }, [userId]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setVessalName(() => addtolist)
        setAddtolist("");
        fetchList();
      }else{
        fetchList();
      setOptionlist((prev) => [...prev, { vessel_list: addtolist }]);
      setVessalName(() => addtolist);
      setAddtolist("")
      }
    }
  }, [addtolist, setVessalName,fetchList]);

  return (
    <React.Fragment>
      <FormControl variant={variant} fullWidth size="small"error={errorsVessalName}>
        <InputLabel id="demo-simple-select-label">{label !=="" ? label :  "Vessal Name"}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={vessalName}
          sx={{textTransform:"capitalize"}}
          disabled={disabled === true ? "true" : ""}
          name="Vessal Name"
          label={label !=="" ? label :  "Vessal Name"}
          defaultValue="Select"
          onChange={handleChange}
        >
          <MenuItem disabled value={"Select"}>
            Please Select
          </MenuItem>
          {alhabetelysort(optionlist, "vessel_list").map((data) => (
            <MenuItem value={data.vessel_list} sx={{textTransform:"capitalize"}}>{data.vessel_list}</MenuItem>
          ))}
          { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
        </Select>
         
        {errorsVessalName && <FormHelperText>Vessal name is required</FormHelperText>}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        paramName="Vessel_List_Update"
        label={addlabelPopup}
        apilink={addPortlink}
        setAddtolist={setAddtolist}
        dropname="Vessal name"
      />
    </React.Fragment>
  );
}
VessalNameDropDown.propType = {
  setVessalName: PropTypes.func,
  vessalName: PropTypes.string,
  errorsVessalName: PropTypes.bool.isRequired,
  setErrorsVessalName: PropTypes.func.isRequired,
  variant:PropTypes.string,
  label:PropTypes.string
};
VessalNameDropDown.defaultProps = {
  vessalName: "Select",
  setVessalName: () => {},
  errorsVessalName:false,
  setErrorsVessalName:() => {} ,
  variant:"outlined",
  label:""
};
