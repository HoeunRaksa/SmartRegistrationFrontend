import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";
import AbouteUs from "../page/AbouteUs";
import Login from "../page/Login";

const MakaraRouter = () => (
  <Routes>
    <Route path="/examresul" element={<ExamResul />} />
    <Route path="/aboutus" element={<AbouteUs />} />
    <Route path="/login" element={<Login />} />
  </Routes>
);

export default MakaraRouter;
