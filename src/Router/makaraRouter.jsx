// makaraRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import ExamResul from "../page/ExamResul";


const MakaraRouter = () => (
  <Routes>
    <Route path="/ExamResul" element={<ExamResul />} />
  </Routes>
);

export default MakaraRouter;
