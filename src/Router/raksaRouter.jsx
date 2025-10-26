import React from "react";
import Home from "../page/Home";
import Registration from "../page/Registration";
import { Route } from "react-router-dom";

const RaksaRoutes = () => [
  <Route key="home" path="/" element={<Home />} />,
  <Route key="registration" path="/registration" element={<Registration />} />,
];

export default RaksaRoutes;
