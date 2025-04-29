import React, { useEffect } from 'react'
import PropTypes from "prop-types";
import { authAxios } from "../../utils/authAxios";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function TankDropDownTwo({selectedTank,
  setSelectedTank,
  errorsTank,
  setErrorsTank,
  variant,
  NotIsList}) {
    const [optionlist, setOptionlist] = React.useState([]);
      const [optionlistCheck, setOptionlistCheck] = React.useState(false);
      const [open, setOpen] = React.useState(false);
      const [addtolist, setAddtolist] = React.useState("");
      const [addlabelPopup, setAddlabelPopup] = React.useState("Add Port list");
      const [addPortlink, setAddPortlink] = React.useState("");
      const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
      const handleChange = (event) => {
        setSelectedTank(event.target.value);
        let value=event.target.value;
        if(value == "Select"){
          setErrorsTank(true)
        }else if(value !== "Select"){
          setErrorsTank(false)
        }
        setSelectedTank(value);
      };
      useEffect(() => {
          if (optionlist?.length == 0 && !optionlistCheck)
            authAxios
              .post(
                "BituRep/Api/Account/Tank_List",
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
        if (selectedTank === "Not in List") {
          setOpen(true);
          setAddlabelPopup("Add Tank List");
    
          setAddPortlink("BituRep/Api/Account/Tank_List_Update");
        }
      }, [selectedTank]);
      useEffect(() => {
          if (addtolist !== "") {
            if(addtolist ==="Select"){
              setSelectedTank( addtolist);
              setAddtolist("");
            }else{
            setOptionlist((prev) => [...prev, { tank_list: addtolist }]);
            setSelectedTank( addtolist);
            setAddtolist("");
            }
          }
        }, [addtolist, setSelectedTank]);
  return (
    <React.Fragment>
      <FormControl variant={variant} fullWidth size="small" margin="normal"error={errorsTank}>
              <InputLabel id="demo-simple-select-label">Tank name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="Tank name"
                value={selectedTank}
                label="Tank name"
                defaultValue="Select"
                onChange={handleChange}
                MenuProps={{ disableAutoFocusItem: true }}
              >
                <MenuItem disabled value={"Select"}>
                  Please select
                </MenuItem>
                {alhabetelysort(optionlist, "tank_list").map((data) => (
                  <MenuItem value={data.tank_list}>{data.tank_list}</MenuItem>
                ))}
               { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
              </Select>
             {errorsTank && <FormHelperText>Tank name is required</FormHelperText>}
            </FormControl>
     <AddlistDialogBox
             open={open}
             setOpen={setOpen}
             label={addlabelPopup}
             apilink={addPortlink}
             paramName="Tank_List_Update"
             setAddtolist={setAddtolist}
             userId={userId}
             dropname="Tank name"
           />
    </React.Fragment>
  )
}
TankDropDownTwo.propType = {
  selectedTank: PropTypes.func,
  setSelectedTank: PropTypes.string,
  errorsTank:PropTypes.bool,
  setErrorsProduct:PropTypes.func,
  variant:PropTypes.string,
  NotIsList:PropTypes.bool
};
TankDropDownTwo.defaultProps = {
  selectedTank: "Select",
  setSelectedTank: () => {},
  errorsTank:false,
  setErrorsTank: () => {},
  variant:"outlined",
  NotIsList:false
};