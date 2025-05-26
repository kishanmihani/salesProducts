import React, { useId, useState } from 'react'
import CustomPageHeader from '../commonComponent/CustomPageHeader/CustomPageHeader'
import { DataGrid } from '@mui/x-data-grid';
import { WidthFull } from '@mui/icons-material';
import { SoApprovalapi, soVhicledetails } from '../Config/Api';
import { authAxios } from '../utils/authAxios';
import formatDateToUS from '../utils/DateFormate';
import { Button, Collapse, Dialog, DialogContent, DialogTitle, List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { setObject } from '../features/sodetails';

export default function SoApproval() {
  const [soId] =useId();
 const [soTble_head]=useState(["Cha Name","So Date","So No","So Qty","Actual Out Qty",
"Product Out Qty","bal Qty","R PMT","P Count","A Count","R GST PMT","V Date",
"Validety Date","Port Name","Add Vehicle",'Actions'
  ]);
    
    //   {
    //   field: 'actions',
    //   headerName: 'Actions',
    //   sortable: false,
    //   renderCell: ({ row }) => (
    //     <Button onClick={() => handleOpen(row)} variant='outlined'>Open</Button>
    //   ),
    // },
    // ];
    // const soTble_head=[]
    const innercolumns = [
  { field: 'vehicle_Name', headerName: 'Vehicle Name', width: 150 },
  { field: 'p_Qty', headerName: 'Planned Qty', width: 120 },
  { field: 'a_Qty', headerName: 'Actual Qty', width: 120 },
  { field: 'bE_No', headerName: 'BE No', width: 120 },
  { field: 'transporter_Name', headerName: 'Transporter Name', width: 180 },
  { field: 'tank_name', headerName: 'Tank Name', width: 150 },
  { field: 'warehouse_name', headerName: 'Warehouse Name', width: 180 },
  { field: 'port_Name', headerName: 'Port Name', width: 150 },
  { field: 'vessel_Name', headerName: 'Vessel Name', width: 150 },
  { field: 'vessel_No', headerName: 'Vessel No', width: 150 },
  { field: 'status_name', headerName: 'Status', width: 120 },
  { field: 'remark', headerName: 'Remark', width: 200 }
];
    const  [sodata,setSodata] = useState([])
    const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
    const [open, setOpen] = useState(false);
    // const 
    const [innerdata, setInnerData] = useState();
    React.useEffect(()=>{
        if(sodata ==""){
        authAxios.post(SoApprovalapi,JSON.stringify({
            "user_id": userId
        }))
        .then((res)=>setSodata(res.data))
        .catch((err)=>console.log(err?.message))
    }
    },[SoApprovalapi,userId])
    
    

  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <React.Fragment>
        <CustomPageHeader pageHeaderText="So Approval Form"  />
        <div style={{ width: "96%",margin:"auto",marginBlock:"5px"}} >
         <Paper elevation={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {soTble_head?.map(header=>(
                  <TableCell component="th" scope="row" key={header} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >
                    {header}
                  </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {sodata?.map(data=>( */}
                    <SodataRow   data={sodata}/>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
         </Paper>
        
           </div>
    </React.Fragment>
  )
}

function SodataRow({ data }) {
   
  const [vehicle_head]=useState(["Vehicle Name","Planned Qty","Actual Qty","BE No","Transporter Name",'Tank Name',
    'Warehouse Name','Port Name','Vessel Name','Vessel No',
    'Status','Remark'
  ]);
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
    const [open, setOpen] = useState(false);
    const [innerData, setInnerData] = useState();
  function AddVehicle(row){
      dispatch(setObject(row));
       navigate(`/dashboard/Logistic`)
    }
    const handleOpen = async (row) => {
      setOpen(!open);
    await  authAxios.post(soVhicledetails,
        {
         "user_id": userId,
         "So_No": row?.sO_N0
        } )
        .then(res => setInnerData(res.data))
        .catch(err => console.log(err))
    // setSelectedRow(row);
    
  };
  return (
    <React.Fragment>
      {data?.map((row, index) => (
        <React.Fragment>
        <TableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          <TableCell>
            <Button
              variant="outlined"
              sx={{
                p: 1,
                fontSize: "12px",
                borderRadius: 6,
                textTransform: "capitalize",
              }}
              color="success"
              onClick={()=>{AddVehicle(row) }}
            >
              <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
              Add Vehicle data
            </Button>
     </TableCell>
     <TableCell>
      <Button onClick={() => handleOpen(row)} color={!open ? "primary" : "error"} variant='outlined'>{!open ? "Open" : "Close"}</Button>
     </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <TableContainer elevation={0} component={Paper} style={{overflow:"auto",minWidth:800}}>
                            <Table size="small"  aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  {vehicle_head?.map((head,index)=>( 
                                  <TableCell component="th" scope="row" key={index} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {innerData?.map((data,index)=>(
                                 <TableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>{data?.vehicle_Name}</TableCell>
          <TableCell>{data?.p_Qty}</TableCell>
          <TableCell>{data?.a_Qty}</TableCell>
          <TableCell>{data?.bE_No}</TableCell>
          <TableCell>{data?.transporter_Name}</TableCell>
          <TableCell>{data?.tank_name}</TableCell>
          <TableCell>{data?.warehouse_name}</TableCell>
          <TableCell>{data?.port_Name}</TableCell>
          <TableCell>{data?.vessel_Name}</TableCell>
          <TableCell>{data?.vessel_No}</TableCell>
          <TableCell>{data?.status_name}</TableCell>
          <TableCell>{data?.remark}</TableCell>
          </TableRow> 
                                ))}
                              </TableBody>
                              </Table></TableContainer>
            </List>
            </Collapse>
          </TableCell>
        </TableRow>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
