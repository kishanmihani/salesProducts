import React, { useState } from "react";
import { Tabs, Tab, Box, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "14px",
  color: "#555",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    backgroundColor: "#f0f0ff",
    borderRadius: "10px",
  },
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

