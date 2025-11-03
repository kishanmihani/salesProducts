import {
    Box, Button, FormControl, InputLabel, MenuItem, Select, Paper,
    Stack,
    TextField,
    FormHelperText
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useLocation, useNavigate, useParams } from "react-router";
import CustomerDropDownTwo from "../../../commonComponent/CustomerDropDown/CustomerDropDowntwo";
import PortDropDownTwo from "../../../commonComponent/PortDropdown/ProtDropDowntwo";
import { authAxios } from "../../../utils/authAxios";
import CustomeAlerts from "../../../commonComponent/CustomeAlert/CustomeAlert";
import CustomPageHeader from "../../../commonComponent/CustomPageHeader/CustomPageHeader";
import ProductDropDownTwo from "../../../commonComponent/ProductDropDown/ProductDropDownTwo";
import { vehiclelistapi, VessalFormData } from "../../../Config/Api/Api";
  export default function LogicticListEdit() {
    const tableId=useParams().id;
    // const {id} = useLocation;
    const navigate = useNavigate();
    const [tableData,setTableData]=React.useState()
      const [checkTableData,setCheckTableData]=React.useState(false);
      const [vessalName,setVessalNmae] = React.useState("Select");
    const [vessalNameError,setVessalNameError] = React.useState(false)
     const [productError,setProductError] = useState(false);
              const [selectedProduct,setSelectedProduct] = useState("Select")
    const [vessalData,setVessalData] = React.useState([])
    const [vessalInfo,setVessalInfo] = React.useState({
     be_No: "Select",
    be_NoError: false,
    wH_NAME: "Select",
    // XBoeError: false,
    // tank: "Select",
    // Xboe:"Select",
    tankError: false,
    bl_No: "8",
    bl_NoError: false,
  });
     const [editVslCheck,setEditVslCheck] = useState(true)
      const [vessalList,setVessalList] = React.useState([]);
    const [customerName, setCustomerName] = React.useState('Select');
    const [portName, setPortName] = React.useState('Select');
    const [vehicleLoad,setVehicleLoad] = React.useState(false);
    const [fields, setFields] = React.useState([{vehicleName: '',
      vehicleNameError: '',
      quantity: '',
      quantityError: '',transporter:"",transporterError: '' }]);
    const [errorsCustomerName, setErrorsCustomerName] = React.useState(false);
    const [errorsPortName, setErrorsPortName] = React.useState(false);
    const [remark, setRemark] = React.useState("");
    const [soNo,setSoNo] = React.useState(0);
    const [errorSoNo,seterrorSoNo] = React.useState("")
    const [actualQuantity,setActQuantity] = React.useState(0);
    const [errorActQut,seterrorActQut] = React.useState(""); 
    const [custAlert, setCustAlert] = React.useState(null);
    const [userId] = React.useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
    const showSuccess = (data) => {
      setCustAlert({ type: "success", message: data });
    };
    const showError = (data) => {
      setCustAlert({ type: "error", message: data });
    };
    useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await authAxios.post(
        vehiclelistapi,
        JSON.stringify({
          user_id: userId,
          Role: "entry",
        })
      );

      setCheckTableData(true);

      const tabledata = response.data.filter(data => data.table_id == tableId);
     
      console.log(tabledata);
//       if (tabledata.length > 0) {
//         const item = tabledata[0];
//         setTableData(item) // get the first match
//         VessalChange(item?.vessel_Name +"|"+item?.vessel_No)
//         setCustomerName(item?.customer_Name || '');
//         setPortName(item?.port_Name || '');
//         setRemark(item?.remark || '');
//         setActQuantity(item?.a_Qty );
//         setSoNo(item?.so_No);
// (item?.bE_No)//kishan
//         setSelectedProduct(item?.produce_Name || '');
//         setFields([{
//           vehicleName: item?.vehicle_Name || '',
//           vehicleNameError: '',
//           quantity: item?.quantity || '',
//           Xboe:item?.bE_No || '',
//           XBoeError:"",
//           quantityError: '',
//           transporter: item?.transporter_Name || '',
//           transporterError: ''
//         }]);
//         //  VessalChange(item?.vessel_Name +"|"+item?.vessel_No)
//         setTimeout(()=>{
//         setVessalInfo(
//         {
//       be_No:item?.bE_No,
//       be_NoError:false,
//       wH_NAME:item?.terminal_NAME,
//       wH_NAMEError:false,
//       tank:item?.tank_name,
//       tankError:false,
//       bl_No:item?.bL_No,
//       bl_NoError:false
//      })
//      },600)
     
        
//       }
if (tabledata.length > 0) {
  const item = tabledata[0];
  setTableData(item);
  setCustomerName(item?.customer_Name || "Select");
  setPortName(item?.port_Name || "Select");
  setRemark(item?.remark || "");
  setActQuantity(item?.a_Qty || 0);
  setSoNo(item?.so_No || 0);
  setSelectedProduct(item?.produce_Name || "Select");
VessalChange(item?.vessel_Name + "|" + item?.vessel_No);
  setFields([{
    vehicleName: item?.vehicle_Name || "",
    vehicleNameError: "",
    quantity: item?.quantity || "",
    quantityError: "",
    transporter: item?.transporter_Name || "",
    transporterError: "",
  }]);

}

     
    } catch (error) {
      
      console.error("Error fetching table data:", error);
    } finally {
      setCheckTableData(true);
    }
  };

  if (!checkTableData) {
    fetchTableData();
  }

  
}, [VessalChange, checkTableData, tableData, tableId, userId]);
React.useEffect(() => {
  if (tableData) {
    setVessalInfo((prev) => ({
      ...prev,
      be_No: tableData?.bE_No,
      be_NoError: false,
      bl_No: tableData?.bL_No,
      bl_NoError: false,
    }));
    console.log(tableData);
  }
}, [tableData]);

