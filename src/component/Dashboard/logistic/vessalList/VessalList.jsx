
import React, { useEffect, useId, useState } from 'react'
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader'
import { Box, Button, Collapse, IconButton, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import TabCon
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { authAxios } from '../../../utils/authAxios';
import { vessailBE_Detail_List, Vessel_Detail, Vessel_Detail_list } from '../../../Config/Api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import formatDateToUS from '../../../utils/DateFormate';
import dayjs from 'dayjs';
import { a11yProps, CustomTabPanel } from '../../../commonComponent/CustomTabPanel/CustomTabPanel';
const Table_headVessal=["Vessal Details","vessal_Name","vessal No","discarge Date","chA Name",]
const TblHead_vessalDetails = ["Be Details","produce Name","port Name","BL Name","Bl No","BL Date","BL Qty","BE Name","BE No","bE Date","BE Gross Qty","BE Net Qty","Be OTR Qty"]
const TblHead_Tank = ["bE_NO","terminal_Name","tank_name","net_Quantity"]
const BeXbontTbl_head=["bE_No", "xbE_date", "xbE_NO", "xbE_Qty"]
const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;
export default function VessalList() {
   const useid = useId();
   const [vessalLoading, setVessalLoading] = useState(true);
    const [vessalError, setVessalError] =useState('');
    const [vessaldata,setVessaldata] = useState([]);
    // const [vessalOpen,setVessalOpen] = useState(false)
    //  const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    useEffect(()=>{
     authAxios.post(Vessel_Detail,JSON.stringify({
      "User_Id":userId
    }))
     .then(res=> {setVessaldata(res.data);
      setVessalLoading(false)
     })
     .catch(err=> {setVessalError(err)
      setVessalLoading(false)
     })
    },[setVessalLoading,setVessaldata,setVessalError,userId])
   
  const filteredPatients = vessaldata?.filter((patient) => {
    if (!selectedDate) return true;
  
    return dayjs(patient.discarge_Date).isSame(selectedDate, 'day');
  });
  const handleClear = () => {
    setSelectedDate(null);
  };
  return (
    <React.Fragment>

         <CustomPageHeader pageHeaderText='Vessal List' ></CustomPageHeader>
         <Stack spacing={2} sx={{p:2}}>
            <Stack spacing={2} sx={{py:2,display:"flex"}}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer  components={['DatePicker']}>
          <DatePicker
            label="Filter by discharge Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            format="MM/DD/YYYY"
            slotProps={{ textField: { size: 'small',variant: 'outlined',
      fullWidth: true, } }}
          />
        </DemoContainer>

        <Button sx={{mt:1}} onClick={handleClear} variant="outlined">
          Clear Date
        </Button>
        </LocalizationProvider>
      </Box>
            </Stack>
              {vessalLoading && <p>Loading . . .</p>}
        {vessalError && <p>error {vessalError}</p>}
          { vessaldata.length !==0 &&  <TableContainer component={Paper}>
                   <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                        {Table_headVessal.map(head=>(
                        <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{head}</TableCell>
                        ))}
                        </TableRow>
                      </TableHead>
                      <TableBody >
                     {filteredPatients.map(data=>{
                      // const {vessal_Name,vessal_No,discarge_Date,chA_Name} = data;
                      return (
                        <VessalRow key={useid.replace(/[^a-zA-Z0-9]/g, '')} row={data}  />
                     )})}
                      </TableBody>
                   </Table>
             </TableContainer>}
        </Stack>

    </React.Fragment>
  )
}

