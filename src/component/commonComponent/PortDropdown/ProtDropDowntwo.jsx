import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
} from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function PortDropDownTwo({ selectedPort, setSelectedPort,errorsPortName ,setErrorsPortName,variant,NotIsList}) {
  const [optionlist, setOptionlist] = useState([]);
  const [optionlistCheck, setOptionlistCheck] = useState(false);
  const [open, setOpen] = useState(false);
  const [addtolist, setAddtolist] = useState("");
  const [addlabelPopup, setAddlabelPopup] = useState("");
  const [addPortlink, setAddPortlink] = useState("");
  const [userId] = useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const handleChange = (event) => {
    let value=event.target.value;
    setSelectedPort(value);
    if(value == "Select"){
        setErrorsPortName(true)
      }else if(value !== "Select"){
        setErrorsPortName(false)
      }
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Post_List",
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
    if (selectedPort === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Port List");

      setAddPortlink("BituRep/Api/Account/Port_List_Update");
    }
  }, [selectedPort]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setSelectedPort(() => addtolist);
        setAddtolist("");
      }else{
      setOptionlist((prev) => [...prev, { port_list: addtolist }]);
      setSelectedPort(() => addtolist);;
      setAddtolist("");
      }
    }
  }, [addtolist, setSelectedPort]);
  return (
    <React.Fragment>
      <FormControl variant={variant} fullWidth size="small" margin="normal" error={errorsPortName}>
        <InputLabel id="demo-simple-select-label">Port</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedPort}
          label="Port"
          name="Port name"
          defaultValue="Select"
          onChange={handleChange}
          MenuProps={{ disableAutoFocusItem: true }}
          // helperText={errors?.['Port name']}
        >
          <MenuItem disabled value={"Select"}>
            Please select
          </MenuItem>
          {alhabetelysort(optionlist, "port_list").map((data) => (
            <MenuItem value={data.port_list}>{data.port_list}</MenuItem>
          ))}
          { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
        </Select>
        {errorsPortName && <FormHelperText>Port name is required</FormHelperText>}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        label={addlabelPopup}
        paramName="Port_List_Update"
        apilink={addPortlink}
        setAddtolist={setAddtolist}
        dropname="Port name"
      />
    </React.Fragment>
  );
}
PortDropDownTwo.propType = {
  selectedPort: PropTypes.string,
  setSelectedPort: PropTypes.func,
  errorsPortName:PropTypes.bool,
  setErrorsPortName:PropTypes.func,
  variant:PropTypes.string
};
PortDropDownTwo.defaultProps = {
  selectedPort: "Select",
  setSelectedPort: () => {},
  errorsPortName:false,
  setErrorsPortName: () => {},
  variant:"outlined"
};