useEffect(() => {
  if (tableData && vessalData) {
    setVessalInfo((prev) => ({
      ...prev,
      wH_NAME: tableData?.terminal_NAME,
      wH_NAMEError: false,
      tank: tableData?.tank_name,
      tankError: false,
      // Xboe: tableData?.exboe,
      // XBoeError: false,
    }));
  }
}, [tableData, vessalData]);



    const handleSubmit = async (e) => {
      e.preventDefault();
      let hasError = false;
      if(selectedProduct == "Select"){
        setProductError(false)
        // setVessalInfo((prev)=>({...prev,product_NameError:true}))
        hasError = true;
      }
      if (customerName == "Select") {
        setErrorsCustomerName(true)
        hasError = true;
      }
      if (portName == "Select") {
        setErrorsPortName(true)
        hasError = true;
      }
      if(vessalName == "Select"){
        setVessalNameError(true)
        hasError = true;
      }
      // if (vessalInfo.Xboe == "Select") {
      //   setVessalInfo((prev)=>({...prev,XBoeError:true }));
      //   hasError = true;
      // }
      if(soNo == 0){
        seterrorSoNo("So No value is required");
          hasError = true;
      }else if(soNo < 0){
        seterrorSoNo("So No value can not be negative");
          hasError = true;
      }else{
        seterrorSoNo("");
      }
      if(actualQuantity == 0){
        hasError = true;
                    // seterrorActQut("Actual Quantity value is required")
                  }else if(actualQuantity < 0){
                    hasError = true;
                    seterrorActQut("Actual Quantity value can not be negative")
                  }
                  else {
                     seterrorActQut("");
                  }
      if(vessalName !== "Select"){
        if(vessalInfo.be_No == "Select"){
          setVessalInfo((prev)=>({...prev,be_NoError:true }));
          hasError = true;
        }
        if(vessalInfo.bl_No == "Select"){
          setVessalInfo((prev)=>({...prev,bl_NoError:true }));
          hasError = true;
        }
        if(vessalInfo.tank == "Select"){
          setVessalInfo((prev)=>({...prev,tankError:true }));
          hasError = true;
        }
        if(vessalInfo.wH_NAME == "Select"){
          setVessalInfo((prev)=>({...prev,wH_NAMEError:true }));
          hasError = true;
        }
      }
      const updatedFields = fields.map((field) => {
        const updatedField = { ...field };
    
        if (field.vehicleName.trim() === "") {
          updatedField.vehicleNameError = "Vehicle Name is required";
          hasError = true;
        } else {
          updatedField.vehicleNameError = "";
        }
    
        if (field.quantity === "" || Number(field.quantity) === 0) {
          updatedField.quantityError = "Quantity must be greater than 0";
          hasError = true;
        } else if (Number(field.quantity) < 0) {
          updatedField.quantityError = "Quantity cannot be negative";
          hasError = true;
        } else {
          updatedField.quantityError = "";
        }
        if(field.transporter == ""){
          updatedField.transporterError="Transporter name is required"
          hasError = true;
        } else if (!/^[A-Za-z\s]+$/.test(field.transporter)) {
          updatedField.transporterError = "Only letters and spaces allowed";
          hasError = true;
        }else {
          updatedField.transporterError = "";
        }
        return updatedField;
      });
    
      setFields(updatedFields);
    
      if (!hasError) {
        
        let count=0;
        for(let arr of fields){
          
          count++;
         var data={
          
    "User_id": userId,
    "Customer_Name": customerName,
    "Port_Name": portName,
    "vehicle_Name": arr?.vehicleName,
    "P_Qut": arr?.quantity,
    "Remark": remark,
    "Table_Id": tableData["table_id"],
    "Transporter_Name": arr?.transporter,
    "Produce_Name": selectedProduct,
    "Vessel_Name": vessalName.replaceAll("|", ",").split(",")?.[0],
    "Vessel_No": vessalName.replaceAll("|", ",").split(",")?.[1],
    "Tank_name": vessalInfo.tank,
    "Terminal_NAME": vessalInfo?.tank.replaceAll("|", ",").split(",")?.[0],
    "BE_No": vessalInfo.be_No,
    // Exboe:vessalInfo.Xboe,
    "BL_No": vessalInfo.be_No.replaceAll("|", ",").split(",")?.[0],
    "Do_No":  arr.quantity +
            "/" +
            arr.vehicleName +
            "/" +
            vessalInfo.bl_No +
            "/" +
            portName
,
    "A_Qty": actualQuantity,
    "So_No": soNo
}
console.log(data);
          await authAxios.post('BituRep/Api/Account/logistic_data_Edit',JSON.stringify(data))
          .then((res)=>{
          if (res.data.massage == "Entry Done") {
                      showSuccess("Records Submited");
                       navigate("/dashboard/Logistic/Logistic_Pending_form")    
                      }else {
                        showError(res.data.message)
                      }
                      if(count === fields.length ){
                        handleReset()
                      }
         })
          .catch((err)=>{if (err.massage == "Network Error") {
          showError("Network Error")
          }else {
            showError(err.message)
          }})
        }
    
        
      }
    };
    const handleReset = () => {
       setCustomerName("Select");
    setPortName("Select");
    setRemark("");
    setFields([
      {
        vehicleName: "",
        vehicleNameError: "",
        quantity: "",
        quantityError: "",
        transporter: "",
        transporterError: "",
      },
    ]);
    setErrorsCustomerName(false);
    setErrorsPortName(false);
    setVessalNmae("");
    setVessalInfo({
      be_No: "Select",
      be_NoError: false,
      wH_NAME: "Select",
      // XBoeError: false,
      // tank: "Select",
      // tankError: false,
      // Xboe:"Select",
      bl_No: "Select",
      bl_NoError: false,
    });
    // setErrorsWhereHouse("Select");
    // setErrorsWhereHouse(false);
    setSelectedProduct("Select");
    setProductError(false);
    navigate(-1)
    };
    const handleClose = () => {
      setCustAlert(null)
     };
     useEffect(()=>{
         if(vessalList.length == 0){
             authAxios.post("/BituRep/Api/Account/VesselName_List",JSON.stringify({
               "User_Id":userId
             }))
             .then(res=>setVessalList(res.data))
             .catch(err=> console.log(err.message))
           }
     },[vessalList,setVessalList,userId])
    async function VessalChange(value) {
       if (value == "Select") {
           setVessalNameError(true);
         } else {
           setVessalNameError(false);
         }
         setVessalNmae(value);
         const data = {
           user_id: userId,
           Vessal_Name: value.replaceAll("|", ",").split(",")?.[0],
           Vessal_No: value.replaceAll("|", ",").split(",")?.[1],
         };
         await authAxios
           .post(VessalFormData, data)
           .then((res) => {
             setVessalData(res.data);

             if(vehicleLoad == true){
             setVessalInfo((prev) => ({
               ...prev,
               be_No: "Select",
               be_NoError: false,
               wH_NAME: "Select",
              //  XBoeError: false,
              //  tank: "Select",
              //  Xboe:"Select",
               tankError: false,
               bl_No: "Select",
               bl_NoError: false,
             }));
            }
             else{
             setVehicleLoad(true)
             
            }
           })
           .catch((err) => showError(err.message));

    }
    return (
      <React.Fragment>
        <CustomPageHeader pageHeaderText="Vehicle Edit Form"/>
  
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 2 }} elevation={0}>
            <Stack
              spacing={2}
              direction={{ xs: "column", md: "row" }}
              sx={{ p: 2, pb: 0 }}
            >
                <CustomerDropDownTwo disabled={true} errorsCustomerName={errorsCustomerName} setErrorsCustomerName={setErrorsCustomerName} selectedCustomer={customerName} setSelectedCustomer={setCustomerName} />
                <PortDropDownTwo disabled={true} errorsPortName={errorsPortName} setErrorsPortName={setErrorsPortName} selectedPort={portName} setSelectedPort={setPortName} />

               
              <ProductDropDownTwo disabled={true} variant="outlined" errorsProduct={productError} setErrorsProduct={setProductError} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
            </Stack>
  
            {/* <Box sx={{ p: 0 }}>
            </Box> */}
  
            
            <Stack
            spacing={2}
            direction={{ xs: "row" }}
            sx={{
              p: 2,
              pb: 0,
              justifyContent: "start",
              borderWidth: 1,
              borderColor: "black",
            }}
            >
               {/* <Box sx={{ width: "50%" }}> */}
