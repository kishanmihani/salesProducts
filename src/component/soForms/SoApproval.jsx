import React, { useState, useEffect } from "react";
import CustomPageHeader from "../commonComponent/CustomPageHeader/CustomPageHeader";
import { SoApprovalapi, soVhicledetails } from "../Config/Api/Api";
import { authAxios } from "../utils/authAxios";
import formatDateToUS from "../utils/DateFormate";
import { IoSearchSharp } from "react-icons/io5";
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

import { parse, isWithinInterval } from "date-fns";
import SearchInput from "../commonComponent/SearchInput/SearchInput";

export default function SoApproval() {
  const [openRow, setOpenRow] = useState(null);
  const [sodata, setSodata] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);
  const [dataCheck, setDataCheck] = useState(true);

  const [orderDirection, setOrderDirection] = useState("desc");
  const [orderBy, setOrderBy] = useState("sO_Date");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch SO Data
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

  // =============================================================
  // 🔍 LIVE SEARCH (SO NO + CUSTOMER NAME)
  // =============================================================
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredData(sodata);
      return;
    }

    const result = sodata.filter(
      (row) =>
        String(row?.sO_N0).toLowerCase().includes(searchText.toLowerCase()) ||
        String(row?.c_Name).toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredData(result);
  }, [searchText, sodata]);

  // =============================================================
  // 🔹 SORTING LOGIC
  // =============================================================
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    if (orderBy.toLowerCase().includes("date")) {
      return orderDirection === "asc"
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    // numeric sort
    if (!isNaN(valA) && !isNaN(valB)) {
      return orderDirection === "asc" ? valA - valB : valB - valA;
    }

    // string sort
    return orderDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // =============================================================
  // 📅 DATE FILTER
  // =============================================================
  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select both From and To dates");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const filtered = sodata.filter((item) => {
        const itemDate = parse(item.sO_Date, "MM/dd/yyyy hh:mm:ss a", new Date());
        const start = parse(fromDate, "yyyy-MM-dd", new Date());
        const end = parse(toDate, "yyyy-MM-dd", new Date());

        return isWithinInterval(itemDate, { start, end });
      });

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
    <>
      <CustomPageHeader pageHeaderText="So Approval Form" />

      <div style={{ width: "96%", margin: "auto" }}>
        {/* ---------------------------------------------------------
            🔎 LIVE SEARCH INPUT
        --------------------------------------------------------- */}
        <SearchInput
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="Search by SO No or Customer Name"
/>


        {/* ---------------------------------------------------------
            📅 DATE FILTER UI
        --------------------------------------------------------- */}
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
              disabled={loading}
              onClick={handleFilter}
            >
              {loading ? <CircularProgress size={20} /> : "Filter"}
            </Button>

            <Button variant="outlined" onClick={clearFilter}>
              Clear
            </Button>
          </Box>
        </Paper>

        {/* ---------------------------------------------------------
            MAIN TABLE
        --------------------------------------------------------- */}
        <Paper elevation={0}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "rgba(25,118,210,0.08)" }}>
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
                    <TableCell key={col.key || col.label}>
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

              <TableBody>
                {sortedData.length ? (
                  sortedData.map((data) => (
                    <SodataRow
                      key={data.sO_N0}
                      data={data}
                      isOpen={openRow === data.sO_N0}
                      setOpenRow={setOpenRow}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      {loading ? <CircularProgress /> : "No records found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>

      <ToastContainer />
    </>
  );
}

/* ============================================================
   CHILD COMPONENT: ROW + COLLAPSE
============================================================ */
function SodataRow({ data, isOpen, setOpenRow }) {
  const [innerData, setInnerData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userId] = useState(JSON.parse(sessionStorage.getItem("userInfo"))?.id);

  const AddVehicle = (row) => {
    const today = new Date();
    const vDate = new Date(row?.v_Date);

    today.setHours(0, 0, 0, 0);
    vDate.setHours(0, 0, 0, 0);

    if (row?.bal_Qty <= 0) {
      toast.info("⚠ Balance quantity is Negative");
    } else if (vDate < today) {
      toast.info(`⚠ Validity expired on: ${formatDateToUS(row?.v_Date)}`);
    } else {
      dispatch(setObject(row));
      navigate(`/dashboard/Logistic/logistic_Request_form`);
    }
  };

  const handleToggle = async () => {
    if (isOpen) {
      setOpenRow(null);
      return;
    }

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
  };

  //const isExpired = new Date(data?.v_Date) < new Date();

const today = new Date(); 
const vDate = new Date(data?.v_Date);
 today.setHours(0, 0, 0, 0);
 vDate.setHours(0, 0, 0, 0); 
const isExpired = vDate < today;


  return (
    <>
      {/* ------- MAIN ROW ------- */}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          bgcolor: isExpired
            ? "rgba(245, 143, 103, 0.1)"
            : "rgba(114, 227, 131, 0.1)",
        }}
      >
        <TableCell>
          {formatDateToUS(data?.sO_Date)}
        </TableCell>

        <TableCell>{data?.c_Name}</TableCell>

        <TableCell>
          {formatDateToUS( data?.v_Date)}
            
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
            disabled={data?.v_flg !== "0"}
            color="success"
            onClick={() => AddVehicle(data)}
            sx={{ p: 1, width: 150, fontSize: 12 }}
          >
            <AddCircleOutlineOutlinedIcon sx={{ mr: 1 }} />
            Add Vehicle Data
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

      {/* ------- COLLAPSE ROW ------- */}
      <TableRow>
        <TableCell colSpan={16} sx={{ p: 0 }}>
          <Collapse in={isOpen} unmountOnExit>
            <List disablePadding>
              <TableContainer sx={{ maxHeight: 350 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "rgba(240,114,223,0.08)" }}>
                    <TableRow>
                      {[
                        "Vehicle Name",
                        "Planned Qty",
                        "Actual Qty",
                        "BOE No",
                        "Transporter",
                        "Tank",
                        "Warehouse",
                        "Port",
                        "Vessel Name",
                        "Vessel No",
                        "Status",
                        "Remark",
                      ].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 600 }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {innerData.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.vehicle_Name}</TableCell>
                        <TableCell>{row.p_Qty}</TableCell>
                        <TableCell>{row.a_Qty}</TableCell>
                        <TableCell>{row.bE_No}</TableCell>
                        <TableCell>{row.transporter_Name}</TableCell>
                        <TableCell>{row.tank_name}</TableCell>
                        <TableCell>{row.warehouse_name}</TableCell>
                        <TableCell>{row.port_Name}</TableCell>
                        <TableCell>{row.vessel_Name}</TableCell>
                        <TableCell>{row.vessel_No}</TableCell>
                        <TableCell>{row.status_name}</TableCell>
                        <TableCell>{row.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </List>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
