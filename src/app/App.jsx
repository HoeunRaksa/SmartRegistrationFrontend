import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Nabar from "../Components/navbar/Nabar";
import { Footer } from "../Components/footer/Footer";
import MainRouter from "../Router/mainRouter";
import "../App.css";
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
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const pathname = location.pathname.toLowerCase();

    if (!token || !userStr) return;

    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      localStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    // ✅ redirect from ROOT
    if (pathname === "/") {
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      }
      return;
    }

    // ✅ block login page for authenticated users
    if (pathname === "/login") {
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  const pathname = location.pathname.toLowerCase();
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  
  // Hide navbar for all dashboard routes (admin, staff, student)
  const shouldHideNavbar = isAdminRoute || isStudentRoute;
  
  // Hide footer for dashboard routes and auth pages
  const shouldHideFooter = isAdminRoute || isStudentRoute || pathname === "/registration" || pathname === "/login";

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navbar */}
      <AnimatePresence>
        {!shouldHideNavbar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
          >
            <div className="max-w-[1600px] mx-auto">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="backdrop-blur-2xl bg-gradient-to-r from-white/80 via-white/70 to-white/60 rounded-3xl border-2 border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_70px_rgba(139,92,246,0.3)] transition-all duration-300"
              >
                <Nabar />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`relative w-full flex-1 flex flex-col z-10 ${shouldHideNavbar ? "pt-0" : "pt-24"}`}>
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[calc(100vh-200px)]">
            {isAdminRoute || isStudentRoute ? (
              <MainRouter />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <MainRouter />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <AnimatePresence>
        {!shouldHideFooter && (
          <motion.footer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative z-10 w-full mt-16 px-4 pb-4"
          >
            <div className="max-w-[1600px] mx-auto">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="backdrop-blur-2xl bg-gradient-to-r from-white/80 via-white/70 to-white/60 rounded-3xl border-2 border-white/60 shadow-[0_-20px_60px_rgba(0,0,0,0.12)] hover:shadow-[0_-25px_70px_rgba(139,92,246,0.25)] transition-all duration-300"
              >
                <Footer />
              </motion.div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;