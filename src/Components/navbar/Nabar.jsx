import { Button } from "../ui/Button.jsx";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer, showSuccess } from "../ui/Toast.jsx";
import { logoutApi } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/curriculum", label: "Programs" },
  { path: "/aboutus", label: "About Us" },
  { path: "/registration", label: "Registration" },
];

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (_) {
      // ignore backend error
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    showSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="relative gen-z-perspective" style={{ transformStyle: 'preserve-3d' }}>
      <ToastContainer />

      {/* Navbar Content */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide"
            onClick={closeMenu}
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 100%" }}
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent uppercase drop-shadow-lg inline-block"
            >
              NovaTech
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex lg:space-x-8 md:space-x-6">
          {NAV_LINKS.map(({ path, label }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={path}
                className="relative text-sm lg:text-base font-semibold uppercase text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 group"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10"
                >
                  {label}
                </motion.span>
                <motion.span
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="backdrop-blur-xl bg-white/60 px-4 py-2 rounded-full border border-white/60 gen-z-glass">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="relative backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full gen-z-btn gen-z-glow-pink shadow-lg hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all duration-300 font-semibold border border-white/30 overflow-hidden group"
              >
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                <span className="relative z-10">Logout</span>
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2.5 rounded-full gen-z-btn gen-z-glow-purple shadow-lg hover:shadow-[0_10px_30px_rgba(139,92,246,0.4)] transition-all duration-300 font-semibold border border-white/30 overflow-hidden group"
            >
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative z-10">Login</span>
            </motion.button>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden backdrop-blur-xl bg-white/60 p-2.5 rounded-full border-2 border-white/60 gen-z-glass shadow-lg transition-all duration-300"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <motion.svg
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="backdrop-blur-xl bg-white/40 border-t-2 border-white/40 gen-z-glass p-4 space-y-2 rounded-b-3xl">
              {NAV_LINKS.map(({ path, label }, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={path}
                    onClick={closeMenu}
                    className="block backdrop-blur-xl bg-white/60 p-3 rounded-xl text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-white/60"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="inline-block"
                    >
                      {label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}

          {user ? (
            <div className="space-y-2 pt-2 border-t-2 border-white/40">
              <div className="backdrop-blur-xl bg-white/60 p-3 rounded-xl border border-white/60 text-center">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl shadow-lg font-semibold border border-white/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
              className="w-full backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl shadow-lg font-semibold border border-white/30 mt-2"
            >
              Login
            </button>
          )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;