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

  try {
    const user = JSON.parse(userStr);

    // 🚫 Block logged-in users from login page
    if (pathname === "/login") {
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }

    // 🔐 Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (user.role !== "admin" && user.role !== "staff") {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }

  } catch (err) {
    console.error("Invalid user data");
    localStorage.clear();
    navigate("/login", { replace: true });
  }
}, [location.pathname, navigate]);


  const pathname = location.pathname.toLowerCase();
  const isAdminRoute = pathname.startsWith("/admin");
  const shouldHideNavbar = isAdminRoute;
  const shouldHideFooter = isAdminRoute || pathname === "/registration" || pathname === "/login";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30">
      {/* Navbar */}
      <AnimatePresence>
        {!shouldHideNavbar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-4 left-0 w-full z-50 flex justify-center rounded-2xl px-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full rounded-[26px] backdrop-blur-[28px] bg-white/45 border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.22)] transition-shadow duration-300"
            >
              <Nabar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`relative w-full flex-1 flex flex-col items-center z-20 ${shouldHideNavbar ? "pt-0" : "pt-28"}`}>
        <div className="w-full xl:px-[10%] lg:px-[8%] md:px-[6%] px-[5%]">
          <div className="min-h-[calc(100vh-220px)]">
            {isAdminRoute ? (
              <MainRouter />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
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
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-full z-20 mt-10 flex justify-center px-4 pb-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-[1600px] rounded-[26px] backdrop-blur-[28px] bg-white/45 border border-white/30 shadow-[0_-20px_60px_rgba(0,0,0,0.12)] hover:shadow-[0_-25px_70px_rgba(0,0,0,0.16)] transition-shadow duration-300"
            >
              <Footer />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;