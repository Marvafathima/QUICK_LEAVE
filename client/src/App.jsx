import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomNavbar } from "./components/CustomNavbar";
import "./App.css"
import Layout from "./components/Layout";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { EmployeeDashboard } from "./components/employee/EmployeeDashboard";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import LeaveApplication from "./components/employee/LeaveApplication";
import { ToastContainer, toast } from 'react-toastify';
import PendingLeavesManager from "./components/manager/PendingLeavesManager";
import RejectedLeaves from "./components/manager/RejectedLeaves";
import ApprovedLeaves from "./components/manager/ApprovedLeaves";
import RejectedLeavesDisplay from "./components/employee/RejectedLeavesDisplay";
import ApprovedLeavesDisplay from "./components/employee/ApprovedLeaveDisplay";
import PendingLeaveDisplay from "./components/employee/PendingLeaveDisplay";
import EmployeeLeaveStatsWithLayout from "./components/manager/EmployeeLeaveStat";
import LandingPage from "./components/LangingPage";
function App() {


  return (
    <BrowserRouter>
    <ToastContainer />

    <div className="App">
     <Routes>
      {/* <Route path="/" element={<Layout/>}></Route> */}
      <Route path="/signup" element={<ProtectedRoute><SignupPage/></ProtectedRoute>}></Route>
      <Route path="/login" element={<ProtectedRoute><LoginPage/></ProtectedRoute>}></Route>
      <Route path="/" element={<LandingPage/>}></Route>
     {/* <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['manager']} > <Dashboard/></RoleProtectedRoute>}></Route> */}
     <Route path="/hrdashboard" element={<RoleProtectedRoute allowedRoles={['manager']} > <ManagerDashboard/></RoleProtectedRoute>}></Route>
     <Route path="/pending_leave/request" element={<RoleProtectedRoute allowedRoles={['manager']} > <PendingLeavesManager/></RoleProtectedRoute>}></Route>
     <Route path="/rejected_leave/request" element={<RoleProtectedRoute allowedRoles={['manager']} > <RejectedLeaves/></RoleProtectedRoute>}></Route>
     <Route path="/approved_leave/request" element={<RoleProtectedRoute allowedRoles={['manager']} > <ApprovedLeaves/></RoleProtectedRoute>}></Route>
     <Route path="/employee/leave/stat" element={<RoleProtectedRoute allowedRoles={['manager']} > <EmployeeLeaveStatsWithLayout/></RoleProtectedRoute>}></Route>
     
     
     
     
     
     
     <Route path="/employee_dashboard" element={<RoleProtectedRoute allowedRoles={['employee']} > <EmployeeDashboard/></RoleProtectedRoute>}></Route>
    
     <Route path="/leave_application" element={ <RoleProtectedRoute allowedRoles={['employee']} > <LeaveApplication/> </RoleProtectedRoute>}></Route>
     <Route path="/myrejected/requests" element={ <RoleProtectedRoute allowedRoles={['employee']} > <RejectedLeavesDisplay/> </RoleProtectedRoute>}></Route>
     <Route path="/myapproved/requests" element={ <RoleProtectedRoute allowedRoles={['employee']} > <ApprovedLeavesDisplay/> </RoleProtectedRoute>}></Route>
     <Route path="/mypending/requests" element={ <RoleProtectedRoute allowedRoles={['employee']} > <PendingLeaveDisplay/> </RoleProtectedRoute>}></Route>



     </Routes>
    </div> 
   
    </BrowserRouter>
  )
}

export default App
