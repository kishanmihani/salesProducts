import './App.css';
import React, { lazy }  from 'react'
import LoginForm from './component/loginFrom/loginForm';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router';
import SalesRestitration from './component/sales/salesRestitration';
import SalesForm from './component/sales/salesForm';
const Dashboardfast = lazy(() => import('./component/Dashboard/Dashboard'));
function App() {

  return (
    <React.Fragment>
      <Box
      sx={{
        height: '100vh',
        backgroundColor: '#8fc7ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Routes>
         <Route  path='' element={
          <LoginForm />
          } />
          <Route path="Dashboard" element={<Dashboardfast />} >
            <Route path="sales" element={<SalesForm />} >
            <Route index element={<SalesRestitration />} ></Route>
            </Route>
          </Route>
        </Routes>
      {/* <LoginForm /> */}
      </Box>
    </React.Fragment>
  )
}

export default App
