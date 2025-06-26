import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../../utils/authAxios';
import { salesListApi } from '../../Config/Api';
export default function Saleslist() {
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
  const [userName] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.login);
  const [page, setPage] = React.useState(0); // current page
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // pagination slice
  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await authAxios.post(
          salesListApi,
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        );
      let  filterdata= response.data.filter(row => row.user_Name === userName )
        setTableData(filterdata);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckTableData(false);
      }
    };
  
    if (!checkTableData && tableData.length === 0) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId, userName]);
  return (
    <React.Fragment>
      <Box
        sx={{
          p: 1,
          position: "sticky",
          top: 0,
          bgcolor: "#ffff",
          borderBottom: 1,
          zIndex: 4,
          display: "flex",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            border: 1,
            borderColor: "#eee",
            width: 40,
            position: "relative",
          }}
        >
          <ArrowBackIcon width={90} color="#000" />
        </button>
        <Typography variant="h5" align="center" width="100%">
          &nbsp; Pending Approval Form
        </Typography>
      </Box>
      <Paper sx={{ p: 2 }} elevation={0}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
            <TableCell  className="table-th">Billing Name</TableCell>
            <TableCell align="left" className="table-th">Customer Name</TableCell>
            <TableCell align="left"className="table-th">Transporter Name</TableCell>
            <TableCell align="left"className="table-th">Transporter</TableCell>
            <TableCell align="left"className="table-th">Port Name</TableCell>
            <TableCell align="left"className="table-th">Gst</TableCell>
            <TableCell align="left"className="table-th">Payment Type</TableCell>
            <TableCell align="left"className="table-th">Product Name</TableCell>
            <TableCell align="left"className="table-th">Bitumens price</TableCell>
            <TableCell align="left"className="table-th">Quantity</TableCell>
            <TableCell align="left"className="table-th">Order Date</TableCell>
            <TableCell align="left"className="table-th">validity Date</TableCell>
            <TableCell align="left"className="table-th">validity Days</TableCell>
              {/* <TableCell align="left"className="table-th">Approve</TableCell> */}
            {/* <TableCell align="left"className="table-th">Disapprove</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) =>
            (
            
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.company_Name}
              </TableCell>
              <TableCell align="left">{row.customer_Name}</TableCell>
              <TableCell align="left">{row.transport_Name}</TableCell>
              <TableCell align="left">{row.transport_ON}</TableCell>
              <TableCell align="left">{row.port_Name}</TableCell>
              <TableCell align="left">{row.Gst}</TableCell>
            <TableCell align="left">{row.payment_Type}</TableCell>
            <TableCell align="left">{row.product_Name}</TableCell>
            <TableCell align="left">{row?.price}</TableCell>
            <TableCell align="left">{row.quantity}</TableCell>
            <TableCell align="left">{new Date(row.entry_Date).toLocaleDateString()}</TableCell>
            <TableCell align="left">{new Date(row.validity_Date).toLocaleDateString()}</TableCell>
            <TableCell align="left">{row.validity_Days}</TableCell>
            {/* <TableCell align="left"><button variant="outlined">Approve</button></TableCell> */}
            {/* <TableCell align="left"><button variant="outlined">Disapprove</button></TableCell> */}
            </TableRow>
            
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Paper>
    </React.Fragment>
  )
}
