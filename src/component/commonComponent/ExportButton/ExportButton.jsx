import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function ExportButton({ onExport, exporting }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
      <Button
        variant="contained"
        color="success"
        onClick={onExport}
        startIcon={
          exporting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        disabled={exporting}
        sx={{ textTransform: "none", fontWeight: 500 }}
      >
        {exporting ? "Exporting..." : "Export Data"}
      </Button>
    </Box>
  );
}
