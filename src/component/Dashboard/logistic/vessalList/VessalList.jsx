
import React, { useEffect,useState } from 'react'
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader'
import { Box, Button, Collapse, IconButton, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import TabCon
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { authAxios } from '../../../utils/authAxios';
import { TankDeleteapi, vessailBE_Detail_List, Vessel_Detail, Vessel_Detail_list } from '../../../Config/Api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import formatDateToUS from '../../../utils/DateFormate';
import dayjs from 'dayjs';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { a11yProps, CustomTabPanel } from '../../../commonComponent/CustomTabPanel/CustomTabPanel';
import TankForm from '../VessalRequestForm/TankForm/TankForm';
import XBondForm from '../VessalRequestForm/XBondFrom/XBondFrom';
import { useNavigate } from 'react-router';
import DeleteIcon from "@mui/icons-material/Delete";
const Table_headVessal=["Vessal Details","vessal_Name","vessal No","discarge Date","chA Name",]
const TblHead_vessalDetails = ["Be Details","produce Name","port Name","BL Name","Bl No","BL Date","BL Qty","BE Name","BE No","bE Date","BE Gross Qty","BE Net Qty","Be OTR Qty","Edit"]
const TblHead_Tank = ["bE_NO","terminal_Name","tank_name","net_Quantity","Edit","Delete"]
const BeXbontTbl_head=["bE_No", "xbE_date", "xbE_NO", "xbE_Qty","Edit"]
const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;
export default function VessalList() {
   const [vessalLoading, setVessalLoading] = useState(true);
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
     .catch(err=> {console.log(err)
      setVessalLoading(false)
     })
    },[setVessalLoading,setVessaldata,userId,Vessel_Detail])
   
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
          { vessaldata.length !==0 &&  <TableContainer component={Paper}>
                   <Table aria-label="collapsible table" style={{overflow:"auto"}}>
                      <TableHead>
                        <TableRow>
                        {Table_headVessal.map((head,index)=>(
                        <TableCell key={index+head} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{head}</TableCell>
                        ))}
                        </TableRow>
                      </TableHead>
                      <TableBody >
                     {filteredPatients.map((data,index)=>{
                      // const {vessal_Name,vessal_No,discarge_Date,chA_Name} = data;
                      return (
                        <VessalRow key={index} row={data}  />
                     )})}
                      </TableBody>
                   </Table>
             </TableContainer>}
        </Stack>

    </React.Fragment>
  )
}

