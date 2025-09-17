// makaraRouter.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../page/Home";
import ExamResul from "../page/ExamResul";

const AboutPage = () => <h2>About Page</h2>;
const NotFoundPage = () => <h2>404 - Not Found</h2>;

const MakaraRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/ExamResul" element={<ExamResul />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default MakaraRouter;
