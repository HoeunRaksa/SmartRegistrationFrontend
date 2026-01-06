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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const hideFooterRoutes = ["/registration","/admin/dashboard", "/login"];
  const hideNavbarRoutes = ["/admin/dashboard"];

  const pathname = location.pathname.toLowerCase();

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <div className="relative min-h-screen flex flex-col items-center transition-all duration-500 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      {/* Snow / Background Animations */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <SnowAnimation />
      </div>

      {/* Navbar with Glass Effect */}
      {!shouldHideNavbar && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="backdrop-blur-2xl bg-white/40 border-b border-white/20 shadow-lg">
            <Nabar />
          </div>
        </div>
      )}

      {/* Main Content with Glass Container */}
      <main
        className={`relative w-full flex-1 flex flex-col items-center transition-all duration-500 z-20
          ${shouldHideNavbar ? "pt-0" : "pt-20 sm:pt-24"}`}
      >
        <div className="w-full xl:px-[10%] lg:px-[8%] md:px-[6%] px-[5%]">
          {/* Optional: Add glass container for content */}
          <div className="min-h-[calc(100vh-200px)]">
            <MainRouter />
          </div>
        </div>
      </main>

      {/* Footer with Glass Effect */}
      {!shouldHideFooter && (
        <div className="relative w-full z-20 mt-auto">
          <div className="backdrop-blur-2xl bg-white/40 border-t border-white/20 shadow-lg">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;