import React from "react";
import ExamResul from "../page/ExamResul";
import AboutUs from "../page/AboutUs";
import Login from "../page/Login";
import NotificationInbox from "../page/Notification";
import AdminSidebar from "../Components/AdminSidebar";
import { Route } from "react-router-dom";

const MakaraRoutes = () => [
  <Route key="examresul" path="/examresul" element={<ExamResul />} />,
  <Route key="aboutus" path="/aboutus" element={<AboutUs />} />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="notification" path="/notification" element={<NotificationInbox />} />,
  <Route key="adminsidebar" path="/adminsidebar" element={<AdminSidebar />} />,
];

export default MakaraRoutes;
