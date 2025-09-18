import { Routes, Route } from 'react-router-dom';
import Home from "../page/Home.jsx";
const RaksaRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
  </Routes>
);

export default RaksaRouter;
