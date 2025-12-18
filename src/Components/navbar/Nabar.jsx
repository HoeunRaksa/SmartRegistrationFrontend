import { Button } from "../ui/Button.jsx";
import "../../App.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ApiBaseImg } from "../../config/Configration.jsx";
import { showSuccess, ToastContainer } from "../ui/Toast.jsx";

const User = {
  name: "Kakura",
  avatar: "Circle.png",
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
    <nav className="sticky top-0 shadow-sm blue">
      <ToastContainer />

      {/* Navbar */}
      <div className="flex items-center justify-between glass-bar z-5000 px-4 sm:py-4 py-2 md:px-18">
        {/* Logo */}
        <Link
          to="/"
          className="text-gray-700 font-extrabold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wide transition duration-200 hover:opacity-80"
          onClick={closeMenu}
        >
          <span className="text-gray-700 uppercase z-50">NovaTech</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex px-4 lg:space-x-8 space-x-4">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="sm:text-sm md:text-xl font-medium uppercase text-gray-700 hover:text-blue-600 transition duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons + Mobile Menu */}
        <div className="flex items-center space-x-2 z-10">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <img
                src={`${ApiBaseImg}${User.avatar}`}
                className="w-10 h-10 rounded-full object-cover shadow-inner"
                alt={`${User.name}'s avatar`}
              />
              <Button
                onClick={handleLogout}
                className="hidden lg:flex bg-red-500 hover:bg-red-600 text-gray-700 px-3 py-1 text-sm rounded-full shadow-md transition-all"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="hidden lg:inline-flex bg-orange-500 text-gray-700 px-10 py-3 shadow-md hover:shadow-lg transition-all text-sm font-semibold"
            >
              Login
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        className={`absolute top-1 left-0 w-full glass pt-20 -z-100 rounded-b-md shadow-xl flex flex-col p-6 sm:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
      >
        <nav className="flex flex-col space-y-6 mb-6">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={`mobile-${path}`}
              to={path}
              onClick={handleNavLinkClick}
              className="text-gray-700 text-sm p-3 glass font-medium hover:bg-gray-100 hover:text-blue-600 transition"
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
            className="bg-red-500 hover:bg-red-600 text-gray-700 text-sm py-2 mx-5 rounded-full shadow-md transition-all flex justify-center items-center"
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleLogin();
              closeMenu();
            }}
            className="bg-orange-500 text-gray-700 text-sm py-3 shadow-md hover:shadow-lg transition-all"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;