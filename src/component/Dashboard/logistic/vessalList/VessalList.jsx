
import React, { useEffect,useState } from 'react'
import CustomPageHeader from '../../../commonComponent/CustomPageHeader/CustomPageHeader'
import { Box, Button, Collapse, IconButton, List, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { authAxios } from '../../../utils/authAxios';
import {  vessailBE_Detail_List, Vessel_Detail, Vessel_Detail_list } from '../../../Config/Api';
import formatDateToUS from '../../../utils/DateFormate';
import dayjs from 'dayjs';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { a11yProps, CustomTabPanel } from '../../../commonComponent/CustomTabPanel/CustomTabPanel';
import { useNavigate } from 'react-router';
import { setEditVessalArray } from '../../../features/vessalDetails';
import { useDispatch } from 'react-redux';
const Table_headVessal=["vessal_Name","Voyage No No","discarge Date","chA Name","Edit","Vessal Details"]
const TblHead_vessalDetails = ["produce Name","port Name","BL Name","Bl No","BL Date","BL Qty","BE Name","BOE No","BOE Date","BE Gross Qty","BE Net Qty","Be OTR Qty","Be Details"]
const TblHead_Tank = ["bE_NO","terminal_Name","tank_name","net_Quantity"]
const BeXbontTbl_head=["bE_No", "xbE_date", "xbE_NO", "xbE_Qty"]
const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;
export default function VessalList() {
   const [vessalLoading, setVessalLoading] = useState(true);
    const [vessaldata,setVessaldata] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedChaName, setSelectedChaName] = useState(null);
    useEffect(()=>{
      if(vessalLoading == true){
     authAxios.post(Vessel_Detail,JSON.stringify({
      "User_Id":userId
    }))
     .then(res=> {setVessaldata(res.data);
      setVessalLoading(false)
     })
     .catch(err=> {console.log(err)
      setVessalLoading(false)
     })
    }
    },[setVessalLoading, setVessaldata, vessalLoading])
   
  const filteredPatients = vessaldata?.filter((patient) => {
       const matchDate = !selectedDate || dayjs(patient?.discarge_Date)?.isSame(selectedDate, 'day');
       const matchVessalname = !selectedName || patient?.vessal_Name === selectedName;
       const matchchA_Name = !selectedChaName || patient?.chA_Name === selectedChaName;
    return matchDate && matchVessalname && matchchA_Name ;
  });
  const handleClear = () => {
    setSelectedDate(null);
    setSelectedName(null);
    setSelectedChaName(null);
    // setSelectedVeNo(null);
  };
  return (
    <React.Fragment>

         <CustomPageHeader pageHeaderText='Vessal List' ></CustomPageHeader>
         <Stack spacing={2} sx={{p:2}}>
            <Stack spacing={2} sx={{py:2,display:"flex",}}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 ,flexDirection: {
    xs: 'column',  
    md: 'row',  
  },}} >
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
         </LocalizationProvider>
         <TextField type='text'sx={{mt:1}}
         size='small'
         value={selectedName}
         label="Vessal Name"
         onChange={(e)=>{
          let value = e.currentTarget.value;
          setSelectedName(value)
         }} />
         <TextField type='text'sx={{mt:1}}
         size='small'
         value={selectedChaName}
         label="Cha Name"
         onChange={(e)=>{
          let value = e.currentTarget.value;
          setSelectedChaName(value)
         }} />
         
        <Button sx={{mt:1}} onClick={handleClear} variant="outlined">
          Clear Date
        </Button>
        
      </Box>
            </Stack>
              {vessalLoading && <p>Loading . . .</p>}
            <TableContainer component={Paper} style={{overflow:"auto"}}>
                   <Table aria-label="collapsible table" >
                      <TableHead>
                        <TableRow>
                        {Table_headVessal.map((head,index)=>(
                        <TableCell key={index+head} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>{head}</TableCell>
                        ))}
                        </TableRow>
                      </TableHead>
                      <TableBody >
                     {filteredPatients.map((data,index)=>{
                      return (
                        <VessalRow key={index} row={data}  />
                     )})}
                      </TableBody>
                   </Table>
             </TableContainer>
        </Stack>

    </React.Fragment>
  )
}

function VessalRow({row,key}){
  const dispatch = useDispatch();
  const navigate = useNavigate()
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
  setVessalLoading(false);
})
.catch((err)=>{console.log(err.message)
  setVessalLoading(false)
})
 }
