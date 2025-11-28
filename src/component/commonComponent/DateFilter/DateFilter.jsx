import React from "react";
import { Paper, Typography, Box, TextField, Button, CircularProgress } from "@mui/material";

export default function DateFilter({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  loading,
  onFilter,
  onClear
}) {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 1 }}>
      <Typography fontWeight={600} mb={1}>
        Date Filter:
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          type="date"
          label="From Date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          type="date"
          label="To Date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <Button variant="contained" disabled={loading} onClick={onFilter}>
          {loading ? <CircularProgress size={20} /> : "Filter"}
        </Button>

        <Button variant="outlined" onClick={onClear}>
          Clear
        </Button>
      </Box>
    </Paper>
  );
}
