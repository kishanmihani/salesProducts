import React,{useEffect, useState} from 'react'
import CustomPageHeader from '../../component/commonComponent/CustomPageHeader/CustomPageHeader'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField } from '@mui/material';
import { closerFormApi, closerFormListApi, SoApprovalapi } from '../../component/Config/Api/Api'; 
import api from '../../component/Config/Api';
import { Api } from '@mui/icons-material';
import formatDateToUS from '../../component/utils/DateFormate';
import { toast, ToastContainer } from "react-toastify";
import { parse, isWithinInterval } from "date-fns";
import DateFilter from '../../component/commonComponent/DateFilter/DateFilter';
export default function CloserForm() {
   const [closerDataCheck,setCloserDataCheck] = useState(true);
     const [fromDate, setFromDate] = useState("");
     const [orderDirection, setOrderDirection] = useState("desc");
       const [orderBy, setOrderBy] = useState("sO_Date");
    //  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
     const [toDate, setToDate] = useState("");
     const [loading, setLoading] = useState(false);
    const [soTble_head] = useState([
        'Cha Name',
        'So Date',
        'So No',
        'So Qty',
        'Actual Out Qty',
        'Product Out Qty',
        'bal Qty',
        //'R PMT',
        //'P Count',
        //'A Count',
        //'R GST PMT',
        'Validety Date',
        //'Port Name',
        //"Product Name",
        //'Closer Type',
        //'Closer Qty',
        "Update"
      ]);
      const soTableColumns = [
  { label: "Cha Name", key: "c_Name" },
  { label: "So Date", key: "sO_Date" },
  { label: "So No", key: "sO_N0" },
  { label: "So Qty", key: "so_Qty" },
  { label: "Actual Out Qty", key: "a_Out_Qty" },
  { label: "Product Out Qty", key: "p_Out_Qty" },
  { label: "bal Qty", key: "bal_Qty" },
  { label: "Validity Date", key: "v_Date" },
  { label: "Update", key: "" } // no sort key
];

      const [sodata, setSodata] = useState([]);
      const [statusListCheck,setStatusListCheck] = React.useState(true);
        const [userId] = useState(JSON.parse(sessionStorage.getItem('userInfo'))?.id);
      const [statuslist,setStatuslist] = React.useState([]);
        const [filteredData, setFilteredData] = useState([]);
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
            api
              .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
              .then((res) =>{ setSodata(res.data);setCloserDataCheck(false)})
              .catch((err) =>{ console.log(err?.message);setCloserDataCheck(false)});
          }
        }, [sodata, userId,closerDataCheck]);
        function fetchData(){
            Api
              .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
              .then((res) =>{ setSodata(res.data);setCloserDataCheck(false)})
              .catch((err) =>{ console.log(err?.message);setCloserDataCheck(false)});
          }
        
         useEffect(()=>{
    if(statusListCheck == true ){
    api.post(closerFormListApi,JSON.stringify({
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
  api.post(closerFormApi, payload)
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
 const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both From and To dates");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const filtered = sodata.filter((item) => {
        const itemDate = parse(item.sO_Date, "MM/dd/yyyy hh:mm:ss a", new Date());
        const start = parse(fromDate, "yyyy-MM-dd", new Date());
        const end = parse(toDate, "yyyy-MM-dd", new Date());

        return isWithinInterval(itemDate, { start, end });
      });

      setFilteredData(filtered);
      setLoading(false);
    }, 600);
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
    setFilteredData(sodata);
  };
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (orderBy.toLowerCase().includes("date")) {
      return orderDirection === "asc"
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    // numeric sort
    if (!isNaN(valA) && !isNaN(valB)) {
      return orderDirection === "asc" ? valA - valB : valB - valA;
    }

    // string sort
    return orderDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
  return (
    <div>
        <CustomPageHeader pageHeaderText='Closer Form'></CustomPageHeader>
        <div style={{ width: '96%', margin: 'auto', marginBlock: '5px' }}>
           <DateFilter
                  fromDate={fromDate}
                  toDate={toDate}
                  setFromDate={setFromDate}
                  setToDate={setToDate}
                  loading={loading}
                  onFilter={handleFilter}
                  onClear={clearFilter}
                />
        <Paper elevation={0}>
        <TableContainer>
            <Table>
                <TableHead sx={{fontWeight:500,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
                    <TableRow>
  {soTableColumns.map((col) => (
    <TableCell key={col.key || col.label}>
      {col.key ? (
        <TableSortLabel
          active={orderBy === col.key}
          direction={orderBy === col.key ? orderDirection : "asc"}
          onClick={() => handleSortRequest(col.key)}
        >
          {col.label}
          {orderBy === col.key && (
            <Box component="span" >
              {orderDirection === "desc" ? "sorted descending" : "sorted ascending"}
            </Box>
          )}
        </TableSortLabel>
      ) : (
        col.label
      )}
    </TableCell>
  ))}
</TableRow>

                </TableHead>
                <TableBody>
       {sortedData.length > 0 ? (
  sortedData.map((row, index) => (
    <TableRow key={index}>
      <TableCell>{row?.c_Name}</TableCell>
      <TableCell>{formatDateToUS(row?.sO_Date)}</TableCell>
      <TableCell>{row?.sO_N0}</TableCell>
      <TableCell>{row?.so_Qty}</TableCell>
      <TableCell>{row?.a_Out_Qty}</TableCell>
      <TableCell>{row?.p_Out_Qty}</TableCell>
      <TableCell>{row?.bal_Qty}</TableCell>
      <TableCell>{formatDateToUS(row?.v_Date)}</TableCell>

      <TableCell>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleUpdateClick(row)}
        >
          Update
        </Button>
      </TableCell>
    </TableRow>
  ))
) : (
  <TableRow>
    <TableCell colSpan={9} align="center">
      {loading ? <CircularProgress /> : "No records found"}
    </TableCell>
  </TableRow>
)}


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
        <ToastContainer />
    </div>
  )
}
