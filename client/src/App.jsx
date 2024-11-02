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


function App() {


  return (
    <BrowserRouter>
    <div className="App">
     <Routes>
      <Route path="/" element={<Layout/>}></Route>
      <Route path="/signup" element={<ProtectedRoute><SignupPage/></ProtectedRoute>}></Route>
      <Route path="/login" element={<ProtectedRoute><LoginPage/></ProtectedRoute>}></Route>
     {/* <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['manager']} > <Dashboard/></RoleProtectedRoute>}></Route> */}
     <Route path="/hrdashboard" element={<RoleProtectedRoute allowedRoles={['manager']} > <ManagerDashboard/></RoleProtectedRoute>}></Route>
     <Route path="/employee_dashboard" element={<RoleProtectedRoute allowedRoles={['employee']} > <EmployeeDashboard/></RoleProtectedRoute>}></Route>
    
     <Route path="/leave_application" element={ <RoleProtectedRoute allowedRoles={['employee']} > <LeaveApplication/> </RoleProtectedRoute>}></Route>



    
     
     
     
     
     </Routes>
    </div> 
    <ToastContainer />
    </BrowserRouter>
  )
}

export default App
