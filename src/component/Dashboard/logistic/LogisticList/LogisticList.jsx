import { Box, Button, Select, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, FormControl, MenuItem } from '@mui/material';
import React, { useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../../../utils/authAxios';
import PrintIcon from '@mui/icons-material/Print';
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader';
import InVoicedelivery from '../../../commonComponent/PdfIntegrations/InVoicedelivery';

export default function Logisticlist() {
  
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [page, setPage] = React.useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [selectStatus,setSelectStatus]= React.useState("Select")
  // const [selectVessalName,setSelectVessalName]= React.useState("Select")
  const [statuslist,setStatuslist] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  useEffect(()=>{
    if(statuslist?.length === 0){
    authAxios.post("/BituRep/Api/Account/Status_List",JSON.stringify({
      "User_Id":userId
    }))
    .then(res=> console.log(setStatuslist(res.data)))
    .catch(err=> console.log(err.message))
  }
  
  },[userId,statuslist])
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
          "BituRep/Api/Account/logistic_data_list",
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        );
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckTableData(false);
      }
    };
  
    if (!checkTableData && tableData.length === 0) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId]);
  function VessalChange(value, id) {
    setTableData((prevState) => 
      prevState.map((tableData) => {
        if (tableData.table_id === id) {
          console.log("Updated Object:", { ...tableData, vessal: value });
          return { ...tableData, vessal: value };
        }
        return tableData;
      })
    );
  }
  function StatusChange(value,id){
    setTableData((prevState) => 
      prevState.map((tableData) => {
        if (tableData.table_id === id) {
          console.log("Updated Object:", { ...tableData, status_name: value });
          return { ...tableData, status_name: value };
        }
        return tableData;
      })
      
    );
    const data={
      "User_Id": userId,
      "Table_Id": id,
      "Status_name": value
    }
    authAxios.post("BituRep/Api/Account/Status_update",data)
    .then((res)=>{
      res.data 
    }).catch((err)=>console.log(err))
  }
  
  async function printDocument(e, row) {
    let hasError=false;
    if(row?.vessel_Name == ""){
      hasError=true;
      alert("Vessal Name is required")
    }
    const content = {
      companyName: row?.bill_Company_Name,
      addressLine1: 'Unit No. 1608, 16th Floor, Plot No. C-66, Building Name - ONE BKC, G-Block, Bandra Kurla Complex, Bandra (East),',
      addressLine2: 'Mumbai-400051, Maharashtra, India',
      email: 'Email: logistic@combustenergy.com',
      contact: 'Contact: 9136964775 / 8796856716',
      deliveryOrderTitle: 'DELIVERY ORDER',
      date: `Date: ${row?.entry_Date}`,
      recipient: 'To,',
      consignee: 'AGIES TERMINAL',
      location: row?.port_Name,
      doNoLabel: 'DO No. :',
      doNoValue:row.table_id+"/"+row?.port_Name+"/"+row?.quantity,
      chaLabel: 'CHA NAME :',
      chaValue: row?.chA_NAME,
      blLabel: 'BL Number:',
      blValue: row?.bL_No,
      beLabel: 'Inbond BE Number:',
      beValue: row?.bE_No,
      beDateLabel: 'BE Date:',
      beDateValue: row?.bE_Date,
      transporterLabel: 'Transporter Name:',
      transporterValue: row?.transporter_Name,
      customerLabel: 'Customer Name:',
      customerValue: row?.customer_Name,
      salutation: 'Dear Sir,',
      deliveryNote: 'We hereby request you to kindly give delivery as per details below:',
      refText: 'REF: - ',
      product: row.produce_Name,
      arrivalText: 'arrived as per vessel',
      vesselName: row.vessel_Name,
      tankNo: row?.tank_name,
      qtyText: 'Quantity to be issued',
      qtyValue: row?.quantity,
      authSignatureLine1: 'For',
      authSignatureLine2: row?.bill_Company_Name,
      authSignatureLine3: 'Authorized Signatory',
      noteHeader: 'Please Note: -',
      notes: [
        "1. Cargo handed over to buyer/buyer's transporter at Terminal for transportation at buyer's risk and responsibility.",
        "2. Transporters are requested to check availability of material with installation and place tankers for deliveries.",
        "3. Dispatch Details (Tanker no., L/R No. Qty. & Terminal Gate Pass) to be faxed immediately on email logistics2@blueflameenergy.co. Dispatch details if not received within an hour our liability ceases to issue Tax Invoice and Buyer shall be solely responsible for not getting GST benefit. (in case of depot sale)",
        "4. Kindly arrange for all risks transit insurance for the material from EX-above mentioned Terminal to your destination in order to safeguard your interest if any, in case the tanker is detained on its way for want of any documents by the government authorities.",
        "5. Any complaints in respect of the quality of the material supplied must be notified to us in writing before unloading of Tanker.",
        "6. Any dispute arising out of this will be referred only to Mumbai jurisdiction.",
      ],
    };
  
    // Generate the PDF
    if(!hasError){
    const blob = await pdf(<InVoicedelivery content={content} />).toBlob();
  
    // Use file-saver to download
    saveAs(blob, 'DeliveryOrder.pdf');
    }
  }
  return (
    <React.Fragment>
     <CustomPageHeader pageHeaderText="Vhicle Pull"/>
      <Paper sx={{ p: 2 }} elevation={0}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
          <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Order Id</TableCell>
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Customer Name</TableCell>
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>billing name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Port Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Estimated Quantity</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Vehicle Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>transporter Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Remark</TableCell>
            {/* <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Do No</TableCell> */}
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Product Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>tank Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Vessal Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Cha Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Be No.</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Be Date</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Bl No.</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Actual Qty</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Status</TableCell>
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Edit</TableCell>
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Bill Print</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) =>
            (
            
            <TableRow 
              key={row.table_id}
              sx={{ '&:hover': {
             backgroundColor: 'grey.200',
           },'&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row?.table_id}</TableCell>
              <TableCell align="left">{row?.customer_Name}</TableCell>
              <TableCell align="left">{row?.bill_Company_Name === ""? "No billing name":row?.bill_Company_Name}</TableCell>
              <TableCell align="left">{row?.port_Name}</TableCell>
              <TableCell align="left">{row?.quantity}</TableCell>
              <TableCell align="left">{row?.vehicle_Name}</TableCell>
              <TableCell align="left">{row?.transporter_Name === ""? "No transporter":row?.transporter_Name}</TableCell>
              <TableCell align="left">{row?.remark}</TableCell>
              
              <TableCell align="left">{row?.produce_Name === ""? "No Product":row?.produce_Name}</TableCell>
              <TableCell align="left">{row?.tank_name === ""? "No tank name":row?.tank_name}</TableCell>
              <TableCell>
                {row?.vessel_Name == ""? "No Vessel Name" : row?.vessel_Name}
              </TableCell>
              <TableCell align="left">{row?.chA_NAME === ""? "No Cha name":row?.chA_NAME}</TableCell>
              <TableCell align="left">{row?.bE_No === ""? "No Be No.":row?.bE_No}</TableCell>
              <TableCell align="left">{row?.bE_Date === ""? "No Be Date":row?.bE_Date}</TableCell>
              <TableCell align="left">{row?.bL_No === ""? "No Bl No.":row?.bL_No}</TableCell>
              <TableCell>
              {row?.a_Qty === ""? "No Actual quantity":row?.a_Qty}
              </TableCell>
              <TableCell>
               <FormControl fullWidth size='small'>
                <Select
                value={row?.status_name || "Select"}
                onChange={(e)=>StatusChange(e.target.value,row?.table_id)} >
                  <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                {statuslist.map(data=>(
                  <MenuItem key={data.status_id}  value={data.status_Name}>{data.status_Name}</MenuItem>
                ))}
                </Select>
               </FormControl>
              </TableCell>
              <TableCell>
                {/* <Chip label="active" color='success'></Chip> */}
                <IconButton
                                  aria-label="Edit"
                                  color="primary"
                                  onClick={() => navigate("/dashboard/Logistic/logistic_list_Edit_Form/"+row?.table_id)}
                                  // disabled={fields.length === 1}
                                >
                <EditSquareIcon color='primary' />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton aria-label='Print' onClick={(e)=>printDocument(e,row)} >
                  <PrintIcon color='error' />
                </IconButton>
                {/* <Button color='error' variant="outlined"></Button> */}
              </TableCell>
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
      </Paper>
    </React.Fragment>
  )
}
