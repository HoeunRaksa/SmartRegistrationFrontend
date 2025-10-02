import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";
import AbouteUs from "../page/AbouteUs";
import Login from "../page/Login";
import NotificationInbox from "../page/Notification";

const MakaraRouter = () => (
  <Routes>
    <Route path="/examresul" element={<ExamResul />} />
    <Route path="/aboutus" element={<AbouteUs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/notification" element={<NotificationInbox />} />
  </Routes>
);

export default MakaraRouter;
