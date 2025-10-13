import { Routes, Route } from "react-router-dom";
import Home from "../page/Home.jsx";
import Registration from "../page/Registration.jsx";
export default function RaksaRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
}
