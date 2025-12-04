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
  const hideNavbarRoutes = ["/adminsidebar",];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
    <SnowAnimation/>
      <div className={`fixed top-0 left-0 w-full z-50 ${shouldHideNavbar ? 'hidden w-0 h-0' : ''}`}>
          <Nabar />
      </div>
      <div className={`relative w-auto h-auto bg-gradient-to-br from-blue-600 to-pink-400  sm:pt-15 pt-13 sm:p-2 p-[2px]  ${shouldHideNavbar ? 'py-0 px-0 sm:pt-0 pt-0' : ''}`}>
        <MainRouter />
            {!shouldHideFooter && (
      
          <Footer />
       
      )}
      </div>
    </>
  );
}

export default App;