function VessalRow({row,key}){
  
const { vessal_Name,vessal_No,discarge_Date,chA_Name } = row;
const TblvessalDetails=[vessal_Name,vessal_No,formatDateToUS(discarge_Date),chA_Name]
  const [open, setOpen] = React.useState(false);
  const [vessalLoading, setVessalLoading] = useState(true);
    const [vessaldata,setVessaldata] = useState([]);
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
.catch((err)=>{console.log(err.message)
  setVessalLoading(false)
})
 }
  return <React.Fragment><TableRow key={key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {TblvessalDetails.map((bodytext,index)=><TableCell key={bodytext+index}>
                            {bodytext}
                          </TableCell>)} 
                        </TableRow>
                        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 ,overflow: 'auto'}}>
              
                 {vessalLoading && <p>Loading . . .</p>}
          { vessaldata.length !==0 && 
          // <TableContainer component={Paper} sx={{overflow:"auto"}}>
              <Table size="small" sx={{overflow:"auto", minWidth: 800 }} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {TblHead_vessalDetails.map((head,index)=>(
                    <TableCell component="th" scope="row" key={index} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vessaldata.map((data)=>{
                    const {bL_BE_ID,produce_Name,port_Name,bl_Name,bl_No,bL_Date,bL_Qty,bE_Name,bE_No,bE_Date,bE_G_Qty,bE_N_Qty,bE_OTR_Qty} =data;
                    // console.log(data)
                    const tblbody=[produce_Name,port_Name,bl_Name,bl_No,formatDateToUS(bL_Date),bL_Qty,bE_Name,bE_No,formatDateToUS(bE_Date),bE_G_Qty,bE_N_Qty,bE_OTR_Qty]
                   return (
                    <VessalDetailsRow key={bL_BE_ID} bL_BE_ID={bL_BE_ID}  tblbody={tblbody} vessal_Name={vessal_Name}vessal_No={vessal_No} discarge_Date={discarge_Date} chA_Name={chA_Name} bE_No={bE_No} />
                  )})}
                 
                </TableBody>
              </Table>
              }
                          
              </Box>
              </Collapse>
               </TableCell>
              </TableRow> 
    </React.Fragment>
}

function VessalDetailsRow({tblbody, vessal_Name,vessal_No,bE_No,key,bL_BE_ID,discarge_Date ,chA_Name}){
  
  const [openTank, setOpenTank] = React.useState(false);
    const [vessalLoading, setVessalLoading] = useState(true);
    const [bedata,setBedata] = useState([]);
    const [editTank, setEditTank] = useState(false);
    const [dataTankInfo,setDataTankInfo] = useState({})
    const [editXbond,setEditXbond] = useState(false);
    const [dataXbondInfo,setDataXbondInfo] =  useState({});
    const navigate = useNavigate();
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
  console.log(err)
  setVessalLoading(false)
});

  }
  function beDetailsEdit(data,e){
   let value=e.currentTarget.value;
   if(value === "Open-tank"){
    setEditTank(true);
    console.log(tblbody[9])
    let {tank_ID,bE_NO, terminal_Name, tank_name, net_Quantity} = data;
    setDataTankInfo({
  ...dataTankInfo,
  tank_ID:tank_ID,BlNo:bE_NO, terminal_Name:terminal_Name, tank_name:tank_name,Quantity:net_Quantity, NetQuantity:tblbody[5],grossQuantity:tblbody[9],
  isEdit: true
})
   }
   else if(value === "X-Bond"){
      let {X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty} = data;
     setEditXbond(true)
     setDataXbondInfo({BlNo:bE_No,Quantity:xbE_Qty,X_BE_ID:X_BE_ID,  XBE_date: xbE_date,xbE_NO:xbE_NO,NetQuantity:tblbody[5],grossQuantity:tblbody[9],
      isEdit:true
})
    //  const {X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty} = data;
   }
   else if(value === "Be-Details"){
    console.log(data,bL_BE_ID);
    let BeData=JSON.stringify({ vessal_No:vessal_No, vessal_Name:vessal_Name,discarge_Date:discarge_Date ,chA_Name:chA_Name,
      produce_Name:data[0],port_Name:data[1],bl_Name:data[2],bl_No:data[3],bL_Date:data[4],bL_Qty:data[5],bE_Name:data[6],
      bE_No:data[7],bE_Date:data[8],bE_G_Qty:data[9],bE_N_Qty:data[10],bE_OTR_Qty:data[11],bL_BE_ID:bL_BE_ID,isEdit:true
     });
      
     navigate(`/dashboard/Logistic/Vessal_Edit_Form/${bL_BE_ID}?BeData=${BeData}`)
   }
  }
 async function TankDelete(data){
  let {tank_ID,userId} = data;
 
const tanka={
  user_id:userId,
  Tank_ID: tank_ID
}
await authAxios.post(TankDeleteapi,JSON.stringify(tanka))
.then(function (response) {
  console.log((response.data));
})
.catch(function (error) {
  console.log(error);
});
  }
  useEffect(()=>{
    if(editTank === false ||editXbond === false){
authAxios.post(vessailBE_Detail_List,JSON.stringify({
  "user_id": userId,
  "Vessal_No": vessal_No,
  "Vessal_Name": vessal_Name,
  "bE_No": bE_No
}))
.then((res)=>{setBedata(res.data);setVessalLoading(false) })
.catch((err)=>
{
  console.log(err)
  setVessalLoading(false)
});
    }
  },[editTank,editXbond,bE_No,vessal_No,vessal_Name])
  return (
    <React.Fragment>
     <TableRow key={key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {openTank ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
                        {tblbody.map((bodytext,index)=>
                         <TableCell key={bodytext+index}>{bodytext}</TableCell>
                        )}
                        <TableCell>
                      <IconButton color='primary' value="Be-Details" onClick={(e)=>beDetailsEdit(tblbody,e)}>
                      <EditSquareIcon  />
                      </IconButton>
                    </TableCell>
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
             {bedata?.tanK_BE !==undefined  &&  <Table size="small" sx={{overflow:"auto",p:0}} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {TblHead_Tank.map((head,index)=>(
                    <TableCell key={TblHead_Tank+index} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bedata?.tanK_BE?.map(Data=>{
                    const {tank_ID,bE_NO, terminal_Name, tank_name, net_Quantity} = Data;  
                    const tblbody=[bE_NO, terminal_Name, tank_name, net_Quantity]
                    return (
                         <TableRow key={tank_ID}>
                           {tblbody.map((head,index)=>(
                    <TableCell key={head+index} align="left">{head}</TableCell>
                    ))}
                    <TableCell>
                      <IconButton color='primary' value="Open-tank" onClick={(e)=>beDetailsEdit({tank_ID,bE_NO, terminal_Name, tank_name, net_Quantity},e)}>
                      <EditSquareIcon  />
                      </IconButton>
                      </TableCell>
                      <TableCell >
                      <IconButton color='error' onClick={(e)=>TankDelete({tank_ID,userId},e)}>
                      <DeleteIcon  />
                      </IconButton>
                    </TableCell>
                         </TableRow>
                    )
                    })}
                  
                </TableBody>
                
                </Table>}
                {/* </Box> */}
                </CustomTabPanel>
        <CustomTabPanel value={tabs} index={1}>
              {vessalLoading && <p>Loading . . .</p>}
             {bedata?.xbE_BE !==undefined  &&   <Table size="small" sx={{overflow:"auto"}} aria-label="purchases">
                <TableHead>
                  <TableRow>
                    {BeXbontTbl_head.map((head,index)=>(
                    <TableCell key={head+index} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bedata?.xbE_BE?.map(Data=>{
                    const {X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty} = Data;  
                    const tblbody=[bE_No,formatDateToUS( xbE_date), xbE_NO, xbE_Qty]
                    return (
                         <TableRow key={X_BE_ID}>
                           {tblbody.map((head)=>(
                    <TableCell key={head+X_BE_ID} align="left" >{head}</TableCell>
                    ))}
                     <TableCell>
                      <IconButton color='primary' value="X-Bond" onClick={(e)=>beDetailsEdit({X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty},e)}>
                      <EditSquareIcon  />
                      </IconButton>
                    </TableCell>
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
              <TankForm open={editTank} dataInfo={dataTankInfo}
                      setOpen={setEditTank} userId={userId}
                      setDataInfo={setDataTankInfo}/>
               <XBondForm open={editXbond} dataInfo={dataXbondInfo}
                      setOpen={setEditXbond} userId={userId}/>
  </React.Fragment>
  )
}