import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { CgSearch } from "react-icons/cg";
import { FaHandsClapping } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { Outlet, useNavigate } from "react-router";
import Sidbar from "./Sidbar/Sidbar";
import ErrorBoundary from "../ErrorBoundary";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
const drawerWidth = 270;

// Styled components
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f1f3f4",
  marginLeft: theme.spacing(2),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  position: "absolute",
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#6e6e6e",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  width: "100%",
}));

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notmobileOpen, setNotMobileOpen] = useState(true);
  const navigate = useNavigate();
  const [userInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
  useEffect(() => {
    if (userInfo?.message !== "login successfull") {
      navigate("/");
    }
  }, [userInfo?.message]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Sidbar message={[userInfo]} />
    </Box>
  );

  return (
    <ErrorBoundary>
      <Box sx={{ display: "flex", width: "100%" }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            width: {
              sm: notmobileOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            },
            ml: {
              sm: notmobileOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            },
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                {mobileOpen? <MenuOpenIcon /> : <RxHamburgerMenu />}
              </IconButton>
            )}
            {!isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={()=>setNotMobileOpen(!notmobileOpen)
                }
                sx={{ mr: 2 }}
              >
              {notmobileOpen? <MenuOpenIcon /> : <RxHamburgerMenu />} 
              </IconButton>
            )}
            <Typography
              variant="h6"
              style={{ width: "100%" }}
              noWrap
              component="div"
            >
              Hello {userInfo?.login}{" "}
              <FaHandsClapping style={{ marginLeft: "8px" }} />
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {/* <Search>
              <SearchIconWrapper>
                <CgSearch />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search> */}
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          
          sx={{ width: {xs: 0,
            sm: notmobileOpen ? drawerWidth : 0 }}}
          aria-label="sidebar navigation"
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop Drawer */}
          <Drawer
            variant="persistent"
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth,overflow:"auto",overflowX:"hidden" },
            }}
            open={notmobileOpen}
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 1,
            pb: 0,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: 7,
            height: "calc(100vh - 80px)",
            overflow: "auto",
          }}
          className="custom-scrollbar-css"
        >
          <Outlet />
        </Box>
      </Box>
    </ErrorBoundary>
  );
}

export default React.memo(Dashboard);