function VessalRow({row}){
  
const { vessal_Name,vessal_No,discarge_Date,chA_Name } = row;
const TblvessalDetails=[vessal_Name,vessal_No,formatDateToUS(discarge_Date),chA_Name]
  const [open, setOpen] = React.useState(false);
  const [vessalLoading, setVessalLoading] = useState(true);
    const [vessalError, setVessalError] =useState('');
    const [vessaldata,setVessaldata] = useState([]);
    const useid = useId();
 async function handleOpen(name , vsl_number,id){
  setOpen(!open)
  await authAxios.post(Vessel_Detail_list, JSON.stringify({
  "user_id": id,
  "Vessal_No": vsl_number,
  "Vessal_Name": name
}))
.then((res)=>{setVessaldata(res.data)
  setVessalLoading(false)
})
.catch((err)=>{setVessalError(err.message)
  setVessalLoading(false)
})
 }
  return <React.Fragment><TableRow key={useid.replace(/[^a-zA-Z0-9]/g, '')} sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {TblvessalDetails.map((bodytext)=><TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')}>
                            {bodytext}
                          </TableCell>)} 
                        </TableRow>
                        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              
                 {vessalLoading && <p>Loading . . .</p>}
        {vessalError && <p>error {vessalError}</p>}
          { vessaldata.length !==0 && 
              <Table size="small" sx={{overflow:"auto"}} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {TblHead_vessalDetails.map((head)=>(
                    <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vessaldata.map((data)=>{
                    const {produce_Name,port_Name,bl_Name,bl_No,bL_Date,bL_Qty,bE_Name,bE_No,bE_Date,bE_G_Qty,bE_N_Qty,bE_OTR_Qty} =data;
                    const tblbody=[produce_Name,port_Name,bl_Name,bl_No,formatDateToUS(bL_Date),bL_Qty,bE_Name,bE_No,formatDateToUS(bE_Date),bE_G_Qty,bE_N_Qty,bE_OTR_Qty]
                   return (
                    <VessalDetailsRow key={useid.replace(/[^a-zA-Z0-9]/g, '')} tblbody={tblbody} vessal_Name={vessal_Name}vessal_No={vessal_No} bE_No={bE_No} />
                  )})}
                 
                </TableBody>
              </Table>}
                          
              </Box>
              </Collapse>
              </TableCell>
              </TableRow>
    </React.Fragment>
}

function VessalDetailsRow({tblbody, vessal_Name,vessal_No,bE_No}){
  
  const useid = useId();
  const [openTank, setOpenTank] = React.useState(false);
    const [vessalLoading, setVessalLoading] = useState(true);
    const [vessalError, setVessalError] =useState('');
    const [bedata,setBedata] = useState([]);
  const [tabs, setTabs] = React.useState(0);
    const handleTabs = (event, newValue) => {
    setTabs(newValue);
  };

 async function handleOpen(vessal_Name,vessal_No,userId){
  setOpenTank(!openTank)
   await authAxios.post(vessailBE_Detail_List,JSON.stringify({
  "user_id": userId,
  "Vessal_No": vessal_No,
  "Vessal_Name": vessal_Name,
  "bE_No": bE_No
}))
.then((res)=>{setBedata(res.data);setVessalLoading(false) })
.catch((err)=>
{
  setVessalLoading(false)
  setVessalError(err)
});

  }
  return (
    <React.Fragment>
     <TableRow key={useid} sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {openTank ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
                        {tblbody.map((bodytext)=>
                         <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')}>{bodytext}</TableCell>
                        )}
                     </TableRow>
                  <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 ,display:"flex"}} colSpan={6}>
          <Collapse in={openTank} timeout="auto" unmountOnExit  >
          <Box >
                  {/* <TabContext value={tabs}> */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
          <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example">
           
            <Tab label="Tank Details" {...a11yProps(0)} />
          <Tab label="x-Bond" {...a11yProps(1)} />
          {/* </TabList> */}
          </Tabs>
        </Box>
        <CustomTabPanel value={tabs} index={0}  >
              {/* <Box> */}
               {vessalLoading && <p>Loading . . .</p>}
        {vessalError && <p>error {vessalError}</p>}
             {bedata?.tanK_BE !==undefined  &&  <Table size="small" sx={{overflow:"auto",p:0}} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {TblHead_Tank.map((head)=>(
                    <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bedata?.tanK_BE?.map(Data=>{
                    const {bE_NO, terminal_Name, tank_name, net_Quantity} = Data;  
                    const tblbody=[bE_NO, terminal_Name, tank_name, net_Quantity]
                    return (
                         <TableRow>
                           {tblbody.map((head)=>(
                    <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left">{head}</TableCell>
                    ))}
                         </TableRow>
                    )
                    })}
                  
                </TableBody>
                
                </Table>}
                {/* </Box> */}
                </CustomTabPanel>
        <CustomTabPanel value={tabs} index={1}>
              {vessalLoading && <p>Loading . . .</p>}
        {vessalError && <p>error {vessalError}</p>}
             {bedata?.xbE_BE !==undefined  &&   <Table size="small" sx={{overflow:"auto"}} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {BeXbontTbl_head.map((head)=>(
                    <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bedata?.xbE_BE?.map(Data=>{
                    const {bE_No, xbE_date, xbE_NO, xbE_Qty} = Data;  
                    const tblbody=[bE_No,formatDateToUS( xbE_date), xbE_NO, xbE_Qty]
                    return (
                         <TableRow>
                           {tblbody.map((head)=>(
                    <TableCell key={useid.replace(/[^a-zA-Z0-9]/g, '')} align="left" >{head}</TableCell>
                    ))}
                         </TableRow>
                    )
                    })}
                  
                </TableBody>
                </Table>}
              {/* </Box> */}
              {/* </TabPanel> */}
              </CustomTabPanel>
      {/* </TabContext> */}

            
                
                
              </Box>
              </Collapse>
              </TableCell>
              </TableRow>
  </React.Fragment>
  )
}