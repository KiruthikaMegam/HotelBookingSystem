import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const isLoggedIn = localStorage.getItem("rrAdminLoggedIn") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
