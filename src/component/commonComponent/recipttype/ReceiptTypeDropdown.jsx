import React from 'react';
import { TextField, MenuItem, FormHelperText, Select, InputLabel, FormControl } from '@mui/material';
import { authAxios } from '../../utils/authAxios';



export default function ReceiptTypeDropdown({ value, onChange, error, helperText }) {
  const [optionlistCheck, setOptionlistCheck] = React.useState(false);
  const [optionlist, setOptionlist] = React.useState([]);
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
   React.useEffect(() => {
            if (optionlist?.length == 0 && !optionlistCheck)
              authAxios
                .post(
                  "BituRep/Api/Account/Status_Recipt_List",
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
  return (
      <FormControl fullWidth variant="standard" margin='dense' error={error}>
      <InputLabel>Payment Type</InputLabel>
      <Select value={value} onChange={onChange}>
      <MenuItem value="" disabled>Select</MenuItem>
      {optionlist.map((option) => (
        <MenuItem key={option.status_id} value={option.status_Name}>
          {option.status_Name}
        </MenuItem>
      ))}
      
  </Select>
  {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
  );
}
