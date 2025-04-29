import './App.css';
import React  from 'react'
import LoginForm from './component/loginFrom/loginForm';
import { Box } from '@mui/material';
import { Route, Routes } from 'react-router';
import SalesRestitration from './component/sales/salesRestitration';
import SalesForm from './component/sales/salesForm';
import Dashboard from './component/Dashboard/Dashboard';
import Saleslist from './component/sales/Sales list/SalesList';
import ApprovalRequestForm from './component/sales/ApprovalRequestForm';
import LogicRequestForm from './component/Dashboard/logistic/LogicRequestForm/LogicRequestForm';
import LogicForm from './component/Dashboard/logistic/LogicForm';
import LogisticList from './component/Dashboard/logistic/LogisticList/LogisticList';
import VessalRequestForm from './component/Dashboard/logistic/VessalRequestForm/VessalRequestForm';
import { PDFViewer } from '@react-pdf/renderer';
import { MyDocument } from './component/commonComponent/PdfIntegrations/MyDocument';
import Pdfbilles from './component/sales/Pdfbilles/Pdfbilles';
import LogisticListEdit from './component/Dashboard/logistic/LogisticList/LogisticListEdit';
import LogicInvoiceDo from './component/sales/Pdfbilles/LogicInvoiceDo';
import "@fontsource/inter";
function App() {
  return (
    <React.Fragment>
      <Box
      sx={{
        height: '100vh',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
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
            <Route index  element={<SalesRestitration />} />
            <Route path='PendingApprovalForm' element={<Saleslist  />} />
            <Route path='Approval_Request_form' element={<ApprovalRequestForm  />} />
            </Route>

            <Route path="logistic" element={<LogicForm />} >
            <Route index  element={<LogicRequestForm />} />
            <Route path='logistic_Pending_form' element={<LogisticList />} />
            <Route path='logistic_list_Edit_Form/:id?' element={<LogisticListEdit />} />
            
            <Route path='Vessal_Request_Form' element={<VessalRequestForm />} />
            <Route path='Pdf_Bill' element={<Pdfbilles />} />
            <Route path='Logistic_InVoice_Delivery' element={<LogicInvoiceDo />} />
            </Route>
          </Route>
        </Routes>
      </Box>
      
    </React.Fragment>
  )
}

export default App
