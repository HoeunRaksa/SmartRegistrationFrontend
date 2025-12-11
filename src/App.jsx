import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Nabar from "./Components/Nabar";
import { Footer } from "./Components/Footer";
import MainRouter from "./Router/mainRouter";
import "./App.css";
import SnowAnimation from "./Motion/Snow";
import { ToastProvider } from "./Components/Context/ToastProvider";
function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
}
function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/Adminsidebar", "/registration", "/login"];
  const hideNavbarRoutes = ["/adminsidebar"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-50 ${shouldHideNavbar ? 'hidden w-0 h-0' : ''}`}>
        <Nabar />
      </div>
      <div
        className={`relative w-full min-h-screen p-[2px] sm:p-2 sm:pt-15 pt-13
          ${shouldHideNavbar ? 'py-0 px-0 sm:pt-0 pt-0' : ''}
          bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
          flex flex-col items-center`}
      >
        <MainRouter />

        {!shouldHideFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
