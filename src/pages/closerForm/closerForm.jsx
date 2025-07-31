import React,{useEffect, useState} from 'react'
import CustomPageHeader from '../../component/commonComponent/CustomPageHeader/CustomPageHeader'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { authAxios } from '../../component/utils/authAxios';
import { SoApprovalapi } from '../../component/Config/Api';

export default function CloserForm() {
   const [closerDataCheck,setCloserDataCheck] = useState(true);
    const [soTble_head] = useState([
        'Cha Name',
        'So Date',
        'So No',
        'So Qty',
        'Actual Out Qty',
        'Product Out Qty',
        'bal Qty',
        'R PMT',
        'P Count',
        'A Count',
        'R GST PMT',
        'Validety Date',
        'Port Name',
        "Product Name",
        'Closer Type',
        'Closer Qty',
        "Update"
      ]);
      const [sodata, setSodata] = useState([]);
      const [statusListCheck,setStatusListCheck] = React.useState(true);
        const [userId] = useState(JSON.parse(sessionStorage.getItem('userInfo'))?.id);
      const [statuslist,setStatuslist] = React.useState([]);
      const [dialogOpen, setDialogOpen] = useState(false);
// const [selectedRow, setSelectedRow] = useState(null);
const [formData, setFormData] = useState({
  so_no: '',
  c_qty: '',
  status: '',
  errorQty: '',
  errorStatus: '',
});
const handleUpdateClick = (row) => {
  // setSelectedRow(row);
  setFormData({
    so_no: row.sO_N0,
    c_qty: row.c_QTY || '',
    status: row.c_Type || '',
    errorQty: '',
    errorStatus: '',
  });
  setDialogOpen(true);
};
        useEffect(() => {
          if (closerDataCheck == true) {
            authAxios
              .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
              .then((res) =>{ setSodata(res.data);setCloserDataCheck(false)})
              .catch((err) =>{ console.log(err?.message);setCloserDataCheck(false)});
          }
        }, [sodata, userId,closerDataCheck]);
        function fetchData(){
            authAxios
              .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
              .then((res) =>{ setSodata(res.data);setCloserDataCheck(false)})
              .catch((err) =>{ console.log(err?.message);setCloserDataCheck(false)});
          }
        
         useEffect(()=>{
    if(statusListCheck == true ){
    authAxios.post("/BituRep/Api/Account/Status_Closer_List",JSON.stringify({
      "User_Id":userId
    }))
    .then(res=> {setStatuslist(res.data);setStatusListCheck(false)})
    .catch(err=>{ console.log(err.message);setStatusListCheck(false)})
  } 
  
  },[userId, statuslist, statusListCheck])
//         const StatusOpen = (item) => {
//     setStatusDialog({ isOpen: true, itemToStatus: item.row,value:item.value });
//   };
const handleSubmit = () => {
  let isValid = true;
  let errors = { errorQty: '', errorStatus: '' };

  if (!formData.c_qty || Number(formData.c_qty) <= 0) {
    errors.errorQty = 'Enter valid quantity';
    isValid = false;
  }

  if (!formData.status) {
    errors.errorStatus = 'Please select a status';
    isValid = false;
  }

  setFormData((prev) => ({ ...prev, ...errors }));

  if (!isValid) return;

  // Call API here
  const payload = {
    user_id:userId,
    So_No: formData.so_no,
    Qty: formData.c_qty,
    Closer_Type: formData.status,
  };

  console.log('Submitting:', payload);

  // Example API call
  authAxios.post('/BituRep/Api/Account/Closer_Entry_insert', payload)
    .then(res => {
      console.log("Update success:", res.data);
      setDialogOpen(false);
      fetchData();
      setCloserDataCheck(true); // Refresh table
    }).catch(err => {
      console.error("Error submitting:", err.message);
      fetchData();
    });

  setDialogOpen(false); // temporary close
};

  return (
    <div>
        <CustomPageHeader pageHeaderText='Closer Form'></CustomPageHeader>
        <div style={{ width: '96%', margin: 'auto', marginBlock: '5px' }}>
        <Paper elevation={0}>
        <TableContainer>
            <Table>
                <TableHead sx={{fontWeight:500,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
                    <TableRow>
                        {soTble_head.map(header=>(
                            <TableCell key={header}
                            className="table-th"
                      component="th"
                      
                      align="left"
                      sx={{ fontSize: 12 }}
                            >{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sodata.map((row,index)=>{
                        return(
                            <TableRow key={index}>
                               <TableCell>{row?.c_Name}</TableCell>
                               <TableCell>{row?.sO_Date}</TableCell>
                               <TableCell>{row?.sO_N0}</TableCell>
                               <TableCell>{row?.so_Qty}</TableCell>
                               <TableCell>{row?.a_Out_Qty}</TableCell>
                               <TableCell>{row?.p_Out_Qty}</TableCell>
                               <TableCell>{row?.bal_Qty}</TableCell>
                              <TableCell>{row?.r_PMT}</TableCell>
                               <TableCell>{row?.p_Count}</TableCell>
                               <TableCell>{row?.a_Count}</TableCell>
                               <TableCell>{row?.r_GST_PMT}</TableCell>
                               <TableCell>{row?.v_Date}</TableCell>
                               <TableCell>{row?.port}</TableCell>
                               <TableCell>{row?.product}</TableCell>
                               <TableCell>{row?.c_Type}</TableCell>
                             
                               <TableCell>{row?.c_QTY}</TableCell>
                               <TableCell><Button   variant="outlined" size="small" onClick={() => handleUpdateClick(row)}>
                                Update
                                </Button></TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Update Closer Info</DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <TextField
        label="SO No"
        value={formData.so_no}
        fullWidth
        variant="standard"
        disabled
      />

      <TextField
        label="Closer Qty"
        value={formData.c_qty}
        onChange={(e) => {
          const value = e.target.value;
          setFormData((prev) => ({
            ...prev,
            c_qty: value,
            errorQty: value === '' || Number(value) <= 0 ? 'Enter valid quantity' : '',
          }));
        }}
        type="number"
        variant="standard"
        fullWidth
        error={!!formData.errorQty}
        helperText={formData.errorQty}
      />

      <FormControl fullWidth variant="standard" error={!!formData.errorStatus}>
        <InputLabel>Closer Type</InputLabel>
        <Select
          value={formData.status}
          onChange={(e) => {
            const value = e.target.value;
            setFormData((prev) => ({
              ...prev,
              status: value,
              errorStatus: value === '' ? 'Please select a status' : '',
            }));
          }}
        >
          <MenuItem value="">Select</MenuItem>
          {statuslist.map((item, idx) => (
            <MenuItem key={idx} value={item.status_Name}>
              {item.status_Name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{formData.errorStatus}</FormHelperText>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)} color="error" variant="contained">
      Cancel
    </Button>
    <Button variant="contained" color="success" onClick={handleSubmit}>
      Submit
    </Button>
  </DialogActions>
</Dialog>

        </Paper>
        </div>
    </div>
  )
}
