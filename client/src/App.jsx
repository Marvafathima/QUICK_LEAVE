import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomNavbar } from "./components/CustomNavbar";
import "./App.css"
import Layout from "./components/Layout";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
function App() {


  return (
    <BrowserRouter>
    <div className="App">
     <Routes>
      <Route path="/" element={<Layout/>}></Route>
      <Route path="/signup" element={<SignupPage/>}></Route>
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
     </Routes>
    </div> 
    </BrowserRouter>
  )
}

export default App
