import { Button } from "../ui/Button.jsx";
import "../../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { showSuccess, ToastContainer } from "../ui/Toast.jsx";
import profile from "../../../public/assets/images/profile.png";

const User = {
  name: "Kakura",
  email: "kakura@example.com",
};

const NAV_LINKS = [
  { path: "/", label: "Home", color: "bg-green-500" },
  { path: "/curriculum", label: "Programs", color: "bg-gradient-to-r from-orange-400 to-red-500" },
  { path: "/aboutus", label: "About Us", color: "bg-cyan-500" },
  { path: "/registration", label: "Registration", color: "bg-blue-500" },
];

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = useCallback(() => setIsLoggedIn(true), []);
  const handleLogout = useCallback(() => setIsLoggedIn(false), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (isLoggedIn) showSuccess(`Welcome back, ${User.name}!`, "w-200");
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isMenuOpen) closeMenu();
    };
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isMenuOpen, closeMenu]);

  const handleNavLinkClick = () => closeMenu();

  return (
    <nav className="fixed backdrop-blur-2xl bg-white/40 w-full border-b border-white/20 shadow-lg xl:px-[10%] lg:px-[6%] md:px-[4%]">
      <ToastContainer />

      {/* Navbar */}
      <div className="flex items-center justify-between z-5000 px-4 sm:py-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wide transition duration-200 hover:opacity-80"
          onClick={closeMenu}
        >
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent uppercase z-50">
            NovaTech
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex px-4 lg:space-x-8 space-x-4">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="sm:text-sm md:text-xl font-medium uppercase text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons + Mobile Menu */}
        <div className="flex items-center space-x-2 z-10">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <div className="backdrop-blur-xl bg-white/30 p-1 rounded-full border border-white/40 shadow-lg">
                <img
                  src={profile}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={`${User.name}'s avatar`}
                />
              </div>
              <Button
                onClick={handleLogout}
                className="hidden lg:flex backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 text-sm rounded-full shadow-lg hover:shadow-xl transition-all border border-white/20"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="hidden lg:inline-flex backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 shadow-lg hover:shadow-xl transition-all text-sm font-semibold rounded-full border border-white/20 hover:scale-105"
            >
              Login
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden backdrop-blur-xl bg-white/40 p-2 rounded-full text-gray-700 hover:bg-white/60 transition focus:outline-none border border-white/20 shadow-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        className={`absolute top-1 left-0 w-full backdrop-blur-2xl bg-white/40 pt-20 -z-100 rounded-b-3xl shadow-xl flex flex-col p-6 sm:hidden transition-all duration-300 ease-in-out border-b border-white/20 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-4 mb-6">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={`mobile-${path}`}
              to={path}
              onClick={handleNavLinkClick}
              className="text-gray-700 text-base p-4 backdrop-blur-xl bg-white/40 rounded-2xl font-medium hover:bg-white/60 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition border border-white/20 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons (Mobile) */}
        {isLoggedIn ? (
          <Button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="backdrop-blur-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm py-3 mx-5 rounded-full shadow-lg hover:shadow-xl transition-all flex justify-center items-center border border-white/20"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleLogin();
              closeMenu();
            }}
            className="backdrop-blur-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm py-3 shadow-lg hover:shadow-xl transition-all rounded-full border border-white/20 hover:scale-105"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;