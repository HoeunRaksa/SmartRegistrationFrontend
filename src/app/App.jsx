import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Nabar from "../Components/navbar/Nabar";
import { Footer } from "../Components/footer/Footer";
import MainRouter from "../Router/mainRouter";
import "../App.css";
import { ToastProvider } from "../Components/Context/ToastProvider";
import { AdminDataProvider } from "../contexts/AdminDataContext";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AdminDataProvider>
          <AppContent />
        </AdminDataProvider>
      </ToastProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const navTransition = reducedMotion
    ? { duration: 0.12, ease: "easeOut" }
    : { type: "spring", stiffness: 200, damping: 25 };
  const pageTransition = reducedMotion
    ? { duration: 0.1, ease: "easeOut" }
    : { duration: 0.35, ease: "easeInOut" };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const pathname = location.pathname.toLowerCase();

    if (!userStr) return;

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
    <div className="relative min-h-screen w-full flex flex-col bg-white gen-z-perspective overflow-x-hidden">
      {/* Navbar */}
      <AnimatePresence>
        {!shouldHideNavbar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={navTransition}
            className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
          >
            <div className="max-w-[1600px] mx-auto">
              <motion.div
                whileHover={reducedMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.2 }}
                className="glass gen-z-glass transition-all"
              >
                <Nabar />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - no horizontal overflow; footer stays at bottom */}
      <main
        className={`relative w-full flex-1 flex flex-col min-h-0 overflow-x-hidden ${shouldHideNavbar ? "pt-0" : "pt-24"
          }`}
      >
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 min-w-0 flex-1">
          <div className="min-h-[calc(100vh-200px)] w-full min-w-0">
            {isAdminRoute || isTeacherRoute || isStudentRoute ? (
              <MainRouter />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={pageTransition}
                >
                  <MainRouter />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      {/* Footer - stays at bottom, no overflow */}
      <AnimatePresence>
        {!shouldHideFooter && (
          <motion.footer
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={navTransition}
            className="relative w-full mt-auto flex-shrink-0 px-4 pb-4 overflow-x-hidden"
          >
            <div className="w-full max-w-[1600px] mx-auto min-w-0">
              <motion.div
                whileHover={reducedMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.2 }}
                className="glass gen-z-glass transition-all"
              >
                <Footer />
              </motion.div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
      {/* Gen Z global background - depth blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[120px] -ml-64 -mb-64" />
      </div>
    </div>
  );
}

export default App;
