import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  TableContainer,
  TableHead,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CustomPageHeader from "../../component/commonComponent/CustomPageHeader/CustomPageHeader";
import { authAxios } from "../../component/utils/authAxios";
import formatDateToUS from "../../component/utils/DateFormate";

export default function BillDetails() {
  const [billList, setBillList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [billNumber, setBillNumber] = useState("");
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userId = JSON.parse(sessionStorage.getItem("userInfo"))?.id;

  // ✅ Fetch Bill List (reusable)
  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await authAxios.post(
        "BituRep/Api/Account/Account_bill_List",
        JSON.stringify({ user_id: userId })
      );
      setBillList(res.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchBills();
  }, [userId]);

  // ✅ Handle Edit Click
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setBillNumber("");
    setOpen(true);
  };

  // ✅ Update Bill API
  const handleUpdateBill = async () => {
    if (!billNumber.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a Bill number.",
        severity: "warning",
      });
      return;
    }

    setUpdating(true);
    try {
      const res = await authAxios.post(
        "BituRep/Api/Account/Account_bill_Update",
        JSON.stringify({
          user_id: userId,
          Table_id: selectedRow.table_id,
          Bill: billNumber,
        })
      );

      if (res.data && res.data[0]?.massage === "Bill updated") {
        setSnackbar({
          open: true,
          message: `Bill ${billNumber} updated successfully!`,
          severity: "success",
        });

        // ✅ Close popup
        setOpen(false);

        // ✅ Refresh the table after update
        await fetchBills();
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update bill.",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error updating bill:", err);
      setSnackbar({
        open: true,
        message: "Something went wrong.",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Status Chip
  const getStatusChip = (status) => {
    switch (status) {
      case "Rec":
        return (
          <Chip
            label="Rec"
            color="success"
            variant="filled"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      case "TTC":
        return (
          <Chip
            label="TTC"
            color="warning"
            variant="filled"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      case "CP":
        return (
          <Chip
            label="CP"
            color="primary"
            variant="filled"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      default:
        return (
          <Chip
            label={status || "Unknown"}
            color="default"
            variant="outlined"
            size="small"
          />
        );
    }
  };

  return (
    <Box sx={{ mx: "auto", mt: 1 }}>
      <CustomPageHeader pageHeaderText="Bill Details" />
      <Paper sx={{ p: 2 }} elevation={0}>
        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : billList.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>
            No records found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "rgba(25,118,210,0.08)" }}>
                <TableRow>
                  <TableCell><b>Customer Name</b></TableCell>
                  <TableCell><b>Port Name</b></TableCell>
                  <TableCell><b>Vehicle Name</b></TableCell>
                  <TableCell><b>Transporter Name</b></TableCell>
                  <TableCell><b>Tank Name</b></TableCell>
                  {/* <TableCell><b>Table ID</b></TableCell> */}
                  <TableCell><b>Entry Date</b></TableCell>
                  <TableCell>So No</TableCell>
                  <TableCell><b>Bill Number</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell align="center"><b>Action</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {billList.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.customer_Name}</TableCell>
                    <TableCell>{row.port_Name}</TableCell>
                    <TableCell>{row.vehicle_Name}</TableCell>
                    <TableCell>{row.transporter_Name}</TableCell>
                    <TableCell>{row.tank_name}</TableCell>
                    {/* <TableCell>{row.table_id}</TableCell> */}
                    <TableCell>{formatDateToUS( row.entry_Date)}</TableCell>
                    <TableCell>{row.so_No}</TableCell>
                    <TableCell>{row.bill || "-"}</TableCell>
                    <TableCell>{getStatusChip(row.status_name)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(row)}
                      >
                        <EditIcon sx={{ color: "black" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ✅ Dialog Popup */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Bill Number</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter Bill Number"
            variant="outlined"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateBill}
            disabled={updating}
          >
            {updating ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
