import React, { useState, useEffect } from "react";
import CustomPageHeader from "../commonComponent/CustomPageHeader/CustomPageHeader";
import { SoApprovalapi, soVhicledetails } from "../Config/Api/Api";
import { authAxios } from "../utils/authAxios";
import formatDateToUS from "../utils/DateFormate";
import {
  Box,
  Button,
  Collapse,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setObject } from "../features/sodetails";
import { toast, ToastContainer } from "react-toastify";
import { parseISO, isWithinInterval, parse } from "date-fns";

export default function SoApproval() {
  const [openRow, setOpenRow] = useState(null);
  const [sodata, setSodata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [dataCheck, setDataCheck] = useState(true);
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("sO_Date");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data from API
  useEffect(() => {
    if (dataCheck) {
      authAxios
        .post(SoApprovalapi, JSON.stringify({ user_id: userId }))
        .then((res) => {
          setSodata(res.data);
          setFilteredData(res.data);
        })
        .catch((err) => console.log(err?.message));
      setDataCheck(false);
    }
  }, [userId, dataCheck]);

  // 🔹 Handle sorting
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // 🔹 Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];
    if (orderBy.toLowerCase().includes("date")) {
      const dateA = new Date(valA);
      const dateB = new Date(valB);
      return orderDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (!isNaN(valA) && !isNaN(valB)) {
      return orderDirection === "asc" ? valA - valB : valB - valA;
    }
    return orderDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // 🔹 Date Filter Logic
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both From and To dates");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const filtered = sodata.filter((item) => {
  // Parse your item date correctly
  const itemDate = parse(item.sO_Date, "MM/dd/yyyy hh:mm:ss a", new Date());

  // Parse from/to dates (assuming they're in 'yyyy-MM-dd' format from input type="date")
  const startDate = parse(fromDate, "yyyy-MM-dd", new Date());
  const endDate = parse(toDate, "yyyy-MM-dd", new Date());

  return isWithinInterval(itemDate, { start: startDate, end: endDate });
});
      console.log(filtered);
      setFilteredData(filtered);
      setLoading(false);
    }, 600);
  };

  const clearFilter = () => {
    setFromDate("");
    setToDate("");
    setFilteredData(sodata);
  };

  return (
    <React.Fragment>
      <CustomPageHeader pageHeaderText="So Approval Form" />
      <div style={{ width: "96%", margin: "auto", marginBlock: "5px" }}>
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
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleFilter}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Filter"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={clearFilter}>
              Clear
            </Button>
          </Box>
        </Paper>

        <Paper elevation={0}>
          <TableContainer>
            <Table>
              {/* 🔹 Table Header */}
              <TableHead
                sx={{
                  fontWeight: 500,
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                }}
              >
                <TableRow>
                  {[
                    { label: "So Date", key: "sO_Date" },
                    { label: "Name", key: "c_Name" },
                    { label: "V_Date", key: "v_Date" },
                    { label: "So No", key: "sO_N0" },
                    { label: "So Qty", key: "so_Qty" },
                    { label: "A/C_Qty", key: "a_Out_Qty" },
                    { label: "B_Qty", key: "bal_Qty" },
                    { label: "PMT", key: "r_PMT" },
                    { label: "Port", key: "port" },
                    { label: "Type", key: "payment_Type" },
                    { label: "Remark", key: "remark" },
                    { label: "Add Vehicle", key: "" },
                    { label: "Actions", key: "" },
                  ].map((col) => (
                    <TableCell
                      key={col.key || col.label}
                      align="left"
                      sx={{ fontSize: 12, whiteSpace: "nowrap" }}
                    >
                      {col.key ? (
                        <TableSortLabel
                          active={orderBy === col.key}
                          direction={orderBy === col.key ? orderDirection : "asc"}
                          onClick={() => handleSortRequest(col.key)}
                        >
                          {col.label}
                          {orderBy === col.key ? (
                            <Box component="span" sx={visuallyHidden}>
                              {orderDirection === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </Box>
                          ) : null}
                        </TableSortLabel>
                      ) : (
                        col.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* 🔹 Table Body */}
              <TableBody>
                {sortedData?.length > 0 ? (
                  sortedData.map((data, index) => (
                    <SodataRow
                      key={index}
                      data={data}
                      isOpen={openRow === data.sO_N0}
                      setOpenRow={setOpenRow}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        "No records found for selected date range"
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
}

// ============================================================
// 🔹 Child Component (SodataRow)
// ============================================================
function SodataRow({ data, isOpen, setOpenRow }) {
  const [vehicle_head] = useState([
    "Vehicle Name",
    "Planned Qty",
    "Actual Qty",
    "BOE No",
    "Transporter Name",
    "Tank Name",
    "Warehouse Name",
    "Port Name",
    "Vessel Name",
    "Vessel No",
    "Status",
    "Remark",
  ]);
  const [innerData, setInnerData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  const AddVehicle = (row) => {
    const today = new Date();
    const vDate = new Date(row?.v_Date);

    if (row?.bal_Qty <= 0) {
      toast.info("⚠️ Balance quantity is Negative");
    } else if (vDate < today) {
      toast.info(`⚠️ Validity date expired on: ${formatDateToUS(row?.v_Date)}`);
    } else {
      dispatch(setObject(row));
      navigate(`/dashboard/Logistic/logistic_Request_form`);
    }
  };

  const handleToggle = async () => {
    if (isOpen) {
      setOpenRow(null);
    } else {
      setOpenRow(data.sO_N0);
      try {
        const res = await authAxios.post(soVhicledetails, {
          user_id: userId,
          So_No: data?.sO_N0,
        });
        setInnerData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const today = new Date();
  const vDate = new Date(data?.v_Date);
  const isExpired = vDate < today;

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: isExpired
            ? "rgba(245, 143, 103, 0.1)" // expired redish
            : "rgba(114, 227, 131, 0.1)", // valid greenish
        }}
      >
        <TableCell>
          {data?.sO_Date
            ? new Date(data.sO_Date).toLocaleDateString("en-GB")
            : ""}
        </TableCell>

        <TableCell>{data?.c_Name}</TableCell>
        <TableCell>
          {data?.v_Date
            ? new Date(data.v_Date).toLocaleDateString("en-GB")
            : ""}
        </TableCell>
        <TableCell>{data?.sO_N0}</TableCell>
        <TableCell>{data?.so_Qty}</TableCell>
        <TableCell>
          {data?.a_Out_Qty}/{data?.a_Count}
        </TableCell>
        <TableCell>{data?.bal_Qty}</TableCell>
        <TableCell>{data?.r_PMT}</TableCell>
        <TableCell>{data?.port}</TableCell>
        <TableCell>{data?.payment_Type}</TableCell>
        <TableCell>{data?.remark}</TableCell>

        <TableCell>
          <Button
            variant="outlined"
            sx={{
              p: 1,
              width: 150,
              fontSize: "12px",
              borderRadius: 6,
              textTransform: "capitalize",
            }}
            disabled={data?.v_flg === "0" ? false : true}
            color="success"
            onClick={() => AddVehicle(data)}
          >
            <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
            Add Vehicle data
          </Button>
        </TableCell>

        <TableCell>
          <Button
            onClick={handleToggle}
            color={!isOpen ? "primary" : "error"}
            variant="outlined"
          >
            {!isOpen ? "Open" : "Close"}
          </Button>
        </TableCell>
      </TableRow>

      {/* 🔹 Inner Table */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <TableContainer component={Paper} sx={{ overflow: "auto" }}>
                <Table size="small">
                  <TableHead
                    sx={{
                      bgcolor: "rgba(240, 114, 223, 0.08)",
                    }}
                  >
                    <TableRow>
                      {vehicle_head.map((head, index) => (
                        <TableCell
                          key={index}
                          sx={{ fontSize: 13, fontWeight: 600 }}
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {innerData?.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row?.vehicle_Name}</TableCell>
                        <TableCell>{row?.p_Qty}</TableCell>
                        <TableCell>{row?.a_Qty}</TableCell>
                        <TableCell>{row?.bE_No}</TableCell>
                        <TableCell>{row?.transporter_Name}</TableCell>
                        <TableCell>{row?.tank_name}</TableCell>
                        <TableCell>{row?.warehouse_name}</TableCell>
                        <TableCell>{row?.port_Name}</TableCell>
                        <TableCell>{row?.vessel_Name}</TableCell>
                        <TableCell>{row?.vessel_No}</TableCell>
                        <TableCell>{row?.status_name}</TableCell>
                        <TableCell>{row?.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </List>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
