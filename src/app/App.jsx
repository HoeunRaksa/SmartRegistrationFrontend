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

    if (pathname === "/") {
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      }
      return;
    }

    if (pathname === "/login") {
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard", { replace: true });
      } else if (user.role === "student") {
        navigate("/student/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  const pathname = location.pathname.toLowerCase();
  const isAdminRoute = pathname.startsWith("/admin");
  const isTeacherRoute = pathname.startsWith("/teacher");
  const isStudentRoute = pathname.startsWith("/student");

  const shouldHideNavbar = isAdminRoute || isTeacherRoute || isStudentRoute;
  const shouldHideFooter =
    isAdminRoute || isTeacherRoute || isStudentRoute || pathname === "/registration" || pathname === "/login";

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50">
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
                className="backdrop-blur-xl bg-white/90 rounded-3xl border border-slate-200 shadow-lg transition-all"
              >
                <Nabar />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`relative w-full flex-1 flex flex-col ${
          shouldHideNavbar ? "pt-0" : "pt-24"
        }`}
      >
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[calc(100vh-200px)]">
            {isAdminRoute || isTeacherRoute || isStudentRoute ? (
              <MainRouter />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
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
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-full mt-16 px-4 pb-4"
          >
            <div className="max-w-[1600px] mx-auto">
              <motion.div
                whileHover={{ y: -2 }}
                className="backdrop-blur-xl bg-white/90 rounded-3xl border border-slate-200 shadow-lg transition-all"
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
