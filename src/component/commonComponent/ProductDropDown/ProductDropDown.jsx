import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { authAxios } from "../../utils/authAxios";
import AddlistDialogBox from "../AddlistDialogBox/AddlistDialogBox";
import { alhabetelysort } from "../../utils/Sorted";
export default function ProductDropDown({
  selectedProduct,
  setSelectedProduct,
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
    setSelectedProduct(event.target.value);
  };
  useEffect(() => {
    if (optionlist?.length == 0 && !optionlistCheck)
      authAxios
        .post(
          "BituRep/Api/Account/Product_List",
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
    if (selectedProduct === "Not in List") {
      setOpen(true);
      setAddlabelPopup("Add Product List");

      setAddPortlink("BituRep/Api/Account/Product_List_Update");
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (addtolist !== "") {
      if(addtolist ==="Select"){
        setSelectedProduct(() => addtolist);
        setAddtolist("");
      }else{
      setOptionlist((prev) => [...prev, { product_list: addtolist }]);
      setSelectedProduct(() => addtolist);
      setAddtolist("");
      }
    }
  }, [addtolist, setSelectedProduct]);
  return (
    <React.Fragment>
      <FormControl fullWidth size="small" margin="normal"helperText={errors?.['Product name']} error={!!errors?.['Product name']}>
        <InputLabel id="demo-simple-select-label">Product name</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          name="Product name"
          value={selectedProduct}
          label="Product name"
          defaultValue="Select"
          onChange={handleChange}
          MenuProps={{ disableAutoFocusItem: true }}
        >
          <MenuItem disabled value={"Select"}>
            Please select
          </MenuItem>
          {alhabetelysort(optionlist, "product_list").map((data) => (
            <MenuItem value={data.product_list}>{data.product_list}</MenuItem>
          ))}
          <MenuItem value={"Not in List"}>Not in List</MenuItem>
        </Select>
        {errors?.['Product name'] && (
    <p style={{ color: '#d32f2f', marginLeft:"14px",fontSize: '12px', marginTop: '4px' }}>
      {errors['Product name']}
    </p>
  )}
      </FormControl>
      <AddlistDialogBox
        open={open}
        setOpen={setOpen}
        label={addlabelPopup}
        apilink={addPortlink}
        paramName="Product_List_Update"
        setAddtolist={setAddtolist}
        userId={userId}
        dropname="Product name"
      />
    </React.Fragment>
  );
}
ProductDropDown.propType = {
  selectedProduct: PropTypes.func,
  setSelectedProduct: PropTypes.string,
};
ProductDropDown.defaultProps = {
  selectedProduct: "Select",
  setSelectedProduct: () => {},
};