<TextField
                fullWidth
                size="small"
                id="SoNo"
                type="number"
                variant="standard"
                name="SoNo"
                label="So No."
                error={errorSoNo}
                helperText={errorSoNo}
                value={soNo}
                onChange={(e) =>{
                  let value=e.target.value;
                  if(value == 0){
                    seterrorSoNo("So No value is required")
                  }else if(value < 0){
                    seterrorSoNo("So No value can not be negative")
                  }
                  else {
                     seterrorSoNo("");
                  }
                  setSoNo(e.target.value)}}
              />
              {/* </Box> */}
              <FormControl variant="standard"  fullWidth size='small' error={vessalNameError}>
                 <InputLabel id="demo-simple-select-label">Voyage name</InputLabel>
                <Select 
                label="Voyage name"
                value={vessalName }
                onChange={(e)=>VessalChange(e.target.value)}  >
                 <MenuItem  value={"Select"}>Please Select</MenuItem>
                {vessalList.map(data=>(
                  <MenuItem key={data.vesselName_List}  value={data.vesselName_List}>{data.vesselName_List}</MenuItem>
                ))}
                </Select>
                {vessalNameError && <FormHelperText>Voyage name is required</FormHelperText>}
                </FormControl>
                 <FormControl variant="standard"  fullWidth size='small' error={vessalInfo.be_NoError}>
                 <InputLabel id="demo-simple-select-label">IN -BOE</InputLabel>
                <Select 
                label="BOE No"
                value={vessalInfo.be_No }
                onChange={(e)=>{
                let value=e.target.value;
                if(value == "Select"){
                  setVessalInfo((prev)=>({...prev,be_NoError:true}));
                }else{
                  setVessalInfo((prev)=>({...prev,be_NoError:false})); 
                }
                setVessalInfo((prev)=>({...prev,be_No:value}))
                } } >
                 <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                {vessalData[0]?.v_BE?.map((item, index) => (
                                    <MenuItem key={`${item.bl}${index}`} value={item?.bl}>
                                      {item?.bl}
                                    </MenuItem>
                                  ))}
                </Select>
                {vessalInfo.be_NoError && <FormHelperText>IN-BOE No is required</FormHelperText>}
                </FormControl>
                 {/* <FormControl variant="standard" fullWidth size='small' error={vessalInfo.bl_NoError}>
                 <InputLabel id="demo-simple-select-label">Bl No</InputLabel>
                <Select 
                label="Bl No"
                value={vessalInfo.bl_No }
                onChange={(e)=>{
                  let value=e.target.value;
                  if(value == "Select"){
                    setVessalInfo((prev)=>({...prev,bl_NoError:true}))
                  }else {
                    setVessalInfo((prev)=>({...prev,bl_NoError:false}))
                  }
                  setVessalInfo((prev)=>({...prev,bl_No:value}))}}  >
                 <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                {vessalData?.bl_No.map((data,index)=>(
                  <MenuItem key={`${data?.view_List}${index}`}  value={data?.view_List}>{data?.view_List}</MenuItem>
                ))}
                </Select>
                {vessalInfo.bl_NoError && <FormHelperText>Bl No is required</FormHelperText> }
                </FormControl> */}
            </Stack>
            <Stack
            spacing={2}
            direction={{ xs: "row" }}
            sx={{
              p: 2,
              pb: 0,
              justifyContent: "start",
              borderWidth: 1,
              borderColor: "black",
            }}
            >
              <TextField
                fullWidth
                size="small"
                variant="standard"
                margin="normal"
                id="Remark"
                name="Remark"
                label="Remark"
                multiline
                rows={1}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
               <FormControl  variant="standard" fullWidth size='small' error={vessalInfo.tankError}>
                 <InputLabel id="demo-simple-select-label">tank Name</InputLabel>
                <Select 
                label="tank | WareHouse Name"
                value={vessalInfo.tank?.trim() }
                onChange={(e)=>{
                  let value=e.target.value;
                  if(value == "Select"){
                    setVessalInfo((prev)=>({...prev,tankError:true}))
                  }else{
                    setVessalInfo((prev)=>({...prev,tankError:false}))
                  }
                  setVessalInfo((prev)=>({...prev,tank:e.target.value}))}}  >
                 <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                {vessalData[0]?.v_BE
                   .filter(item => item.bl === vessalInfo.be_No)
                   .flatMap(item =>
                     (item.wH_Name_Tank_Name || []).map((tank, index) => (
                       <MenuItem
                         key={`${tank.wH_Name_Tank_Name}-${index}`}
                         value={tank.wH_Name_Tank_Name}
                       >
                         {tank.wH_Name_Tank_Name}
                       </MenuItem>
                     ))
                   )}
                </Select>
                {vessalInfo.tankError && <FormHelperText>tank is required</FormHelperText>}
                </FormControl>
                {/* {vessalData.length !== 0 && <FormControl variant="standard" fullWidth size='small' error={vessalInfo.wH_NAMEError}>
                 <InputLabel id="demo-simple-select-label">WareHouse Name</InputLabel>
                <Select 
                label="WareHouse Name"
                value={vessalInfo.wH_NAME.trim() }
                onChange={(e)=>{
                  let value=e.target.value;
                  if(value == "Select"){
                    setVessalInfo((prev)=>({...prev,wH_NAMEError:true}))
                  }
                  else{
                    setVessalInfo((prev)=>({...prev,wH_NAMEError:false}))
                  }
                  setVessalInfo((prev)=>({...prev,wH_NAME:value}))}}  >
                 <MenuItem disabled value={"Select"}>Please Select</MenuItem>
               
                 {vessalData[0]?.v_BE
                   .filter(item => item.bl === vessalInfo.be_No)
                   .flatMap(item =>
                     (item.wH_Name_Tank_Name || []).map((ware, index) => (
                       <MenuItem
                         key={`${ware.wH_Name_Tank_Name}-${index}`}
                         value={ware.wH_Name_Tank_Name
                           ?.replaceAll("|", ",")
                           ?.split(",")?.[0]}
                       >
                         {ware.wH_Name_Tank_Name
                           ?.replaceAll("|", ",")
                           ?.split(",")?.[0]}
                       </MenuItem>
                     ))
                   )}
                
                </Select>
                {vessalInfo.wH_NAMEError && <FormHelperText>WareHouse is required</FormHelperText>}
                </FormControl>} */}
                {/* {vessalData.length !== 0 &&  */}
                {/* <FormControl variant="standard" fullWidth size='small' margin="normal" error={vessalInfo.XBoeError}>
                                             <InputLabel id="demo-simple-select-label">Xboe name</InputLabel>
                                             <Select 
                                            label="Xboe name"
                                            value={vessalInfo.Xboe }
                                            onChange={(e)=>{
                                              let value=e.target.value;
                                              if(value == "Select"){
                                                setVessalInfo((prev)=>({...prev,XBoeError:true}))
                                              }
                                              else{
                                                setVessalInfo((prev)=>({...prev,XBoeError:false}))
                                              }
                                              setVessalInfo((prev)=>({...prev,Xboe:value}))}}  >
                                                <MenuItem disabled value={"Select"}>Please Select</MenuItem>
                                               
                 {vessalData[0]?.v_BE
                  .filter(item => item.bl === vessalInfo.be_No)
                  .flatMap(item =>
                    (item.exboe || []).map((tank, index) => (
                      <MenuItem
                        key={`${tank.exboe}-${index}`}
                        value={tank.exboe}
                      >
                        {tank.exboe}
                      </MenuItem>
                    ))
                  )}</Select> 
                                            {vessalInfo.XBoeError && <FormHelperText>Xboe name required</FormHelperText>}
                                            </FormControl> }  */}
            </Stack>
            {fields.map((field, index) => (
              <Stack
                key={index}
                spacing={2}
                direction={{ xs: "row" }}
                sx={{
                  p: 2,
                  // pb: 0,
                  justifyContent: "start",
                  borderWidth: 1,
                  borderColor: "black",
                }}
              >
                <Box sx={{ width: "50%" }}>
  <TextField
    fullWidth
    size="small"
    variant="standard"
    label="Vehicle Name"
    id={`Vehicle_Name_${index}`}
    value={field.vehicleName}
    error={!!field.vehicleNameError}
    helperText={field.vehicleNameError}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value.trim() === "") {
        newFields[index].vehicleNameError = "Vehicle Name is required";
      } else {
        newFields[index].vehicleNameError = "";
      }

      newFields[index].vehicleName = value;
      setFields(newFields);
    }}
    // sx={{ px: 2 }}
  />
