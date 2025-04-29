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
import {  surveyorListapi, surveyorListUpdateapi } from '../../Config/Api';
export default function SurveyorDropDown({selectedSurveyor,
    setSelectedSurveyor,
    errorsSurveyor,
    setErrorsSurveyor,
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
                        setErrorsSurveyor(true)
                      }else if(value !== "Select"){
                        setErrorsSurveyor(false)
                      }
                      setSelectedSurveyor(value);
                    };
                    useEffect(() => {
                        if (optionlist?.length == 0 && !optionlistCheck)
                          authAxios
                            .post(
                                surveyorListapi,
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
                      if (selectedSurveyor === "Not in List") {
                        setOpen(true);
                        setAddlabelPopup("Add Tank List");
                  
                        setAddPortlink(surveyorListUpdateapi);
                      }
                    }, [selectedSurveyor]);
                    useEffect(() => {
                        if (addtolist !== "") {
                          if(addtolist ==="Select"){
                            setSelectedSurveyor( addtolist);
                            setAddtolist("");
                          }else{
                          setOptionlist((prev) => [...prev, { surveyor_list: addtolist }]);
                          setSelectedSurveyor( addtolist);
                          setAddtolist("");
                          }
                        }
                      }, [addtolist, setSelectedSurveyor]);
  return (
    <React.Fragment>
        <FormControl variant={variant} fullWidth size="small" margin="normal"error={errorsSurveyor}>
                      <InputLabel id="demo-simple-select-label">Surveyor name</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="Surveyorname"
                        value={selectedSurveyor}
                        label="Surveyor name"
                        defaultValue="Select"
                        onChange={handleChange}
                        MenuProps={{ disableAutoFocusItem: true }}
                      >
                        <MenuItem disabled value={"Select"}>
                          Please select
                        </MenuItem>
                        {alhabetelysort(optionlist, "surveyor_list").map((data) => (
                          <MenuItem value={data.surveyor_list}>{data.surveyor_list}</MenuItem>
                        ))}
                       { NotIsList !== true && <MenuItem value={"Not in List"}>Not in List</MenuItem>}
                      </Select>
                     {errorsSurveyor && <FormHelperText>Surveyor name is required</FormHelperText>}
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
SurveyorDropDown.propType = {
  selectedSurveyor : PropTypes.func,
  setSelectedSurveyor: PropTypes.string,
  errorsSurveyor:PropTypes.bool,
  setErrorsSurveyor:PropTypes.func,
  variant:PropTypes.string,
  NotIsList:PropTypes.bool
};
SurveyorDropDown.defaultProps = {
  selectedSurveyor: "Select",
  setSelectedSurveyor: () => {},
  errorsSurveyor:false,
  setErrorsSurveyor: () => {},
  variant:"outlined",
  NotIsList:false
};