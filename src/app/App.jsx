import React, { useEffect } from "react";
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

  // ✅ SCROLL TO TOP ON EVERY ROUTE CHANGE
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  // ⚠️ always keep lowercase (because pathname is lowercased)
  const hideFooterRoutes = ["/adminsidebar", "/registration", "/login"];
  const hideNavbarRoutes = ["/adminsidebar"];

  const pathname = location.pathname.toLowerCase();

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <div className="relative min-h-screen flex flex-col items-center transition-all duration-500">
      {/* Snow / Background Animations */}
      <SnowAnimation />

      {/* Navbar */}
      {!shouldHideNavbar && (
        <div className="top-0 left-0 w-full z-50">
          <Nabar />
        </div>
      )}

      {/* Main Content */}
      <main
        className={`relative xl:px-[10%] lg:px-[8%] md:px-[6%] px-[5%] w-full flex-1 flex flex-col items-center transition-all duration-500
          ${shouldHideNavbar ? "pt-0" : "pt-16 sm:pt-20"}`}
      >
        <MainRouter />
      </main>

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