async function beDetailsEdit(name , vsl_number,id,chA_Name,discarge_Date){
await authAxios.post(Vessel_Detail_list, JSON.stringify({
  "user_id": id,
  "Vessal_No": vsl_number,
  "Vessal_Name": name
}))
.then((res)=>{setVessaldata(res.data);
  setVessalLoading(false);
  dispatch(setEditVessalArray(res.data));
  let data={
    "vessal_No": vsl_number,
  "vessal_Name": name,
  chA_Name:chA_Name,discarge_Date:discarge_Date,isEdit:true
  }
  navigate(`/dashboard/Logistic/Vessal_Edit_Form?BeData=${JSON.stringify(data)}`)
})
.catch((err)=>{console.log(err.message)
  setVessalLoading(false)
})
 }
  return <React.Fragment><TableRow key={key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                    
        {TblvessalDetails.map((bodytext,index)=><TableCell key={bodytext+index} style={{width:"120px"}}>
                            {bodytext}
                          </TableCell>)}
                            <TableCell key={"Be-Details"+key}>
                      <IconButton color='primary' value="Be-Details" 
                      onClick={()=>beDetailsEdit(vessal_Name,vessal_No,userId,chA_Name,discarge_Date)}
                      
                      >
                      <EditSquareIcon  />
                      </IconButton>
                          </TableCell>
                          <TableCell key={"vessalDetails"+key}>
          <Button
            aria-label="expand row"
            size="small"
            variant="outlined"
            color={!open ? "primary" : "error"}
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {!open ? "Open" : "Close"}
          </Button>
        </TableCell> 
                        </TableRow>
                        <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              
                 {vessalLoading && <p>Loading . . .</p>}
           
          <TableContainer elevation={0} component={Paper} style={{overflow:"auto",minWidth:800}}>
              <Table size="small"  aria-label="Shipper Name">
                <TableHead>
                  <TableRow>
                    {TblHead_vessalDetails.map((head,index)=>( 
                    <TableCell component="th" scope="row" key={index} align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}} >{head}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
            { vessaldata &&    <TableBody>
                  {vessaldata.map((data)=>{
                    const {bL_BE_ID,produce_Name,port_Name,bl_Name,bl_No,bL_Date,bL_Qty,bE_Name,bE_No,bE_Date,bE_G_Qty,bE_N_Qty,bE_OTR_Qty} =data;
                    const tblbody=[produce_Name,port_Name,bl_Name,bl_No,formatDateToUS(bL_Date),bL_Qty,bE_Name,bE_No,formatDateToUS(bE_Date),bE_G_Qty,bE_N_Qty,bE_OTR_Qty]
                   return (
                    <VessalDetailsRow key={bL_BE_ID}   tblbody={tblbody} vessal_Name={vessal_Name}vessal_No={vessal_No}   bE_No={bE_No} />
                  )})}
                            </TableBody>}
              </Table>
                </TableContainer>  
              
                      
              </List>
              </Collapse>
               </TableCell>
              </TableRow> 
    </React.Fragment>
}

function VessalDetailsRow({tblbody, vessal_Name,vessal_No,bE_No,key}){
  
  const [openTank, setOpenTank] = React.useState(false);
    const [vessalLoading, setVessalLoading] = useState(true);
    const [bedata,setBedata] = useState([]);
    const [editTank, setEditTank] = useState(false);
    const [editXbond,setEditXbond] = useState(false);
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
//   function beDetailsEdit(data,e){
//    let value=e.currentTarget.value;
//    if(value === "Open-tank"){
//     setEditTank(true);
//     console.log(tblbody[9])
//     let {tank_ID,bE_NO, terminal_Name, tank_name, net_Quantity} = data;
//     setDataTankInfo({
//   ...dataTankInfo,
//   tank_ID:tank_ID,BlNo:bE_NO, terminal_Name:terminal_Name, tank_name:tank_name,Quantity:net_Quantity, NetQuantity:tblbody[5],grossQuantity:tblbody[9],
//   isEdit: true
// })
//    }
//    else if(value === "X-Bond"){
//       let {X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty} = data;
//      setEditXbond(true)
//      setDataXbondInfo({BlNo:bE_No,Quantity:xbE_Qty,X_BE_ID:X_BE_ID,  XBE_date: xbE_date,xbE_NO:xbE_NO,NetQuantity:tblbody[5],grossQuantity:tblbody[9],
//       isEdit:true
// })
//     //  const {X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty} = data;
//    }
//    else if(value === "Be-Details"){
//     console.log(data,bL_BE_ID);
//     let BeData=JSON.stringify({ vessal_No:vessal_No, vessal_Name:vessal_Name,discarge_Date:discarge_Date ,chA_Name:chA_Name,
//       produce_Name:data[0],port_Name:data[1],bl_Name:data[2],bl_No:data[3],bL_Date:data[4],bL_Qty:data[5],bE_Name:data[6],
//       bE_No:data[7],bE_Date:data[8],bE_G_Qty:data[9],bE_N_Qty:data[10],bE_OTR_Qty:data[11],bL_BE_ID:bL_BE_ID,isEdit:true
//      });
//       // localStorage.setItem("editBeDetalis",BeData)
//      navigate(`/dashboard/Logistic/Vessal_Edit_Form/${bL_BE_ID}?BeData=${BeData}`)
//    }
//   }
//  async function TankDelete(data){
//   let {tank_ID,userId} = data;
 
// const tanka={
//   user_id:userId,
//   Tank_ID: tank_ID
// }
// await authAxios.post(TankDeleteapi,JSON.stringify(tanka))
// .then(function (response) {
//   console.log((response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });
//   }
  useEffect(()=>{
    if(editTank === false ||editXbond === false){
authAxios.post(vessailBE_Detail_List,JSON.stringify({
  "user_id": userId,
  "Vessal_No": vessal_No,
  "Vessal_Name": vessal_Name,
  "bE_No": bE_No
}))
.then((res)=>{setBedata(res.data);setVessalLoading(false);setEditTank(true);setEditXbond(true) })
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
                    
        
                        {tblbody.map((bodytext,index)=>
                         <TableCell key={bodytext+index}>{bodytext}</TableCell>
                        )}
                        {/* <TableCell key={"Be-Details"+key}> */}
                      {/* <IconButton color='primary' value="Be-Details" onClick={(e)=>beDetailsEdit(tblbody,e)}> */}
                      {/* <EditSquareIcon  /> */}
                      {/* </IconButton> */}
                    {/* </TableCell> */}
                        <TableCell key={"expand"+key}>
          <Button
            aria-label="expand row"
            size="small"
            variant="outlined"
            color={!openTank ? "primary" : "error"}
            onClick={() => handleOpen(vessal_Name,vessal_No,userId)}
          >
            {!openTank ? "Open" : "Close"}
          </Button>
        </TableCell>
                     </TableRow>
                  <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 ,display:"flex"}} colSpan={6}>
          <Collapse in={openTank} timeout="auto" unmountOnExit  >
          <List component="div" disablePadding>
         
        <Box sx={{ borderBottom: 1, borderColor: 'divider',width:"100%" }}>
          <Tabs value={tabs} onChange={handleTabs} aria-label="basic tabs example">
           
            <Tab label="Tank Details" {...a11yProps(0)} />
          <Tab label="x-Bond" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabs} index={0}  >
              {/* <Box> */}
               {vessalLoading && <p>Loading . . .</p>}
             {bedata?.tanK_BE !==undefined  &&  <Table size="small" sx={{overflow:"auto",p:0}} aria-label="Shipper Name">
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
                    {/* <TableCell> */}
                      {/* <IconButton color='primary' value="Open-tank" onClick={(e)=>beDetailsEdit({tank_ID,bE_NO, terminal_Name, tank_name, net_Quantity},e)}>
                      <EditSquareIcon  />
                      </IconButton> */}
                      {/* </TableCell> */}
                      {/* <TableCell >
                      <IconButton color='error' onClick={(e)=>TankDelete({tank_ID,userId},e)}>
                      <DeleteIcon  />
                      </IconButton>
                    </TableCell> */}
                         </TableRow>
                    )
                    })}
                  
                </TableBody>
                
                </Table>}
                {/* </Box> */}
                </CustomTabPanel>
        <CustomTabPanel value={tabs} index={1}>
              {vessalLoading && <p>Loading . . .</p>}
             {bedata?.xbE_BE !==undefined  &&   <Table size="small" sx={{overflow:"auto"}} aria-label="Shipper Name">
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
                     {/* <TableCell>
                      <IconButton color='error' value="X-Bond" onClick={(e)=>beDetailsEdit({X_BE_ID,bE_No, xbE_date, xbE_NO, xbE_Qty},e)}>
                      <DeleteIcon  />
                      </IconButton>
                    </TableCell> */}
                         </TableRow>
                         
                    )
                    })}
                  
                </TableBody>
                </Table>}
              {/* </Box> */}
              {/* </TabPanel> */}
              </CustomTabPanel>
      {/* </TabContext> */}

            
                
                
              </List>
              </Collapse>
              </TableCell>
              </TableRow>
              {/* <TankForm open={editTank} dataInfo={dataTankInfo}
                      setOpen={setEditTank} userId={userId}
                      setDataInfo={setDataTankInfo}/>
               <XBondForm open={editXbond} dataInfo={dataXbondInfo}
                      setOpen={setEditXbond} userId={userId}/> */}
  </React.Fragment>
  )
}