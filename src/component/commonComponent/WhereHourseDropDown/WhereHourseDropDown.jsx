import React ,{ useEffect } from 'react'
// import React, { useEffect } from 'react'
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
import { wareHouseListapi, wareHouseListUpdateapi } from '../../Config/Api';
export default function WhereHourseDropDown(
    {selectedWhereHouse,
    setSelectedWhereHouse,
    errorsWhereHouse,
    setErrorsWhereHouse,
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
                                            let value=event.target.value;
                                            if(value == "Select"){
                                                setErrorsWhereHouse(true)
                                            }else if(value !== "Select"){
                                                setErrorsWhereHouse(false)
                                            }
                                            setSelectedWhereHouse(value);
                                          };
                                          useEffect(() => {
                                              if (optionlist?.length == 0 && !optionlistCheck)
                                                authAxios
                                                  .post(
                                                    wareHouseListapi,
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
                                            if (selectedWhereHouse === "Not in List") {
                                              setOpen(true);
                                              setAddlabelPopup("Add Tank List");
                                        
                                              setAddPortlink(wareHouseListUpdateapi);
                                            }
                                          }, [selectedWhereHouse]);
                                          useEffect(() => {
                                              if (addtolist !== "") {
                                                if(addtolist ==="Select"){
                                                  setSelectedWhereHouse( addtolist);
                                                  setAddtolist("");
                                                }else{
                                                setOptionlist((prev) => [...prev, { warehouse_list: addtolist }]);
                                                setSelectedWhereHouse( addtolist);
                                                setAddtolist("");
                                                }
                                              }
                                            }, [addtolist, setSelectedWhereHouse]);
  return (
    <React.Fragment>
        <FormControl variant={variant} fullWidth size="small" margin="normal"error={errorsWhereHouse}>
                              <InputLabel id="demo-simple-select-label">WareHouse name</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="WareHousename"
                                value={selectedWhereHouse}
                                label="WareHouse name"
                                defaultValue="Select"
                                onChange={handleChange}
                                MenuProps={{ disableAutoFocusItem: true }}
                              >
                                <MenuItem disabled value={"Select"}>
                                  Please select
                                </MenuItem>
                                {alhabetelysort(optionlist, "warehouse_list").map((data) => (
                                  <MenuItem value={data.warehouse_list}>{data.warehouse_list}</MenuItem>
                                ))}
                               { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
                              </Select>
                             {errorsWhereHouse && <FormHelperText>WareHouse name is required</FormHelperText>}
                            </FormControl>
      <AddlistDialogBox
                         open={open}
                         setOpen={setOpen}
                         label={addlabelPopup}
                         apilink={addPortlink}
                         paramName="surveyor_List_Update"
                         setAddtolist={setAddtolist}
                         userId={userId}
                         dropname="Surveyor name"
                       />
    </React.Fragment>
  )
}
WhereHourseDropDown.propType = {
    selectedWhereHouse : PropTypes.func,
  setSelectedWhereHouse: PropTypes.string,
  errorsWhereHouse:PropTypes.bool,
  setErrorsWhereHouse:PropTypes.func,
  variant:PropTypes.string,
  NotIsList:PropTypes.bool
};
WhereHourseDropDown.defaultProps = {
    selectedWhereHouse: "Select",
  setSelectedWhereHouse: () => {},
  errorsWhereHouse:false,
  setErrorsWhereHouse: () => {},
  variant:"outlined",
  NotIsList:false
};