import React, { useState, useEffect } from "react";
import CustomPageHeader from "../../../component/commonComponent/CustomPageHeader/CustomPageHeader";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import MonthlySalesChart from "./DailySalesChart";
import YearlySalesLineChart from "./YearlySalesLineChart";
import MonthlySalesGrowthChart from "./SalesGrowthChart";
import SalesByRegionChart from "./SalesByRegionChart";
import { authAxios } from "../../../component/utils/authAxios";
import { Navigate, useNavigate } from "react-router";
import SoldQuantityTable from "./Table/SoldQuantityTable";
import SoldQuantityTableYealy from "./Table/SoldQuantityTableYearly";
import SalesTable from "./Table/SoldQuantityTableYearly";
import GraphTable from "./Table/GraphTable";
import { formatNumberIndian } from "../../../component/commonComponent/InPriceFromate/InPriceFromate";

export default function Report() {
  const [fetchdata, setFetchData] = useState([]);
  const [checkFetchData, setCheckFetchData] = useState(false);
const naigate=useNavigate();
  useEffect(() => {
    if (!checkFetchData) fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await authAxios.post("/BituRep/Api/Account/Report_Sale");
      setFetchData(res.data);
      setCheckFetchData(true);
    } catch (e) {
      console.error(e);
      setFetchData([]);
    }
  };

  const summaryData = [
    { label: "Total Sales", value: formatNumberIndian( fetchdata?.count_Container?.[0]?.t_Sale) },
    { label: "Sales Quantity", value: formatNumberIndian(fetchdata?.count_Container?.[0]?.sale_Qty) },
    { label: "Max Selling Rate", value:  formatNumberIndian(fetchdata?.count_Container?.[0]?.max_Selling_Rate) },
    { label: "Min Selling Rate", value:formatNumberIndian( fetchdata?.count_Container?.[0]?.min_Selling_Rate) },
    { label: "Avg Rate", value:formatNumberIndian(  fetchdata?.count_Container?.[0]?.avg_Selling_Rate) },
  ];

  if (!checkFetchData)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
     
const handleViewDetails = (data,pageTilte,varient) => {
  // const pageTilte=selectedDataset ==="sales"? "Sales Amount by Region" : "Avg Rate by Region";
    naigate("/Dashboard/management/graphtable", {
      state: { data, pageTilte,varient },
    });
  }
  return (
    <Box>
      {/* Page Header */}
      <CustomPageHeader pageHeaderText="Report" />

      {/* Summary Cards */}
      <Box
        sx={{
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          gap: 2,
          mt: 1,
          px: { xs: 1, sm: 2, md: 3 },
          py: 1,
        }}
      >
        {summaryData.map((item, index) => (
          <Card
            key={index}
            sx={{
              width: 180,
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Monthly & Yearly Sales Charts */}
      <Box sx={{ pt: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        {/* Sales Performance */}
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
           Sold Quantity During The Month
        </Typography>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%" }, },
          }}
        >
            <MonthlySalesChart data={fetchdata?.date_Month} selectedDataset="sales" /> 
          <SoldQuantityTable data={fetchdata?.date_Month} selectedDataset="sales" />
          {/* <SoldQuantityTableYealy data={fetchdata?.date_Year} selectedDataset="sales" /> */}
          
          {/* <YearlySalesLineChart data={fetchdata?.date_Year} selectedDataset="sales" /> */} 
        </Box>

        {/* Avg Rate Info */}
        
      </Box>
      <Box sx={{ pt: 3,boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        {/* Sales Performance */}
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
           Avg Rate During The Month
        </Typography>
        
        <Box
        sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%" }, },
          }}>
          <MonthlySalesChart data={fetchdata?.date_Month} selectedDataset="avg" /> 
          <SoldQuantityTable data={fetchdata?.date_Month} selectedDataset="avg"/>
          </Box></Box>
          <Box sx={{ pt: 3,boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mt: 3, mb: 2 }}>

        Yearly Solid Quanttity
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%", xl: 400 }, },
          }}
        >
          {/* <MonthlySalesChart data={fetchdata?.date_Month} selectedDataset="avg" /> */}
          <YearlySalesLineChart
            data={fetchdata?.date_Year}
            selectedDataset="sales"
            title="Yearly Solid Quanttity"
          />
          <SalesTable selectedDataset="sales"  dateYear={fetchdata?.date_Year} />
        </Box>
        </Box>
<Box sx={{ pt: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mt: 3, mb: 2 }}>

        Yearly Avg Rate Info
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%", xl: 400 }, },
          }}
        >
          {/* <MonthlySalesChart data={fetchdata?.date_Month} selectedDataset="avg" /> */}
          <YearlySalesLineChart
            data={fetchdata?.date_Year}
            selectedDataset="avg"
            title="Yearly Avg Rate Changes"
          />
          <SalesTable selectedDataset="avg"  dateYear={fetchdata?.date_Year} />
        </Box>
        </Box>
      {/* Sales By Region */}
      <Box sx={{ pt: 3,boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
          Sales by Region
        </Typography>
        {/* <Button variant="outlined" onClick={()=>handleViewDetails/()}>View Details</Button> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%", xl: 400 }, },
          }}
        >
          <SalesByRegionChart data={fetchdata?.date_port} selectedDataset="sales" />
          <GraphTable  data={fetchdata?.date_port} selectedprops={{ dataset: "sales" }} varient={1} />
          </Box></Box>
          <Box sx={{ pt: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",  backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
          Avg by Region
        </Typography>
        {/* <Button variant="outlined" onClick={()=>handleViewDetails/()}>View Details</Button> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
           
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" },height: { xs: "100%", xl: 400 }, },
          }}
        >
          <SalesByRegionChart data={fetchdata?.date_port} selectedDataset="avg" />
          <GraphTable  data={fetchdata?.date_port} selectedprops={{ dataset: "avg" }} varient={1} />
        </Box>
      </Box>

      {/* Monthly Sales Growth */}
      <Box sx={{ pt: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
         Sales Monthly Growth
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" } ,height: { xs: "100%", xl: 400 },},
          }}
        >
          <MonthlySalesGrowthChart data={fetchdata?.top10Customer} selectedDataset="sales" />
          <GraphTable  data={fetchdata?.top10Customer} selectedprops={{ dataset: "sales" }} varient={2} />
        </Box>
        </Box>
        <Box sx={{ pt: 3,boxShadow: "0 2px 8px rgba(0,0,0,0.1)", backgroundColor: "rgba(25, 118, 210, 0.08)", p: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: "left", mb: 2 }}>
         Avg Monthly Growth
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 2,
            width: "100%",
            "& > *": { flex: 1, width: { xs: "100%", xl: "48%" } ,height: { xs: "100%", xl: 400 },},
          }}
        >
          <MonthlySalesGrowthChart data={fetchdata?.top10Customer} selectedDataset="avg" />
          <GraphTable  data={fetchdata?.top10Customer} selectedprops={{ dataset: "avg" }} varient={2} />
        </Box>
      </Box>
    </Box>
  );
}
