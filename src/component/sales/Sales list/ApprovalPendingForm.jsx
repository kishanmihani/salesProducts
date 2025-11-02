import { Box, Paper, Tab,Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Tooltip, Typography, CircularProgress, IconButton } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import DownloadIcon from "@mui/icons-material/Download";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../../utils/authAxios';
import { salesListApi } from '../../Config/Api/Api';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { a11yProps } from '../../commonComponent/CustomTabPanel/CustomTabPanel';
import ExportButton from '../../commonComponent/ExportButton/ExportButton';
export default function ApprovalPendingForm() {
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [userName] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.login);
  const [page, setPage] = React.useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [exporting, setExporting] = React.useState(false);
 const [showPopup, setShowPopup] = React.useState(false);
 const [showPopupDetails,setShowPopupDetails]=React.useState(null);
 const [prodPopup,setProdPopup] = React.useState(false);
  const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pagination slice
  const paginatedData = [...tableData].sort((a, b) => new Date(b?.entry_Date) - new Date(a?.entry_Date))?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await authAxios.post(
        salesListApi,
        JSON.stringify({
          user_id: userId,
          Role: "Approver",
        })
      );

      const filteredData = response.data;

      setTableData(filteredData);
    } catch (error) {
      console.error("Failed to fetch sales list:", error);
    } finally {
      setCheckTableData(true);
    }
  };

  if (!checkTableData) {
    fetchTableData();
  }
}, [checkTableData, userId, userName]);

 async function Approvelist(){
      try {
        const response = await authAxios.post(
          salesListApi,
          JSON.stringify({
            user_id: userId,
            Role: "Approver_1",
          })
        );
      let  filterdata= response.data;
        setTableData(filterdata);
      } catch (error) {
        console.error(error);
      } 
    
  }
   async function Pendinglist(){
      try {
        const response = await authAxios.post(
          salesListApi,
          JSON.stringify({
            user_id: userId,
            Role: "Approver",
          })
        );
      let  filterdata= response.data;
        setTableData(filterdata);
      } catch (error) {
        console.error(error);
      } 
    
  }
  async function DisApproveList(){
      try {
        const response = await authAxios.post(
          salesListApi,
          JSON.stringify({
            user_id: userId,
            Role: "Approver_2",
          })
        );
      let  filterdata= response.data;
        setTableData(filterdata);
      } catch (error) {
        console.error(error);
      } 
    
  }
  const [tabs, setTabs] = React.useState(0);
      const handleTabs = (event, newValue) => {
      setTabs(newValue);
      console.log(newValue)
    };
     const handleMouseEnter = (e,details) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left - 100+ window.scrollX,
    });
    setShowPopup(true);
    setShowPopupDetails(details)
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
    setShowPopupDetails();
  };
