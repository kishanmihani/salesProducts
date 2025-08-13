import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl,FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function ChaDropDown({ cha, setCha,errorsCha,setErrorsCha,variant,NotIsList,label,disabled }) {
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
      setErrorsCha(true)
    }else if(value !== "Select"){
     setErrorsCha(false)
    }
     setCha(value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/CHA_List",
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
    if (cha === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Cha List");

      setAddPortlink("BituRep/Api/Account/CHA_List_Update");
    }
  }, [cha]);
    const fetchList = useCallback(async () => {
     try {
       const res = await authAxios.post(
         "BituRep/Api/Account/CHA_List",
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
        setCha(() => addtolist)
        setAddtolist("");
        fetchList();
      }else{
        fetchList();
      setOptionlist((prev) => [...prev, { chA_list: addtolist }]);
      setCha(() => addtolist);
      setAddtolist("")
      }
    }
  }, [addtolist, setCha,fetchList]);

  return (
    <React.Fragment>
      <FormControl variant={variant} fullWidth size="small"error={errorsCha}>
        <InputLabel id="demo-simple-select-label">{label !=="" ? label :  "Cha"}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={cha}
          sx={{textTransform:"capitalize"}}
          disabled={disabled === true ? "true" : ""}
          name="Cha name"
          label={label !=="" ? label :  "Cha"}
          defaultValue="Select"
          onChange={handleChange}
        >
          <MenuItem disabled value={"Select"}>
            Please Select
          </MenuItem>
          {alhabetelysort(optionlist, "chA_list").map((data) => (
            <MenuItem value={data.chA_list} sx={{textTransform:"capitalize"}}>{data.chA_list}</MenuItem>
          ))}
          { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
        </Select>
         
        {errorsCha && <FormHelperText>Cha name is required</FormHelperText>}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        paramName="CHA_List_Update"
        label={addlabelPopup}
        apilink={addPortlink}
        setAddtolist={setAddtolist}
        dropname="Cha name"
      />
    </React.Fragment>
  );
}
ChaDropDown.propType = {
  setCha: PropTypes.func,
  cha: PropTypes.string,
  errorsCha: PropTypes.bool.isRequired,
  setErrorsCha: PropTypes.func.isRequired,
  variant:PropTypes.string,
  label:PropTypes.string
};
ChaDropDown.defaultProps = {
  cha: "Select",
  setCha: () => {},
  errorsCha:false,
  setErrorsCha:() => {} ,
  variant:"outlined",
  label:""
};
