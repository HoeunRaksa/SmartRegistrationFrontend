import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!token || !user) {
    console.log("❌ No token or user");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ USER ROLE:", user.role);

  if (!allowedRoles.includes(user.role)) {
    console.log("❌ Role blocked:", user.role);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
