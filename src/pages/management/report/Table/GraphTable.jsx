import React from 'react';
import { useLocation } from 'react-router';
import CustomPageHeader from '../../../../component/commonComponent/CustomPageHeader/CustomPageHeader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "#f5f5f5",
  zIndex: 10,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px",
};
export default function GraphTable(props) {
    // const { state } = useLocation();

    // if (!state?.props.data) return <p>No props.data available. Please go back.</p>;
const stickyHeaderStyle = {
  position: "sticky",
  top: 0,
  backgroundColor: "#f4cccc",
  zIndex: 10,
  borderRadius: 2,
          boxShadow: 3,
          overflowX: "auto",
//   fontWeight: "bo
height:30
};
    // const { props.data, props.varient, props.selectedprops.dataset } = state;
    console.log(props.data)
    // // Common style for sticky header
    // const stickyHeaderStyle = {
    //     position: 'sticky',
    //     top: 0,
    //     backgroundColor: '#f5f5f5',
    //     zIndex: 10,
    //     fontWeight: 600
    // };

    return (
        <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            height: 450,
            overflow:"auto"
            // boxShadow: "0 2px 1/0px rgba(0,0,0,0.1)",
            // margin: "40px auto",
            // maxWidth: 1200
        }}>
            {/* <CustomPageHeader pageHeaderText={pageTilte} /> */}

            {/* Variant 1: Simple native table */}
            {props.varient === 1 && (
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead height={50} sx={{ backgroundColor: "#f4cccc" }}>
                            <tr>
                                <th style={stickyHeaderStyle}>Region</th>
                                {props.selectedprops.dataset !== "avg" && <th style={stickyHeaderStyle}>Sales Qty</th>}
                                {props.selectedprops.dataset !== "sales" && <th style={stickyHeaderStyle}>Avg Selling Rate</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.port || "N/A"}</td>
                                    {props.selectedprops.dataset !== "avg" && <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.sale_Qty}</td>}
                                    {props.selectedprops.dataset !== "sales" && <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.avg_Selling_Rate?.toLocaleString()}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Variant 2: MUI Table */}
            {props.varient === 2 && (
                <TableContainer component={Paper}
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 2,
                          boxShadow: 3,
                          overflowX: "auto",
                        }}>
                    <Table stickyHeader>
                        <TableHead  sx={{ backgroundColor: "#f4cccc" }}>
                            <TableRow>
                                <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Party Name</TableCell>
                                {(props.selectedprops.dataset === "sales" || props.selectedprops.dataset === "both") && <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Sales Quantity</TableCell>}
                                {(props.selectedprops.dataset === "avg" || props.selectedprops.dataset === "both") && <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Avg Selling Rate (₹)</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.party_Name || "N/A"}</TableCell>
                                    {(props.selectedprops.dataset === "sales" || props.selectedprops.dataset === "both") && <TableCell>{item.sale_Qty ?? 0}</TableCell>}
                                    {(props.selectedprops.dataset === "avg" || props.selectedprops.dataset === "both") && <TableCell>₹{item.avg_Selling_Rate?.toLocaleString() ?? 0}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Variant 3: MUI Table for Bar/Date-based props.data */}
            {props.varient === 3 && (
                <TableContainer component={Paper}
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 2,
                          boxShadow: 3,
                          overflowX: "auto",
                        }}>
                    <Table stickyHeader>
                        <TableHead  sx={{ backgroundColor: "#f4cccc" }}>
                            <TableRow>
                                <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Date</TableCell>
                                {(props.selectedprops.dataset === "sales" || props.selectedprops.dataset === "both") && <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Sales Quantity</TableCell>}
                                {(props.selectedprops.dataset === "avg" || props.selectedprops.dataset === "both") && <TableCell sx={{
  ...stickyHeaderStyle,
  fontWeight: "bold",
  textAlign: "center",
  width: "150px"
}}>Avg Selling Rate (₹)</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.date}</TableCell>
                                    {(props.selectedprops.dataset === "sales" || props.selectedprops.dataset === "both") && <TableCell>{item.sale_Qty}</TableCell>}
                                    {(props.selectedprops.dataset === "avg" || props.selectedprops.dataset === "both") && <TableCell>₹{item.avg_Selling_Rate?.toLocaleString()}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
