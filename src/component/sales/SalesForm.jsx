import { Box } from "@mui/material";
import React from "react";
import SalesRestitration from "./salesRestitration";
export default function SalesForm() {
  return (
    <React.Fragment>
    <Box
      sx={{
        bgcolor: "#ffff",
        height: "100%",
        width: "100%",
        borderRadius: 2,
        overflow: "auto",
      }}
    >
      <SalesRestitration />
    </Box>
    </React.Fragment>
  );
}
