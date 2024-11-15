import "../src/pages/icon.css";
import "../src/pages/stylesDatatabel.css";
import "./App.scss";
import "../src/pages/DropDown/DropDown.css";
import "boxicons/css/boxicons.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoutes from "./components/layout/Protected";
import Salemember from "./pages/SaleMember";
import Usermember from "./pages/UserMember";
import TypeItemDetail from "./pages/TypeItemDetail";
import LockSaleDetail from "./pages/LockSaleDetail";
import Testlogin from "./pages/RegisterAdmin";
import Testfirbase from "./pages/InsertLease";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/starteds" element={<Usermember />} />
          <Route path="/started" element={<Salemember />} />
          <Route path="/calendar" element={<LockSaleDetail />} />
          <Route path="/user" element={<TypeItemDetail />} />
          <Route path="/register" element={<Testlogin />} />
          <Route path="/Firbase" element={<Testfirbase />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
