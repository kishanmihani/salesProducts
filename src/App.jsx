import './App.css';
import React  from 'react'
import LoginForm from './component/loginFrom/loginForm';
import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router';
import SalesRestitration from './component/sales/salesRestitration';
import SalesForm from './component/sales/salesForm';
import Dashboard from './component/Dashboard/Dashboard';
import Saleslist from './component/sales/Sales list/Saleslist';
import ApprovalRequestForm from './component/sales/ApprovalRequestForm';
import LogicRequestForm from './component/Dashboard/logistic/LogicRequestForm/LogicRequestForm';
import LogicForm from './component/Dashboard/logistic/LogicForm';
import LogisticList from './component/Dashboard/logistic/LogisticList/LogisticList';
import VessalRequestForm from './component/Dashboard/logistic/VessalRequestForm/VessalRequestForm';
import Pdfbilles from './component/sales/Pdfbilles/Pdfbilles';
import LogisticListEdit from './component/Dashboard/logistic/LogisticList/LogisticListEdit';
import LogicInvoiceDo from './component/sales/Pdfbilles/LogicInvoiceDo';
import "@fontsource/inter";
import VessalList from './component/Dashboard/logistic/vessalList/VessalList';
import SoApproval from './component/soForms/SoApproval';
import AccountList from './pages/accounts/accountList';
import ApprovalList from './pages/ApprovalList/ApprovalList';
import ReciptFrom from './pages/reciptFrom/reciptFrom';
import CloserForm from './pages/closerForm/closerForm';
function App() {
  // const navigate=useNavigate();
//  window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   alert("Are you sure you want to leave?");
// });
// const RedirectComponent = () => {
//   return <Navigate to="/Account/Account_list" replace />;
// };
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
            <Route path='Sale_Registeration_Form'  element={<SalesRestitration />} />
            <Route path='PendingApprovalForm' element={<Saleslist  />} />
            <Route path='Approval_Request_form' element={<ApprovalRequestForm  />} />
            
            </Route>

            <Route path="logistic" element={<LogicForm />} >
            <Route path="logistic_Request_form"  element={<LogicRequestForm />} />
            {/* <Route  index element={<Navigate to="So_Approval" replace />} /> */}
          <Route  path='So_Approval' element={<SoApproval  />} />
            {/* <Route index element={<Navigate to="logistic_Pending_form" replace />} /> */}
            <Route path='logistic_Pending_form' element={<LogisticList />} />
            <Route path='logistic_list_Edit_Form/:id?' element={<LogisticListEdit />} />
            
            <Route path='Vessal_Request_Form' element={<VessalRequestForm />} />
            <Route path='Vessal_List' element={<VessalList />} />
            
            <Route path='Vessal_Edit_Form/:id?' element={<VessalRequestForm />} />
            <Route path='Pdf_Bill' element={<Pdfbilles />} />
            <Route path='Logistic_InVoice_Delivery' element={<LogicInvoiceDo />} />
            </Route>

            <Route path="Account" element={<LogicForm />}>
  {/* <Route index element={<Navigate to="Account_list" replace />} /> */}
  <Route path="Account_list" element={<AccountList />} />
  <Route path="Approval_list" element={<ApprovalList />} />
  <Route path="CloserForm" element={<CloserForm />} />
  <Route path="ReciptFrom" element={<ReciptFrom />} />
</Route>

          </Route>
        </Routes>
      </Box>
      {/* </DrawerProvider> */}
       
    </React.Fragment>
  )
}

export default App
