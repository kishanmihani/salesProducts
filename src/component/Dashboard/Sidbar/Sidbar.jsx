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
import { MdCancel } from "react-icons/md";
import { FaChevronRight, FaChevronDown } from "react-icons/fa6";
import logouticon from "../../../assets/logouticon.png";
import logo from "../../../assets/sale.jpg";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
const Sidbar = ({ message }) => {
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
        width: 250,
        bgcolor: "#1a1a2e",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top header with close and heading */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* <IconButton onClick={hideSidebar} sx={{ color: 'white' }}>
          <MdCancel />
        </IconButton> */}
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <img src={logo} style={{ width: "220px", height: "55px" }} />
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 1 }}>
        <ListItemButton
          sx={{ display: pagelist.includes("Sale_Form") ? "flex" : "none" }}
          component={NavLink}
          onClick={handleToggle}
          to="/dashboard/sales"
          selected={location.pathname === "/dashboard/sales"}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <TbSettings2 />
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
              sx={{ pl: 4 }} // nested indent
            >
              <ListItemIcon sx={{ color: "white" }}>
                {" "}
                {location.pathname === "/dashboard/sales" ? (
                  <RadioButtonCheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  ></RadioButtonCheckedIcon>
                ) : (
                  <RadioButtonUncheckedIcon
                    style={{ height: 17, width: 17, mr: 2 }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: "13px" }}
                primary="Sales Request Form"
              />
            </ListItemButton>

          
          </List>
        </Collapse>
        {/* <ListItemButton
          component={NavLink}
          to="/dashboard/Productlist"
          selected={location.pathname.includes("/dashboard/Productlist")}
        >
          <ListItemIcon sx={{ color: 'white' }}><LiaProductHunt /></ListItemIcon>
          <ListItemText primary="Product" />
          <FaChevronRight />
        </ListItemButton> */}
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
