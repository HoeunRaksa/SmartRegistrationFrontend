import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isChecking, setIsChecking] = useState(true);
  const userStr = localStorage.getItem("user");

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  // Parse user data
  let user = null;
  try {
    user = JSON.parse(userStr);
  } catch (error) {
    console.error("❌ Invalid user data - clearing localStorage");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {


    // Redirect based on user's actual role
    if (user.role === "admin" || user.role === "staff") {

      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "student") {

      return <Navigate to="/student/dashboard" replace />;
    } else if (user.role === "teacher") {

      return <Navigate to="/teacher/dashboard" replace />;
    } else {

      return <Navigate to="/" replace />;
    }
  }


  return children;
};

export default ProtectedRoute;