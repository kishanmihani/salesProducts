import React, { useState, useEffect } from 'react';
import CustomPageHeader from '../commonComponent/CustomPageHeader/CustomPageHeader';
import { SoApprovalapi, soVhicledetails } from '../Config/Api';
import { authAxios } from '../utils/authAxios';
import formatDateToUS from '../utils/DateFormate';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Tooltip,
  Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { setObject } from '../features/sodetails';
import { a11yProps, CustomTabPanel } from '../commonComponent/CustomTabPanel/CustomTabPanel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { toast, ToastContainer } from 'react-toastify';
export default function SoApproval() {
  const [soTble_head] = useState([
    'Validety Date',
    'So Date',
    'So No',
    'So Qty',
    'A_Qty/count',
    'P_Qty/P Count',
    'B_Qty',
     'R PMT',
    'Port Name', 
    'Add Vehicle',
    'Actions',
  ]);

  const [sodata, setSodata] = useState([]);
  const [userId] = useState(JSON.parse(sessionStorage.getItem('userInfo'))?.id);

  useEffect(() => {
    if (sodata.length === 0) {
      authAxios
        .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
        .then((res) => setSodata(res.data))
        .catch((err) => console.log(err?.message));
    }
  }, [sodata, userId]);

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="So Approval Form" />
      <div style={{ width: '96%', margin: 'auto', marginBlock: '5px' }}>
        <Paper elevation={0}>
          <TableContainer>
            <Table>
              <TableHead sx={{fontWeight:500,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
                <TableRow>
                  {soTble_head.map((header) => (
                    <TableCell
                      className="table-th"
                      component="th"
                      // scope="row"
                      key={header}
                      align="left"
                      sx={{ fontSize: 12 }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sodata?.map((data, index) => (
                  <SodataRow key={index} data={data} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </React.Fragment>
  );
}

function SodataRow({ data }) {
  const [vehicle_head] = useState([
    'Vehicle Name',
    'Planned Qty',
    'Actual Qty',
    'BOE No',
    'Transporter Name',
    'Tank Name',
    'Warehouse Name',
    'Port Name',
    'Vessel Name',
    'Vessel No',
    'Status',
    'Remark',
  ]);
  const [approvallist]=useState([...vehicle_head,"Approved","Disapproved"])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId] = useState(JSON.parse(sessionStorage.getItem('userInfo'))?.id);
  const [open, setOpen] = useState(false);
  const [innerData, setInnerData] = useState([]);

  function AddVehicle(row) {
    debugger;
    // console.log(formatDateToUS(row.v_Date));
    // console.log(formatDateToUS(new Date()));
    const previous = new Date().setDate((new Date()).getDate() - 2);
    if(row?.bal_Qty <= 0 ){
      toast.info("balance qantity is Negative")
    }else
       if(formatDateToUS(row.v_Date) < formatDateToUS(previous) ){
        debugger;
      toast.info(
      `⚠️ Validity date is finished!\nExpired on: ${formatDateToUS(row?.v_Date)}`
    );
    }
      else{
dispatch(setObject(row));
    navigate(`/dashboard/Logistic/logistic_Request_form`);
      }
    
  }

  const handleOpen = async (row) => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) {
      try {
        const res = await authAxios.post(soVhicledetails, {
          user_id: userId,
          So_No: row?.sO_N0,
        });
        setInnerData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, }}>
        <TableCell>{formatDateToUS(data?.v_Date)}</TableCell>
        <TableCell>{formatDateToUS(data?.sO_Date)}</TableCell>
        <TableCell>{data?.sO_N0}</TableCell>
        <TableCell>{data?.so_Qty}</TableCell>
        <TableCell>{data?.a_Out_Qty}/{data?.a_Count}</TableCell>
        <TableCell>{data?.p_Out_Qty}/{data?.p_Count}</TableCell>
        <TableCell>{data?.bal_Qty}</TableCell>
        <TableCell>{data?.r_PMT}</TableCell>
        <TableCell>{data?.port}</TableCell>
        {/* <TableCell>{data?.c_Name}</TableCell> */}
        
        
        
        {/* <TableCell></TableCell> */}
        
        {/* <TableCell>{formatDateToUS(data?.validity_date)}</TableCell> */}
        
        <TableCell>
         <Button
            variant="outlined"
            sx={{
              p: 1,
              width: 150,
              fontSize: '12px',
              borderRadius: 6,
              textTransform: 'capitalize',
            }}
            disabled={data?.v_flg == "0" ? false  : true}
            color="success"
            onClick={() => AddVehicle(data)}
          >
            <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
            Add Vehicle data
          </Button>          
        </TableCell>
        <TableCell>
          <Button
            onClick={() => handleOpen(data)}
            color={!open ? 'primary' : 'error'}
            variant="outlined"
          >
            {!open ? 'Open' : 'Close'}
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <TableContainer
                elevation={0}
                component={Paper}
                style={{ overflow: 'auto', minWidth: 800 }}
              >
                <Table size="small" aria-label="vehicle-details">
                  <TableHead sx={{fontWeight:500,bgcolor:"rgba(240, 114, 223, 0.08)"}}>
                    <TableRow style={{ whiteSpace: 'nowrap' }}>
                      {vehicle_head.map((head, index) => (
                        <TableCell
                          component="th"
                          scope="row"
                          key={index}
                          align="left"
                          sx={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {innerData?.map((row, idx) => (
                      <TableRow key={idx} sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>{row?.vehicle_Name}</TableCell>
                        <TableCell>{row?.p_Qty}</TableCell>
                        <TableCell>{row?.a_Qty}</TableCell>
                        <TableCell>{row?.bE_No}</TableCell>
                        <TableCell>{row?.transporter_Name}</TableCell>
                        <TableCell>{row?.tank_name}</TableCell>
                        <TableCell>{row?.warehouse_name}</TableCell>
                        <TableCell>{row?.port_Name}</TableCell>
                        <TableCell>{row?.vessel_Name}</TableCell>
                        <TableCell>{row?.vessel_No}</TableCell>
                        <TableCell>{row?.status_name}</TableCell>
               <TableCell>{row?.remark}</TableCell>
                                 {/* <TableCell></TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </List>
          </Collapse>
        </TableCell>
      </TableRow>
      <ToastContainer />
    </React.Fragment>
  );
}
