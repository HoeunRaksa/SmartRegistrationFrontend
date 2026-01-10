import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Public Pages
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import NotificationInbox from "../pages/Notification";
import Curriculum from "../pages/Curriculum";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminDashboard from "../adminSide/pageAdmin/AdminDashboard";

// Components
import ProtectedRoute from "./ProtectedRoute";

/**
 * Main Application Router
 * Handles all routing logic with protected routes for admin access
 */
const MainRouter = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* ================= PUBLIC ROUTES ================= */}

      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* Student Registration */}
      <Route path="/registration" element={<Registration />} />

      {/* About Us Page */}
      <Route path="/aboutus" element={<AboutUs />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      {/* Notifications */}
      <Route path="/notification" element={<NotificationInbox />} />

      {/* Curriculum Information */}
      <Route path="/curriculum" element={<Curriculum />} />

      {/* ================= ADMIN ROUTES (PROTECTED) ================= */}

      {/* Admin Base Route - Redirect to Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard with Nested Sections */}
      <Route
        path="/admin/:section?"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= ERROR HANDLING ================= */}

      {/* 404 - Not Found Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRouter;