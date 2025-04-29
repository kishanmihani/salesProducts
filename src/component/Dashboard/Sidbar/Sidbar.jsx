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
} from "@mui/material";
import { useNavigate, useLocation, NavLink } from "react-router";
import { TbSettings2 } from "react-icons/tb";
import { LiaProductHunt } from "react-icons/lia";
import { MdCancel, MdRadioButtonUnchecked } from "react-icons/md";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import logouticon from "../../../assets/logouticon.png";
import logo from "../../../assets/sale.jpeg";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { GrMoney } from "react-icons/gr";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
const Sidbar = ({ message}) => {
  let pagelist = [];
  let pageView = message?.[0]?.pageView;
  for (let key of pageView) {
    if (key.value == "True") {
      pagelist.push(key.page_Name);
    }
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = message?.[0];
  const [open, setOpen] = useState(false);
  const [openLogistic,setOpenLogistic] = useState(false)
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // const hideSidebar = () => {
  //   const sidebar = document.getElementById('left-container');
  //   if (sidebar) sidebar.style.display = 'none';
  // };
  const handleToggle = () => {
    setOpen(!open);
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
          sx={{ display: pagelist.includes("Sale_Form") ? "flex" : "none" }}
          component={NavLink}
          onClick={handleToggle}
          to="/dashboard/sales"
          selected={location.pathname === "/dashboard/sales" || location.pathname.startsWith("/dashboard/sales")}
        >
          <ListItemIcon sx={{ color: "#756f6f",fontSize:22 }}>
          <RiMoneyDollarBoxFill  />
            {/* <img src={salesicon} width={20} alt="salesicon" /> */}
          </ListItemIcon>
          <ListItemText primary="Sales" />
          {open ? <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" Padding>
            <ListItemButton
              component={NavLink}
              to="/dashboard/sales"
              selected={location.pathname === "/dashboard/sales"}
              sx={{ pl: 4 }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/sales" ? (
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
              sx={{ pl: 4 }} 
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
              to="/dashboard/sales/Approval_Request_form"
              selected={location.pathname === "/dashboard/sales/Approval_Request_form"}
              sx={{ pl: 4 }} 
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
        {/* <ListItemButton
          sx={{ display: pagelist.includes("Sale_Form") ? "flex" : "none" }}
          component={NavLink}
          onClick={handleToggle}
          to="/dashboard/Log"
          selected={location.pathname === "/dashboard/sales"}
        >
          <ListItemIcon sx={{ color: "black" }}>
            <TbSettings2 />
          </ListItemIcon>
          <ListItemText primary="Sales" />
          {open ? <FaChevronDown /> : <FaChevronRight />}
        </ListItemButton>  */}
         <ListItemButton
          component={NavLink}
          onClick={()=>setOpenLogistic(!openLogistic)}
          to="/dashboard/Logistic"
          selected={location.pathname.includes("/dashboard/Logistic")}
        >
          <ListItemIcon sx={{ color: '#756f6f' ,fontSize:22}}>
          <GrMoney />
            {/* <img src={Logisticicon} width={20} alt="Logistic"></img> */}
            </ListItemIcon>
          <ListItemText primary="Logistic" />
          <FaChevronRight />
        </ListItemButton>
        <Collapse in={openLogistic} timeout="auto" unmountOnExit>
          <List component="div" Padding>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic"
              selected={location.pathname === "/dashboard/Logistic"}
              sx={{ pl: 4 }} 
            >
              <ListItemIcon color="#756f6f">
                {location.pathname === "/dashboard/Logistic" ? (
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
                primary="Vhicle Form"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Logistic_Pending_form"
              selected={location.pathname === "/dashboard/Logistic/Logistic_Pending_form"}
              sx={{ pl: 4 }} 
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
                primary="Vhicle Pull"
              />
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/dashboard/Logistic/Vessal_Request_Form"
              selected={location.pathname === "/dashboard/Logistic/Vessal_Request_Form"}
              sx={{ pl: 4 }} 
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
                primary="Vessal Form"
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
      </List>

      {/* Spacer to push profile section to the bottom */}
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
