import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";
import AbouteUs from "../page/AbouteUs";
import Login from "../page/Login";
import NotificationInbox from "../page/Notification";
import AdminSidebar from "../Components/AdminSidebar";

const MakaraRouter = () => (
  <Routes>
    <Route path="/examresul" element={<ExamResul />} />
    <Route path="/aboutus" element={<AbouteUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/notification" element={<NotificationInbox />} />
    <Route path="/adminsidebar" element={<AdminSidebar />} />
  </Routes>
);

export default MakaraRouter;
