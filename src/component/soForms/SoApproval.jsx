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
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { setObject } from '../features/sodetails';
import { a11yProps, CustomTabPanel } from '../commonComponent/CustomTabPanel/CustomTabPanel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
export default function SoApproval() {
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
    // 'Validety Date',
    'Port Name',
    'Add Vehicle',
    'Actions',
  ]);

  const [sodata, setSodata] = useState([]);
  const [userId] = useState(JSON.parse(localStorage.getItem('userInfo'))?.id);

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
              <TableHead>
                <TableRow>
                  {soTble_head.map((header) => (
                    <TableCell
                      className="table-th"
                      component="th"
                      scope="row"
                      key={header}
                      align="left"
                      sx={{ fontSize: 14, fontWeight: 600 }}
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
    'BE No',
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
  const [userId] = useState(JSON.parse(localStorage.getItem('userInfo'))?.id);
  const [open, setOpen] = useState(false);
  const [innerData, setInnerData] = useState([]);

  function AddVehicle(row) {
    dispatch(setObject(row));
    navigate(`/dashboard/Logistic/logistic_Request_form`);
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
const [tabs, setTabs] = React.useState(0);
    const handleTabs = (event, newValue) => {
    setTabs(newValue);
  };
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{data?.c_Name}</TableCell>
        <TableCell>{formatDateToUS(data?.sO_Date)}</TableCell>
        <TableCell>{data?.sO_N0}</TableCell>
        <TableCell>{data?.so_Qty}</TableCell>
        <TableCell>{data?.a_Out_Qty}</TableCell>
        <TableCell>{data?.p_Out_Qty}</TableCell>
        <TableCell>{data?.bal_Qty}</TableCell>
        <TableCell>{data?.r_PMT}</TableCell>
        <TableCell>{data?.p_Count}</TableCell>
        <TableCell>{data?.a_Count}</TableCell>
        <TableCell>{data?.r_GST_PMT}</TableCell>
        <TableCell>{formatDateToUS(data?.v_Date)}</TableCell>
        {/* <TableCell>{formatDateToUS(data?.validity_date)}</TableCell> */}
        <TableCell>{data?.port}</TableCell>
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
              <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
                        <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example">
                         
                          <Tab label="Vehicle list" {...a11yProps(0)} />
                        <Tab label="Approval list" {...a11yProps(1)} />
                        </Tabs>
                      </Box>
                      <CustomTabPanel value={tabs} index={0}>
              <TableContainer
                elevation={0}
                component={Paper}
                style={{ overflow: 'auto', minWidth: 800 }}
              >
                <Table size="small" aria-label="vehicle-details">
                  <TableHead>
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
              </CustomTabPanel>
              <CustomTabPanel value={tabs} index={1}>
                <TableContainer
                elevation={0}
                component={Paper}
                style={{ overflow: 'auto', minWidth: 800 }}
              >
                <Table size="small" aria-label="vehicle-details">
                  <TableHead>
                    <TableRow style={{ whiteSpace: 'nowrap' }}>
                      {approvallist.map((head, index) => (
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
                                 <TableCell>
               <Button startIcon={<CheckCircleOutlineIcon />} color="success" variant='contained'>
                Approved
               </Button>
              </TableCell>
               <TableCell>
                <Button startIcon={<CancelIcon />} color="error" variant='contained'>
                Disapproved
               </Button>
              </TableCell> 
                        <TableCell>{row?.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              </CustomTabPanel>
            </List>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
