import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomNavbar } from "./components/CustomNavbar";
import "./App.css"
import Layout from "./components/Layout";
function App() {


  return (
    <BrowserRouter>
    <div className="App">
     <Routes>
      <Route path="/" element={<Layout/>}>

      </Route>
     </Routes>
    </div> 
    </BrowserRouter>
  )
}

export default App
