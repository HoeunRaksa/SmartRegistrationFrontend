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
    <nav className="fixed rounded-3xl z-50 backdrop-blur-2xl bg-white/40 w-full border-b border-white/20 shadow-lg xl:px-[10%] lg:px-[6%] md:px-[4%]">
      <ToastContainer />

      {/* Navbar */}
      <div className="flex items-center justify-between px-4 sm:py-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wide"
          onClick={closeMenu}
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent uppercase">
            NovaTech
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex lg:space-x-8 space-x-4">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="sm:text-sm md:text-xl font-medium uppercase text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleLogout}
                className="hidden lg:flex backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="hidden lg:inline-flex backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 rounded-full shadow-lg hover:scale-105 transition"
            >
              Login
            </Button>
          )}

          {/* Mobile toggle */}
          <button
            className="sm:hidden backdrop-blur-xl bg-white/40 p-2 rounded-full border border-white/30 shadow"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 w-full backdrop-blur-2xl bg-white/40 p-6 sm:hidden transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            onClick={closeMenu}
            className="block p-4 rounded-xl bg-white/40 mb-3 text-gray-700 font-medium"
          >
            {label}
          </Link>
        ))}

        {user ? (
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-full shadow-lg"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full shadow-lg"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
