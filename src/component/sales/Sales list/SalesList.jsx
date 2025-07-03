import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../../utils/authAxios';
import { salesListApi } from '../../Config/Api';
import { a11yProps } from '../../commonComponent/CustomTabPanel/CustomTabPanel';
export default function Saleslist() {
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [userName] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.login);
  const [page, setPage] = React.useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
 const [showPopup, setShowPopup] = React.useState(false);
 const [showPopupDetails,setShowPopupDetails]=React.useState(null);
  const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pagination slice
  const paginatedData = tableData.slice(
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
          Role: "Entry",
        })
      );

      const filteredData = response.data.filter(
        (row) => row.user_Name === userName
      );

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
            Role: "Entry_1",
          })
        );
      let  filterdata= response.data.filter(row => row.user_Name === userName )
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
            Role: "Entry",
          })
        );
      let  filterdata= response.data.filter(row => row.user_Name === userName )
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
            Role: "Entry_2",
          })
        );
      let  filterdata= response.data.filter(row => row.user_Name === userName )
        setTableData(filterdata);
      } catch (error) {
        console.error(error);
      } 
    
  }
  const [tabs, setTabs] = React.useState(0);
      const handleTabs = (event, newValue) => {
      setTabs(newValue);
    };
     const handleMouseEnter = (e,details) => {
    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setShowPopup(true);
    setShowPopupDetails(details)
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
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
          &nbsp; Pending Approval Form
        </Typography>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
                        <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example" sx={{width:"100%",justifyContent:"center"}}>
                         <Tab label="Pending list"sx={{width:"33%"}}  onClick={()=>Pendinglist()} {...a11yProps(0)}></Tab>
                          <Tab label="Approve list" onClick={()=>Approvelist()}  sx={{width:"33%"}}{...a11yProps(2)} />
                        <Tab label="Disapprove list" sx={{width:"33%"}} onClick={()=>DisApproveList()} {...a11yProps(3)} />
                        </Tabs>
                      </Box>
      <Paper sx={{ p: 2 }} elevation={0}>

        
      <TableContainer component={Paper}>
                      {/* <CustomTabPanel value={tabs} index={0}></CustomTabPanel> */}
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
            <TableCell  className="table-th">Billing Name</TableCell>
            <TableCell align="left" className="table-th">Customer Name</TableCell>
            <TableCell align="left"className="table-th">Transporter Name</TableCell>
            <TableCell align="left"className="table-th">Transporter</TableCell>
            <TableCell align="left"className="table-th">Port Name</TableCell>
            {/* <TableCell align="left"className="table-th">Gst</TableCell> */}
            <TableCell align="left"className="table-th">Payment Type</TableCell>
            <TableCell align="left"className="table-th">Product Name</TableCell>
            <TableCell align="left"className="table-th">Bitumens price</TableCell>
            <TableCell align="left"className="table-th">Quantity</TableCell>
            <TableCell align="left"className="table-th">Order Date</TableCell>
            <TableCell align="left"className="table-th">validity Date</TableCell>
            <TableCell align="left"className="table-th">validity Days</TableCell>
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
              <TableCell component="th" scope="row">
                {row.company_Name}
              </TableCell>
              <TableCell align="left">{row.customer_Name}</TableCell>
              <TableCell align="left">{row.transport_Name}</TableCell>
              <TableCell align="left">{row.transport_ON}</TableCell>
              <TableCell align="left">{row.port_Name}</TableCell>
              {/* <TableCell align="left">{row.Gst}</TableCell> */}
            <TableCell align="left">{row.payment_Type}</TableCell>
            <TableCell align="left">{row.product_Name}</TableCell>
            <TableCell align="left"  onMouseEnter={(e)=>handleMouseEnter(e,row)}
              onMouseLeave={handleMouseLeave}>{row?.price}</TableCell>
            <TableCell align="left">{row.quantity}</TableCell>
            <TableCell align="left">{new Date(row.entry_Date).toLocaleDateString()}</TableCell>
            <TableCell align="left">{new Date(row.validity_Date).toLocaleDateString()}</TableCell>
            <TableCell align="left">{row.validity_Days}</TableCell>
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
          <Typography variant='h5' sx={{textAlign:"center",py:1}}>Bill Info</Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%" }}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Selling Price</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {Math.ceil(
  Number(showPopupDetails.transport) +
  Number(showPopupDetails.gst) +
  (Number(showPopupDetails.price) * 100) / 118
)}</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Transportation Price</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.transport}</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Billing Price</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {(((Number(showPopupDetails.price)*100)/118).toFixed(2))}</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Gst 18%</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.gst}</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Bitumen Price</Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.price}</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Discount </Typography>
            <Typography  variant='subtitle1' sx={{width:"100%",fontSize:13}}>: {showPopupDetails?.discount }</Typography>
          </Typography>
          <Typography variant='p' sx={{display:"flex",width:"100%"}}>
            <Typography  variant='subtitle1'sx={{width:"100%",fontSize:13}}>Net Price </Typography>
            <Typography  variant='2' sx={{width:"100%",fontSize:13,}}>: {Math.ceil(
  Number(showPopupDetails.transport) +
  Number(showPopupDetails.gst) +
  (Number(showPopupDetails.price) * 100) / 118
) - Number(showPopupDetails?.discount)}</Typography>
          </Typography>
        </Box>
        </Paper>)}
      </Paper>
    </React.Fragment>
  )
}
