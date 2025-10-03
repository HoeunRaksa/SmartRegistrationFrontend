import { Routes, Route } from 'react-router-dom';
import Home from "../page/Home.jsx";
import Registration from "../page/Registration.jsx";
import PaymentForm from '../Components/PaymentForm.jsx';
const RaksaRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />
     <Route path="/registration" element={<Registration />} />
     <Route path="/payment" element={<PaymentForm />} />
  </Routes>
);

export default RaksaRouter;
