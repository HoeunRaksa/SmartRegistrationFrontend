// makaraRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";
import AbouteUs from "../page/AbouteUs";

const MakaraRouter = () => (
  <Routes>
    <Route path="/ExamResul" element={<ExamResul />} />
    <Route path="/AbouteUs" element={<AbouteUs />} />
  </Routes>
);
export default MakaraRouter;
