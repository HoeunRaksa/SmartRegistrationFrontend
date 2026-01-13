import { Button } from "../ui/Button.jsx";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ToastContainer, showSuccess } from "../ui/Toast.jsx";
import { logoutApi } from "../../api/auth";

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
    <nav className="relative">
      <ToastContainer />

      {/* Navbar Content */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-wide"
          onClick={closeMenu}
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent uppercase drop-shadow-lg">
            NovaTech
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex lg:space-x-8 md:space-x-6">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="relative text-sm lg:text-base font-semibold uppercase text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 group"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="backdrop-blur-xl bg-white/60 px-4 py-2 rounded-full border border-white/60">
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="relative backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:scale-105 transition-all duration-300 font-semibold border border-white/30 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:inline-flex relative backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-2.5 rounded-full shadow-lg hover:shadow-[0_10px_30px_rgba(139,92,246,0.4)] hover:scale-105 transition-all duration-300 font-semibold border border-white/30 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10">Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden backdrop-blur-xl bg-white/60 p-2.5 rounded-full border-2 border-white/60 shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="backdrop-blur-xl bg-white/40 border-t-2 border-white/40 p-4 space-y-2 rounded-b-3xl">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMenu}
              className="block backdrop-blur-xl bg-white/60 p-3 rounded-xl text-gray-700 font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-white/60"
            >
              {label}
            </Link>
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
      </div>
    </nav>
  );
}

export default Navbar;