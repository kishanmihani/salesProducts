import './App.css';
import React  from 'react'
import LoginForm from './component/loginFrom/loginForm';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router';
// const Dashboardfast = lazy(() => import('./Components/Dashboard/Dashboard'));
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
          {/* <Route path="dashboard" element={<Dashboardfast />} > */}
          
          {/* </Route> */}
        </Routes>
      {/* <LoginForm /> */}
      </Box>
    </React.Fragment>
  )
}

export default App