const handleProdMouseEnter = (e,details) =>{
 const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setProdPopup(true);
    setShowPopupDetails(details)
  }
  const handleProdMouseLeave = () => {
    setProdPopup(false);
    setShowPopupDetails();
  };
  const handleExportExcel = async () => {

   if (!tableData.length) {
    alert("No data available to export!");
    return;
  }

  setExporting(true);
  try {
    let tabLabel = "";
    if (tabs === 0) tabLabel = "Pending_List";
    else if (tabs === 1) tabLabel = "Approved_List";
    else if (tabs === 2) tabLabel = "Rejected_List";

    const formattedData = tableData.map((row) => ({
      "Order Date": new Date(row.entry_Date).toLocaleDateString(),
      "Validity Days": row.validity_Days,
      "Billing": row.company_Name,
      "Customer": row.customer_Name,
      "Quantity": row.quantity,
      "Product": row.product_Name,
      "Price": row.price,
      "Port Name": row.port_Name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, tabLabel);

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${tabLabel}_${new Date().toLocaleDateString()}.xlsx`);
  } catch (error) {
    console.error("Export error:", error);
    alert("Failed to export data!");
  } finally {
    setTimeout(() => setExporting(false), 800);
  }
};

  return (
    <React.Fragment>
      <Box
        sx={{
          p: 1,
          position: "sticky",
          top: 0,
          bgcolor: "#ffff",
          borderBottom: 1,
          zIndex: 4,
          display: "flex",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            border: 1,
            borderColor: "#eee",
            width: 40,
            position: "relative",
          }}
        >
          <ArrowBackIcon width={90} color="#000" />
        </button>
        <Typography variant="h5" align="center" width="100%">
          &nbsp;  Approval Pending Form
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
                        <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example" sx={{width:"100%",justifyContent:"center"}}>
                         <Tab label="Pending list"sx={{width:"33%"}}  onClick={()=>Pendinglist()} {...a11yProps(0)}></Tab>
                          <Tab label="Approve list" onClick={()=>Approvelist()}  sx={{width:"33%"}}{...a11yProps(2)} />
                        <Tab label="Rejected List" sx={{width:"33%"}} onClick={()=>DisApproveList()} {...a11yProps(3)} />
                        </Tabs>
                      </Box>
      <Paper sx={{ p: 2 }} elevation={0}>
<ExportButton onExport={handleExportExcel} exporting={exporting} />
        
      <TableContainer component={Paper}>
                      {/* <CustomTabPanel value={tabs} index={0}></CustomTabPanel> */}
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
            <TableCell align="left"className="table-th">Order Date</TableCell>
            <TableCell align="left"className="table-th">validity</TableCell>
            <TableCell  className="table-th">Billing</TableCell>
            <TableCell align="left" className="table-th">Customer</TableCell>
            <TableCell align="left"className="table-th">Quantity</TableCell>
            <TableCell align="left"className="table-th">Product</TableCell>

            <TableCell align="left"className="table-th">Price</TableCell>
            <TableCell align="left"className="table-th">Port Name</TableCell>
            {tabs == 1 && 
          <TableCell align="left"className="table-th">Edit</TableCell>
}
            
            
            {/* <TableCell align="left"className="table-th">validity Date</TableCell> */}
            
              {/* <TableCell align="left"className="table-th">Approve</TableCell> */}
            {/* <TableCell align="left"className="table-th">Disapprove</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) =>
            (
            
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{new Date(row.entry_Date).toLocaleDateString()}</TableCell>
              <TableCell align="left"><Tooltip title={new Date(row.validity_Date).toLocaleDateString()}><Typography variant='body1' color="primary">{row.validity_Days}</Typography></Tooltip></TableCell>
              <TableCell component="th" scope="row">
                {row.company_Name}
              </TableCell>
              <TableCell align="left">{row.customer_Name}</TableCell>
              <TableCell align="left">{row.quantity}</TableCell>
              <TableCell align="left"  onMouseEnter={(e)=>handleProdMouseEnter(e,row)}
                onMouseLeave={handleProdMouseLeave}><Typography color="primary">{row.product_Name}</Typography></TableCell>
              <TableCell align="left" color="primary"  onMouseEnter={(e)=>handleMouseEnter(e,row)}
              onMouseLeave={handleMouseLeave}><Typography color="primary">{row?.price}</Typography></TableCell>
              <TableCell align="left">{row.port_Name}</TableCell>
    
              {/* <TableCell align="left">{row.Gst}</TableCell> */}
            {/* <TableCell align="left">{row.payment_Type}</TableCell> */}
           {tabs == 1 &&   <TableCell>
          <IconButton
             onClick={() => {
    navigate("/dashboard/sales/Sale_Edit_Form", {
      state: { rowData: row }, // 👈 send selected row data here
    });}}
          >
            <EditSquareIcon
              sx={{ color:  "black" }} // black icon if active, gray if disabled
            />
          </IconButton>
        </TableCell>}
            
            
            
            {/* <TableCell align="left"><Tooltip title={new Date(row.validity_Date).toLocaleDateString()}><Typography variant='body1' color="primary">View</Typography></Tooltip></TableCell> */}
            
            {/* <TableCell align="left"><button variant="outlined">Approve</button></TableCell> */}
            {/* <TableCell align="left"><button variant="outlined">Disapprove</button></TableCell> */}
            </TableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
       {showPopup && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            padding: 1,
            width:300,
            backgroundColor: "lightyellow",
            zIndex: 10,
            
          }}
        >
        <Box>
          <Typography variant="h6" textAlign="center" py={1}>
  Bill Information
</Typography>

<Typography fontSize={13}>
  Selling Price:{" "}
  {(
    Number(showPopupDetails.transport || 0) +
    Number(showPopupDetails.gst || 0) +
    (Number(showPopupDetails.price || 0) * 100) / 118
  ).toFixed(2)}
</Typography>

<Typography fontSize={13}>
  Transportation: {Number(showPopupDetails.transport || 0).toFixed(2)}
</Typography>

<Typography fontSize={13}>
  Billing Price: {((Number(showPopupDetails.price || 0) * 100) / 118).toFixed(2)}
</Typography>

<Typography fontSize={13}>
  GST 18%: {Number(showPopupDetails.gst || 0).toFixed(2)}
</Typography>

<Typography fontSize={13}>
  Bitumen Price: {Number(showPopupDetails.price || 0).toFixed(2)}
</Typography>

<Typography fontSize={13}>
  Discount: {Number(showPopupDetails.discount || 0).toFixed(2)}
</Typography>

<Typography fontSize={13} fontWeight={600}>
  Net Price:{" "}
  {(
    Number(showPopupDetails.transport || 0) +
    Number(showPopupDetails.gst || 0) +
    (Number(showPopupDetails.price || 0) * 100) / 118 -
    Number(showPopupDetails.discount || 0)
  ).toFixed(2)}
</Typography>

        </Box>
        </Paper>)}
{prodPopup && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            padding: 1,
            width:300,
            backgroundColor: "lightyellow",
            zIndex: 10,
            
          }}
        >
        <Box>
          <Typography variant='h5' sx={{textAlign:"center",py:1}}>Product Info</Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%" }}>
             <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Payment Type</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.payment_Type}</Typography>     
            </Typography> 
          <Typography variant='p' sx={{display:"flex",width:"100%" }}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Transportion</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.transport_ON}</Typography>     
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%" }}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Transportor Name</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails.transport_Name}</Typography>     
          </Typography> 
          </Box>
          </Paper>)}       
      </Paper>
    </React.Fragment>
  )
}
