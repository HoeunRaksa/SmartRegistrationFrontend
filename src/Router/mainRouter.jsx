import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import NotificationInbox from "../pages/Notification";
import Curriculum from "../pages/Curriculum";
import NotFound from "../pages/NotFound";
import PaymentForm from "../../src/Components/payment/PaymentForm";

// Admin Pages
import AdminDashboard from "../adminSide/pageAdmin/AdminDashboard";

// Student Pages
import StudentDashboard from "../studentSide/StudentPage/studentDashbord";

// Components
import ProtectedRoute from "./ProtectedRoute";

/**
 * Main Application Router
 * Handles all routing logic with protected routes for admin and student access
 */
const MainRouter = () => {
  return (
    <Routes>
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

      {/* Payment */}
      <Route path="/payment" element={<PaymentForm />} />

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

      {/* ================= STUDENT ROUTES (PROTECTED) ================= */}

      {/* Student Base Route - Redirect to Dashboard */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Navigate to="/student/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard with Nested Sections */}
      <Route
        path="/student/:section?"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
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