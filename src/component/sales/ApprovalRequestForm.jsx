/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tabs, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../utils/authAxios';
import PropTypes from 'prop-types';
import CustomeAlerts from '../commonComponent/CustomeAlert/CustomeAlert';
import { a11yProps, CustomTabPanel } from '../commonComponent/CustomTabPanel/CustomTabPanel';
import formatDateToUS from '../utils/DateFormate';
const headers = [
    { key: "customer_Name", label: "Customer Name" },
    { key: "port_Name", label: "Port Name" },
    { key: "vehicle_Name", label: "Vehicle Name" },
    { key: "quantity", label: "Quantity" },
    { key: "remark", label: "Remark" },
    { key: "table_id", label: "Table ID" },
    { key: "transporter_Name", label: "Transporter Name" },
    { key: "produce_Name", label: "Product Name" },
    { key: "vessel_Name", label: "Vessel Name" },
    { key: "vessel_No", label: "Vessel No" },
    { key: "tank_name", label: "Tank Name" },
    { key: "terminal_NAME", label: "Terminal Name" },
    { key: "bE_No", label: "BOE No" },
    { key: "bL_No", label: "BL No" },
    { key: "do_No", label: "DO No" },
    { key: "status_name", label: "Status" },
    { key: "active_id", label: "Active ID" },
    { key: "a_Qty", label: "Approved Qty" },
    { key: "entry_Date", label: "Entry Date" },
    { key: "so_No", label: "SO No" },
  ];