</Box>

<Box sx={{ width: "50%" }}>
  <TextField
    fullWidth
    size="small"
    label="Provision Quantity"
    variant="standard"
    id={`Quantity_${index}`}
    type="number"
    value={field.quantity}
    error={!!field.quantityError}
    helperText={field.quantityError}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value === "" || Number(value) === 0) {
        newFields[index].quantityError = "Provision Quantity is required";
      } else if (Number(value) < 0) {
        newFields[index].quantityError = "Provision Quantity cannot be negative";
      } else {
        newFields[index].quantityError = "";
      }

      newFields[index].quantity = value;
      setFields(newFields);
    }}
  />
</Box>
<Box sx={{ width: "50%" }}>
<TextField
                fullWidth
                size="small"
                id="ActualQuantity"
                type="number"
                variant="standard"
                name="ActualQuantity"
                label="Actual Quantity"
                error={errorActQut}
                helperText={errorActQut}
                value={actualQuantity}
                onChange={(e) => {
                  let value=e.target.value;
                  if(value == 0){
                    // seterrorActQut("Actual Quantity value is required")
                  }else if(value < 0){
                    seterrorActQut("Actual Quantity value can not be negative")
                  }
                  else {
                     seterrorActQut("");
                  }
                  setActQuantity(e.target.value)}}
              />
              </Box>
