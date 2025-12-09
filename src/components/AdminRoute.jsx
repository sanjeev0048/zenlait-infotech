import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem("adminToken");

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
