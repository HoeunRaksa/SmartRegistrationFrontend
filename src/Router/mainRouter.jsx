import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import NotificationInbox from "../pages/Notification";
import Curriculum from "../pages/Curriculum";
import AdminDashboard from "../adminSide/pageAdmin/AdminDashboard";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notification" element={<NotificationInbox />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* Admin routing */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default MainRouter;
