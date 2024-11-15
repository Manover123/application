import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const currenUser = localStorage.getItem("token");
  return currenUser != null ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoutes;
