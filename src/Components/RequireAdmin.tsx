import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequireAdmin = () => {
  const userRole = useSelector((state: any) => state.auth.role);

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAdmin;
