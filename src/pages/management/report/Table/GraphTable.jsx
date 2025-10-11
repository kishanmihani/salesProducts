import React from 'react';
import { useLocation } from 'react-router';
import CustomPageHeader from '../../../../component/commonComponent/CustomPageHeader/CustomPageHeader';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function GraphTable() {
    const { state } = useLocation();

    if (!state?.data) return <p>No data available. Please go back.</p>;

    const { data, pageTilte, varient, selectedDataset } = state;

    // Common style for sticky header
    const stickyHeaderStyle = {
        position: 'sticky',
        top: 0,
        backgroundColor: '#f5f5f5',
        zIndex: 10,
        fontWeight: 600
    };

    return (
        <div style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            // boxShadow: "0 2px 1/0px rgba(0,0,0,0.1)",
            // margin: "40px auto",
            // maxWidth: 1200
        }}>
            <CustomPageHeader pageHeaderText={pageTilte} />

            {/* Variant 1: Simple native table */}
            {varient === 1 && (
                <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={stickyHeaderStyle}>Region</th>
                                {selectedDataset !== "avg" && <th style={stickyHeaderStyle}>Sales Qty</th>}
                                {selectedDataset !== "sales" && <th style={stickyHeaderStyle}>Avg Selling Rate</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.port || "N/A"}</td>
                                    {selectedDataset !== "avg" && <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.sale_Qty}</td>}
                                    {selectedDataset !== "sales" && <td style={{ padding: "8px", border: "1px solid #ddd" }}>₹{item.avg_Selling_Rate?.toLocaleString()}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Variant 2: MUI Table */}
            {varient === 2 && (
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={stickyHeaderStyle}>Party Name</TableCell>
                                {(selectedDataset === "sales" || selectedDataset === "both") && <TableCell sx={stickyHeaderStyle}>Sales Quantity</TableCell>}
                                {(selectedDataset === "avg" || selectedDataset === "both") && <TableCell sx={stickyHeaderStyle}>Avg Selling Rate (₹)</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.party_Name || "N/A"}</TableCell>
                                    {(selectedDataset === "sales" || selectedDataset === "both") && <TableCell>{item.sale_Qty ?? 0}</TableCell>}
                                    {(selectedDataset === "avg" || selectedDataset === "both") && <TableCell>₹{item.avg_Selling_Rate?.toLocaleString() ?? 0}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Variant 3: MUI Table for Bar/Date-based data */}
            {varient === 3 && (
                <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={stickyHeaderStyle}>Date</TableCell>
                                {(selectedDataset === "sales" || selectedDataset === "both") && <TableCell sx={stickyHeaderStyle}>Sales Quantity</TableCell>}
                                {(selectedDataset === "avg" || selectedDataset === "both") && <TableCell sx={stickyHeaderStyle}>Avg Selling Rate (₹)</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.date}</TableCell>
                                    {(selectedDataset === "sales" || selectedDataset === "both") && <TableCell>{item.sale_Qty}</TableCell>}
                                    {(selectedDataset === "avg" || selectedDataset === "both") && <TableCell>₹{item.avg_Selling_Rate?.toLocaleString()}</TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
