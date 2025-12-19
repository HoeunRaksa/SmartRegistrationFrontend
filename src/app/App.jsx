import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Nabar from "../Components/navbar/Nabar";
import { Footer } from "../Components/footer/Footer";
import MainRouter from "../Router/mainRouter";
import "../App.css";
import SnowAnimation from "../Motion/Snow";
import { ToastProvider } from "../Components/Context/ToastProvider";

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

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname.toLowerCase());
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname.toLowerCase());

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center  transition-all duration-500">
      {/* Snow / Background Animations */}
      <SnowAnimation />

      {/* Navbar */}
      {!shouldHideNavbar && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Nabar />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`relative w-full flex-1 flex flex-col items-center transition-all duration-500
          ${shouldHideNavbar ? "pt-0 sm:pt-0" : "pt-16 sm:pt-20"}`}
      >
        <MainRouter />
      </main>

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
