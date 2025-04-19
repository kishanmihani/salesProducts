import './App.css';
import React  from 'react'
import LoginForm from './component/loginFrom/loginForm';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router';
import SalesRestitration from './component/sales/salesRestitration';
import SalesForm from './component/sales/salesForm';
import Dashboard from './component/Dashboard/Dashboard';
// const Dashboardfast = lazy(() => import('./component/Dashboard/Dashboard'));
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
          <Route path="Dashboard" element={<Dashboard />} >
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
