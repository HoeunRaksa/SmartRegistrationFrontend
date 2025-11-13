import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Nabar from "./Components/Nabar";
import { Footer } from "./Components/Footer";
import MainRouter from "./Router/mainRouter";
import "./App.css";
import SnowAnimation from "./Motion/Snow";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/adminsidebar", "/registration", "/login"];
  const hideNavbarRoutes = ["/adminsidebar",];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
    <SnowAnimation />
      <div className={`fixed top-0 left-0 w-full z-50 ${shouldHideNavbar ? 'hidden w-0 h-0' : ''}`}>
          <Nabar />
      </div>

      <div className={`relative w-auto h-auto py-1 px-4 sm:pt-15 pt-13 ${shouldHideNavbar ? 'py-0 px-0 sm:pt-0 pt-0' : ''}`}>
        <MainRouter />
      </div>

      {!shouldHideFooter && (
        <div className="px-4 rounded pb-2">
          <Footer />
        </div>
      )}

      
    </>
  );
}

export default App;