export default function ApprovalRequestForm() {
    const navigate = useNavigate();
    const [tableData,setTableData]=React.useState([])
    const [checkTableData,setCheckTableData]=React.useState(true)
    const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
    const [userName] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.login);
    const [page, setPage] = React.useState(0); // current page
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [custAlert, setCustAlert] = React.useState(null);
    const [popupPosition, setPopupPosition] = React.useState({ top: 0, left: 0 });
    const [showPopupDetails,setShowPopupDetails]=React.useState(null);
     const [prodPopup,setProdPopup] = React.useState(false);
     const [showPopup, setShowPopup] = React.useState(false);
    const showSuccess = (data) => {
        setCustAlert({ type: "success", message: data });
      };
      
      const handleClose = () => {
        setCustAlert(null)
       };
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    const paginatedData = [...tableData].sort((a, b) => new Date(b?.entry_Date) - new Date(a?.entry_Date))?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  
    useEffect(() => {
      
    
      if (checkTableData == true ) {
        fetchTableData();
      }
    }, [checkTableData, tableData, userId]);
    const fetchLogisticData =  async () =>{
      try {
          const response = await authAxios.post(
            "/BituRep/Api/Account/logistic_data_Approvel_list",
            JSON.stringify({
              user_id: userId,
            })
          );
         
          setTableData(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setCheckTableData(false);
        }
    }
    const fetchTableData = async () => {
        try {
          const response = await authAxios.post(
            "BituRep/Api/Account/send_sodata_userwise",
            JSON.stringify({
              user_id: userId,
              Role: "Approver",
            })
          );
        let  filterdata= response.data.filter(row => row.user_Name === userName )
          setTableData(filterdata);
        } catch (error) {
          console.error(error);
        } finally {
          setCheckTableData(false);
        }
      };
   async function ApproveAction(table_Id){
    await authAxios.post('BituRep/Api/Account/send_sodata_Approved',JSON.stringify({
        "user_id": userId,
        "table_Id": table_Id
      }))
      .then((res)=>{if(res.data.massage1 =="Entry Done"){showSuccess("Bill Approve");fetchTableData();} })
      .catch(err=>{console.log(err.data)} )
    }
    async function DispproveAction(table_Id){
        await authAxios.post('BituRep/Api/Account/send_sodata_Disapprve',JSON.stringify({
            "user_id": userId,
            "table_Id": table_Id
          }))
          .then((res)=>{if(res.data.massage =="Entry Done"){showSuccess("Bill Dispprove");fetchTableData();};})
      .catch(err=>{ console.log(err.data)} )
        }
        const [tabs, setTabs] = React.useState(0);
              const handleTabs = (event, newValue) => {
              setTabs(newValue);
            };
            const handleApprove = async (row) => {
  const payload = {
    User_Id: userId, // Hardcoded or fetched from context/login
    table_id: row.table_id,
    status_name: row.status_name,
  };

  try {
    const response = await authAxios.post("BituRep/Api/Account/Status_update_Approver", payload);
      // console.log("API Success:", response.data);
      if(response !==""){
      fetchLogisticData()
      }
      // alert("Approved successfully!");
    } catch (error) {
      console.error("API Error:", error.message);
      // alert("Approval failed!");
    }
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
            &nbsp;Approval Request Form
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
                        <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example" sx={{width:"100%",justifyContent:"center"}}>
                         <Tab label="So Approval"sx={{width:"33%"}}  onClick={()=>fetchTableData()} {...a11yProps(0)}></Tab>
                          <Tab label="Logistic Approval" onClick={()=>fetchLogisticData()}  sx={{width:"33%"}}{...a11yProps(2)} />
                        {/* <Tab label="Disapprove list" sx={{width:"33%"}} onClick={()=>DisApproveList()} {...a11yProps(3)} /> */}
                        </Tabs>
                      </Box>
        <Paper sx={{ p: 2 }} elevation={0}>
          <CustomTabPanel value={tabs} index={0}  >
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
            <TableRow>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Order Date</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>validity</TableCell>
              <TableCell  sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Billing</TableCell>
              <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Customer</TableCell>
              
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Quantity</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Product</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Price</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Port Name</TableCell>
              {/* <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Transporter Name</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Transporter</TableCell> */}
              
              {/* <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Gst</TableCell> */}
              {/* <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Payment Type</TableCell>
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Product</TableCell> */}
              
              <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Approve</TableCell>
                <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Disapprove</TableCell>
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
                onMouseLeave={handleProdMouseLeave}><Typography variant='body1' color="primary">{row.product_Name}</Typography></TableCell>
                <TableCell align="left" onMouseEnter={(e)=>handleMouseEnter(e,row)}
              onMouseLeave={handleMouseLeave}><Typography variant='body1' color="primary">{row?.price}</Typography>
                </TableCell>
                <TableCell align="left">{row.port_Name}</TableCell>
                {/* <TableCell align="left">{row.transport_Name}</TableCell>
                <TableCell align="left">{row.transport_ON}</TableCell>
                
              <TableCell align="left">{row.payment_Type}</TableCell> */}
              
              
              
              
              
               <TableCell align="left"><Button variant="outlined" onClick={()=>ApproveAction(row.table_Id)} sx={{p:1,fontSize:"12px"}} color="success">Approve</Button></TableCell>
             <TableCell align="left"><Button variant="outlined"sx={{p:1, fontSize:"12px"}} onClick={()=>DispproveAction(row.table_Id)} color="secondary">Disapprove</Button></TableCell>
              </TableRow>
              
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </CustomTabPanel>
      <CustomTabPanel value={tabs} index={1}>
          <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
            <TableRow>
              {headers.map((col) => (
              <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} key={col.key}>{col.label}</TableCell>
            ))}
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Approve</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((col) => (
                <TableCell key={col.key}>{col.key === "entry_Date"
            ? formatDateToUS(row[col.key])
            : row[col.key] || ""}</TableCell>
              ))}
              <TableCell>
              <Button variant='outlined' color='success' onClick={() => handleApprove(row)}>Approve</Button>
              </TableCell>
            </TableRow>
          ))}
            </TableBody>
            </Table>
            </TableContainer>
      </CustomTabPanel>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
        {custAlert && (
                <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />
              )}
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
      </React.Fragment>
    )
  }
