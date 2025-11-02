import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
} from "@mui/material";
import { useNavigate, useLocation, NavLink } from "react-router";
import { TbSettings2 } from "react-icons/tb";
import { LiaProductHunt } from "react-icons/lia";
import { MdCancel, MdRadioButtonUnchecked } from "react-icons/md";
import { FaChevronRight, FaChevronDown, FaFileExport } from "react-icons/fa6";
import logouticon from "../../../assets/logouticon.png";
import logo from "../../../assets/sale.jpg";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { GrMoney } from "react-icons/gr";
import ContactsIcon from '@mui/icons-material/Contacts';
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
const Sidbar = ({ message}) => {
  let pagelist = [];
  let pageView = message?.[0]?.pageView;
  for (let key of pageView) {
    
    if (key.value !== "") {
      pagelist.push(key.page_Name);
      console.log(key.page_Name)
    }
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = message?.[0];
  const [openModules, setOpenModules] = useState({
  sales: false,
  logistic: false,
  account: false,
  mangement:true
});
const toggleModule = (key) => {
  setOpenModules((prev) => {
    const newState = Object.keys(prev).reduce((acc, currKey) => {
      acc[currKey] = currKey === key ? !prev[key] : false;
      return acc;
    }, {});
    return newState;
  });
}

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <Box
      sx={{
        // width: 250,
        bgcolor: "white",
        color: "#756f6f",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow:"hidden"
      }}
    >
      {/* Top header with close and heading */}
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" sx={{ margin:"auto", marginBottom:0,display: "flex", alignItems: "center",justifyContent:"center" }}>
          <img src={logo} style={{ width: "140px", height: "50px" }} />
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1,marginTop:-1 }}>
        <ListItemButton
          sx={{ display: pagelist.includes("Sale_Modual") ? "flex" : "none" }}
          component={NavLink}
          onClick={() => toggleModule("sales")}
          to="/dashboard/sales"
          selected={location.pathname === "/dashboard/sales" || location.pathname.startsWith("/dashboard/sales")}
        >
          <ListItemIcon sx={{ color: "#756f6f",fontSize:22 }}>
          <RiMoneyDollarBoxFill  />
            {/* <img src={salesicon} width={20} alt="salesicon" /> */}
          </ListItemIcon>
          <ListItemText primary="Sales" />
          {openModules.sales ? <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>
        <Collapse in={openModules.sales} timeout="auto" unmountOnExit>
          <List component="div" Padding>
            <ListItemButton
              component={NavLink}
              to="/dashboard/sales/Sale_Registeration_Form"
              selected={location.pathname === "/dashboard/sales/Sale_Registeration_Form"}
              sx={{ pl: 4,display: pagelist.includes("Sale _Request_Form") ? "flex" : "none" }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/sales/Sale_Registeration_Form" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Sales Request Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/sales/PendingApprovalForm"
              selected={location.pathname === "/dashboard/sales/PendingApprovalForm"}
              sx={{ pl: 4,display: pagelist.includes("Pending_Approval_Form") ? "flex" : "none" }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/sales/PendingApprovalForm" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Pending Approval Form"
              />
            </ListItemButton>
            
            <ListItemButton
              component={NavLink}
              to="/dashboard/sales/ApprovalPendingForm"
              selected={location.pathname === "/dashboard/sales/ApprovalPendingForm"}
              sx={{ pl: 4,display: pagelist.includes("Approvel_Pending_Form") ? "flex" : "none" }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/sales/ApprovalPendingForm" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Approval Pending Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/sales/Approval_Request_form"
              selected={location.pathname === "/dashboard/sales/Approval_Request_form"}
              sx={{ pl: 4 ,display: pagelist.includes("Approvel_Request_Form") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/sales/Approval_Request_form" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Approval Request form"
              />
            </ListItemButton>
            
          
          </List>
        </Collapse>
    
         <ListItemButton
          sx={{display: pagelist.includes("Logistic_Modual") ? "flex" : "none"}}
          component={NavLink}
          onClick={() => toggleModule("logistic")}
          to="/dashboard/Logistic"
          selected={location.pathname.includes("/dashboard/Logistic")}
        >
          <ListItemIcon sx={{ color: '#756f6f' ,fontSize:22}}>
          <GrMoney />
            </ListItemIcon>
          <ListItemText primary="Logistic" />
         {openModules.logistic?  <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>
        <Collapse in={openModules.logistic} timeout="auto" unmountOnExit>
          <List component="div" Padding>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/logistic_Request_form"
              selected={location.pathname === "/dashboard/Logistic/logistic_Request_form"}
              sx={{ pl: 4 ,display:"none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/logistic_Request_form" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Vehicle Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/So_Approval"
              selected={location.pathname === "/dashboard/Logistic/So_Approval"}
              sx={{ pl: 4, display: pagelist.includes("So_Approvel") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/So_Approval" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="So Approval"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Logistic_Pending_form"
              selected={location.pathname === "/dashboard/Logistic/Logistic_Pending_form"}
              sx={{ pl: 4 ,display: pagelist.includes("Vehical_Pool") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/Logistic_Pending_form" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Vehicle Pool"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Vessal_Request_Form"
              selected={location.pathname === "/dashboard/Logistic/Vessal_Request_Form"}
              sx={{ pl: 4 ,display: pagelist.includes("Vessel_Form") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/Vessal_Request_Form" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Vessel Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Vessal_List"
              selected={location.pathname === "/dashboard/Logistic/Vessal_List"}
              sx={{ pl: 4,display: pagelist.includes("Vessel_List") ? "flex" : "none" }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/Vessal_List" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Vessel List"
              />
            </ListItemButton>
            {/* <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Pdf_Bill"
              selected={location.pathname === "/dashboard/Logistic/Pdf_Bill"}
              sx={{ pl: 4 }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/Pdf_Bill" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Logistic Invoice Bill"
              />
            </ListItemButton> */}
            {/* <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Logistic_InVoice_Delivery"
              selected={location.pathname === "/dashboard/Logistic/Logistic_InVoice_Delivery"}
              sx={{ pl: 4 }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic/Logistic_InVoice_Delivery" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "11.5px" }}
                primary="Logistic Invoice Delivery"
              />
            </ListItemButton> */}
          </List>
          </Collapse>
        <ListItemButton
          component={NavLink}
          onClick={() => toggleModule("account")}
          to="/dashboard/Account"
          selected={location.pathname.includes("/dashboard/Account")}
          sx={{display: pagelist.includes("Account_Modual") ? "flex" : "none"}}
        >
          <ListItemIcon sx={{ color: '#756f6f' ,fontSize:22}}>
          <ContactsIcon />
            </ListItemIcon>
          <ListItemText primary="Account" />
        {openModules.account ?  <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>
        <Collapse in={openModules.account} timeout="auto" unmountOnExit>
          <List component="div" Padding>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Account/Account_list"
              selected={location.pathname === "/dashboard/Account/Account_list"}
              sx={{ pl: 4 ,display: pagelist.includes("Account_List") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Account/Account_list" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Account List"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Account/ReciptFrom"
              selected={location.pathname === "/dashboard/Account/ReciptFrom"}
              sx={{ pl: 4,display: pagelist.includes("Recipt_Form") ? "flex" : "none" }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Account/ReciptFrom" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Receipt Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Account/CloserForm"
              selected={location.pathname === "/dashboard/Account/CloserForm"}
              sx={{ pl: 4 ,display: pagelist.includes("Closer_Form") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Account/CloserForm" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Closer Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Account/BillDetails"
              selected={location.pathname === "/dashboard/Account/BillDetails"}
              sx={{ pl: 4 ,display: pagelist.includes("Closer_Form") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Account/BillDetails" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Bill Details"
              />
            </ListItemButton>
      </List>
      </Collapse>
       <ListItemButton
          component={NavLink}
          onClick={() => toggleModule("mangement")}
          to="/dashboard/management"
          selected={location.pathname.includes("/dashboard/management")}
          // sx={{display: pagelist.includes("Account_Modual") ? "flex" : "none"}}
        >
          <ListItemIcon sx={{ color: '#756f6f' ,fontSize:22}}>
          <BsFillFileEarmarkSpreadsheetFill />
            </ListItemIcon>
          <ListItemText primary="Management" />
        {openModules.mangement ?  <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>
        <Collapse  in={openModules.mangement} timeout="auto" unmountOnExit>
        <List>
           <ListItemButton
              component={NavLink}
              to="/dashboard/management/report"
              selected={location.pathname === "/dashboard/management/report"}
              // sx={{ pl: 4 ,display: pagelist.includes("Closer_Form") ? "flex" : "none"}} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/management/report" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                  
                    style={{ height: 17, width: 17, mr: 2,color:"#756f6f" }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "12px" }}
                primary="Report" 
              />
            </ListItemButton>          
        </List>
        </Collapse>
      </List>      
     
      <Box sx={{ flexGrow: 1 }} />

      {/* Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={handleProfileClick}
        >
          <Avatar src={user?.userImg}>{user?.login?.charAt(0)}</Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">{user?.login}</Typography>
          </Box>
          <FaChevronDown style={{ marginLeft: "auto" }} />
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          PaperProps={{ sx: { mt: 1 } }}
        >
          <MenuItem onClick={Logout}>
            <img
              src={logouticon}
              alt="logout"
              width={20}
              style={{ marginRight: 10 }}
            />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default React.memo(Sidbar);
