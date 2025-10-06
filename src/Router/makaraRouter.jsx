import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";
import AbouteUs from "../page/AbouteUs";
import Login from "../page/Login";
import NotificationInbox from "../page/Notification";
import AdminSidebar from "../Components/AdminSidebar";
import PaidStudentsTable from "../Components/PaidStudentsTable";

const MakaraRouter = () => (
  <Routes>
    <Route path="/examresul" element={<ExamResul />} />
    <Route path="/aboutus" element={<AbouteUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/notification" element={<NotificationInbox />} />
    <Route path="/adminsidebar" element={<AdminSidebar />} />
    <Route path="/paid-students" element={<PaidStudentsTable/>} />
  </Routes>
);

export default MakaraRouter;
