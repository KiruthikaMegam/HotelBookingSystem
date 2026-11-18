import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedCustomerRoute() {
  const isLoggedIn =
    localStorage.getItem("rrCustomerLoggedIn") === "true";

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}