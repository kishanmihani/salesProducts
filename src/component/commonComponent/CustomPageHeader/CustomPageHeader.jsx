import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CustomPageHeader({pageHeaderText=""}) {
    const navigate = useNavigate()
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
                    style={{
                      borderRadius: "50%",
                      border: 1,
                      borderColor: "#eee",
                      width: 40,
                      position: "relative",
                    }}
                  >
                    <ArrowBackIcon width={80} color="#000" />
                  </Button>
                  <Typography variant="h5" align="center" width="100%">
                    {pageHeaderText}
                  </Typography>
                </Box>
    </React.Fragment>
  )
}