<Box sx={{ width: "50%" }}>
  <TextField
    fullWidth
    size="small"
    label="Transporter Name"
    variant="standard"
    id={`Transporter_Name_${index}`}
    value={field.transporter}
    error={!!field.transporterError}
    helperText={field.transporterError}
    onChange={(e) => {
      const newFields = [...fields];
      const value = e.target.value;

      if (value.trim() === "") {
        newFields[index].transporterError = "Transporter Name is required";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        newFields[index].transporterError = "Only letters and spaces allowed";
      } else {
        newFields[index].transporterError = "";
      }

      newFields[index].transporter = value;
      setFields(newFields);
    }}
  />
</Box>

              </Stack>
            ))}
      <Stack
               
                spacing={2}
                direction={{ xs: "row" }}
                sx={{
                  p: 2,
                  pb: 0,
                  justifyContent: "end",
                  borderWidth: 1,
                  borderColor: "black",
                  textTransform:"capitalize"
                }}
                >
           
            <Button sx={{textTransform:"capitalize"}} onClick={handleReset}  variant="contained" color="error"type="button">
                Cancel
              </Button>
              <Button sx={{textTransform:"capitalize"}} variant="contained" color="success" type="submit">
                Submit
              </Button>
            
            </Stack>
          </Paper>
        </form>
        {custAlert && (
        <CustomeAlerts type={custAlert.type} message={custAlert.message} onClose={handleClose} />
      )}
      </React.Fragment>
    );
  }
  