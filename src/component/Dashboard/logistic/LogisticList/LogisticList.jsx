import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { authAxios } from '../../../utils/authAxios';
export default function Logisticlist() {
  const navigate = useNavigate();
  const [tableData,setTableData]=React.useState([])
  const [checkTableData,setCheckTableData]=React.useState(false)
  const [userId] = React.useState(JSON.parse(localStorage.getItem("userInfo"))?.id);
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
          "BituRep/Api/Account/logistic_data_list",
          JSON.stringify({
            user_id: userId,
            Role: "entry",
          })
        );
        setTableData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setCheckTableData(false);
      }
    };
  
    if (!checkTableData && tableData.length === 0) {
      fetchTableData();
    }
  }, [checkTableData, tableData, userId]);
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
                <Button
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: "50%",
                    border: 1,
                    borderColor: "#eee",
                    width: 40,
                  }}
                >
                  <ArrowBackIcon />
                </Button>
                <Typography variant="h5" align="center" width="100%">
                  Logistic Pending Form
                </Typography>
              </Box>
      <Paper sx={{ p: 2 }} elevation={0}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead sx={{fontSize:14,fontWeight:600,bgcolor:"rgba(25, 118, 210, 0.08)"}}>
          <TableRow>
          <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Order Id</TableCell>
            <TableCell align="left" sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Customer Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Port Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Quantity</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>vehicle_Name</TableCell>
            <TableCell align="left"sx={{fontSize:14,fontWeight:600,whiteSpace:"nowrap"}}>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) =>
            (
            
            <TableRow
              key={row.table_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.table_id}</TableCell>
              <TableCell align="left">{row.customer_Name}</TableCell>
              <TableCell align="left">{row.port_Name}</TableCell>
              <TableCell align="left">{row.quantity}</TableCell>
              <TableCell align="left">{row.vehicle_Name}</TableCell>
              <TableCell align="left">{row.remark}</TableCell>
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
