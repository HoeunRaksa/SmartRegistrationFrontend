import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MakaraRoutes from "./makaraRouter";
import MonyRoutes from "./monyRouter";
import RaksaRoutes from "./raksaRouter";

const MainRouter = () => {
  return (
    <Routes>
      {RaksaRoutes()}
      {MakaraRoutes()}
      {MonyRoutes()}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRouter;
