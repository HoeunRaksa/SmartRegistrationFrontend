import { Routes, Route } from 'react-router-dom';
import Home from "../page/Home.jsx";
import Registration from "../page/Registration.jsx";
const RaksaRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
     <Route path="/registration" element={<Registration />} />
  </Routes>
);

export default RaksaRouter;
