import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ReferenceLine,
} from "recharts";

// ✅ Sample data
const WeeklyData = [
  { day: "Sunday", qty: 0, avgRate: 35063.56 },
  { day: "Monday", qty: 521.02, avgRate: 35084.75 },
  { day: "Tuesday", qty: 260.4, avgRate: 35122.41 },
  { day: "Wednesday", qty: 401.23, avgRate: 35101.69 },
  { day: "Thursday", qty: 0, avgRate: 35009.42 },
  { day: "Friday", qty: 825.73, avgRate: 35042.37 },
  { day: "Saturday", qty: 745.71, avgRate: 35084.75 },
];

const MonthlyData = [
  { week: "Week 1", qty: 1571.44, avgRate: 35063.56 },
  { week: "Week 2", qty: 2479.419, avgRate: 35069.99 },
  { week: "Week 3", qty: 1530.89, avgRate: 35023.16 },
  { week: "Week 4", qty: 2813, avgRate: 34849.58 },
  { week: "Total", qty: 2691.23, avgRate: 34583.26 },
];

export default function SalesReportDashboard() {
  const [tab, setTab] = React.useState("qty"); // qty | rate
  const [view, setView] = React.useState("Weekly"); // Weekly | Monthly
  const [hoverIndex, setHoverIndex] = React.useState(null);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleView = (event, newValue) => {
    if (newValue !== null) setView(newValue);
  };

  // ✅ Chart function
  const chartConfig = (dataKeyX, data, showQty, showRate) => (
    <ComposedChart
      data={data}
      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={dataKeyX} tick={{ fontSize: 12, fill: "#333" }} />

      {/* Y Axis */}
      <YAxis
        yAxisId="left"
        tick={{ fontSize: 10, fill: "#333" }}
        label={{
          value: showQty ? "Quantity" : "Avg Rate (INR)",
          fontSize: 10,
          angle: -90,
          position: "insideLeft",
        }}
        domain={[0, "dataMax + 100"]}
      />

      {/* Tooltip */}
      <Tooltip
        formatter={(value, name) =>
          name === "Sold Qty"
            ? [`${Number(value).toLocaleString()}`, "Quantity"]
            : [
                `₹${Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`,
                "Avg Rate",
              ]
        }
      />

      <Legend />
      <ReferenceLine y={0} stroke="#000" />

      {/* Sold Qty Bars */}
      {showQty && (
        <Bar
          yAxisId="left"
          dataKey="qty"
          barSize={24}
          fill="#a9d0e2ff"
          name="Sold Qty"
          radius={[10, 10, 0, 0]}
          onMouseOver={(_, index) => setHoverIndex(index)}
          onMouseOut={() => setHoverIndex(null)}
        />
      )}

      {/* Avg Rate Bars */}
      {showRate && (
        <Bar
          yAxisId="left"
          dataKey="avgRate"
          barSize={24}
          fill="#90caf9"
          name="Avg Rate"
          radius={[10, 10, 0, 0]}
          onMouseOver={(_, index) => setHoverIndex(index)}
          onMouseOut={() => setHoverIndex(null)}
        />
      )}
    </ComposedChart>
  );

  const currentData = view === "Weekly" ? WeeklyData : MonthlyData;

  return (
    <Box sx={{ p: 2 }}>
      {/* Tabs + Toggle */}
      <Card
        sx={{
          mb: 2,
          borderRadius: 0,
          borderBottom: 1,
          borderColor: "gray",
          boxShadow: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Tabs on the left */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="qty" label="Sold Quantity During" />
            <Tab value="rate" label="Avg Rate During" />
          </Tabs>

          {/* Toggle on the right */}
          <ToggleButtonGroup
            color="primary"
            value={view}
            exclusive
            onChange={handleView}
          >
            <ToggleButton size="small" value="Weekly">
              Weekly
            </ToggleButton>
            <ToggleButton size="small" value="Monthly">
              Monthly
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Card>

      {/* Chart + Table */}
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <Card
            sx={{
              height: "100%",
              width: "100%",
              border: 1,
              borderColor: "gray",
              boxShadow: 0,
            }}
          >
            <CardContent sx={{width:"100%"}}>
              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  fontWeight: "600",
                  width:"100%",
                  textDecoration: "underline",
                }}
                gutterBottom
              >
                {tab === "qty"
                  ? `Sold Quantity During The ${view}`
                  : `Avg Rate During The ${view}`}
              </Typography>

              <Typography sx={{ display: "flex", height: 370, gap: 3 }}>
                {/* Chart */}
                <Box
                  sx={{
                    height: 350,
                    width: "50%",
                    overflow: "auto",
                    overflowY: "hidden",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%" minWidth={600}>
                    {tab === "qty"
                      ? chartConfig(
                          view === "Weekly" ? "day" : "week",
                          currentData,
                          true,
                          false
                        )
                      : chartConfig(
                          view === "Weekly" ? "day" : "week",
                          currentData,
                          false,
                          true
                        )}
                  </ResponsiveContainer>
                </Box>

                {/* Table */}
                <TableContainer
                  component={Paper}
                  sx={{ width: "50%" }}
                  variant="outlined"
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {view === "Weekly" ? "Day" : "Week"}
                        </TableCell>
                        <TableCell align="right">
                          {tab === "qty" ? "Sold Qty" : "Avg Rate (INR)"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentData.map((r, i) => (
                        <TableRow
                          key={i}
                          hover
                          selected={hoverIndex === i}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f3e5f5",
                              cursor: "pointer",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#e1bee7 !important",
                            },
                          }}
                        >
                          <TableCell>
                            {view === "Weekly" ? r.day : r.week}
                          </TableCell>
                          <TableCell align="right">
                            {tab === "qty"
                              ? Number(r.qty).toLocaleString()
                              : `₹${Number(r.avgRate).toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
