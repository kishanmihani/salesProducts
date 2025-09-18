import React from "react";
import { Box, Tabs, Badge } from "@mui/material";
import { CustomTab } from "../../component/commonComponent/CustomTabs/CustomTabs";

export default function AccountTabs({ tabs, handleTabs, tableData }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
      <Tabs value={tabs} onChange={handleTabs} sx={{ width: "100%" }}>
        {["Advance Payment List", "Cash Payment List", "Credit Payment List"].map((label, i) => (
          <CustomTab
            key={i}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                {label}
                <Badge
                  badgeContent={
                    i === 0
                      ? tableData.api2?.length || 0
                      : i === 1
                      ? tableData.api1?.length || 0
                      : tableData.api3?.length || 0
                  }
                  color="primary"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontSize: "12px",
                      height: "20px",
                      minWidth: "20px",
                      borderRadius: "50%",
                    },
                  }}
                />
              </Box>
            }
            sx={{ width: "33%" }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
