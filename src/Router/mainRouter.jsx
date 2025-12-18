import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Registration from "../pages/Registration";
import AboutUs from "../pages/AboutUs";
import Login from "../pages/Login";
import NotificationInbox from "../pages/Notification";
import Curriculum from "../pages/Curriculum";

const MainRouter = () => {
  return (
    <Routes>
      {/* Raksa */}
      <Route path="/" element={<Home />} />
      <Route path="/registration" element={<Registration />} />

      {/* Makara */}
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notification" element={<NotificationInbox />} />

      {/* Mony */}
      <Route path="/curriculum" element={<Curriculum />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MainRouter;
