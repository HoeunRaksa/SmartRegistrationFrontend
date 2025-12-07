import { Button } from "./ui/Button";
import { Home, FileText, BarChart3, Info, LogOut } from "lucide-react";
import "../App.css";
import { Link } from "react-router-dom";
import { HiMiniBars4 } from "react-icons/hi2";
import { useState, useEffect, useCallback } from "react";
import { ApiBaseImg } from "../Configration";
import { showSuccess, ToastContainer } from "./ui/Toast.jsx";

const User = {
  name: "Kakura",
  avatar: "Circle.png",
  email: "kakura@example.com",
};

const NAV_LINKS = [
  {
    path: "/",
    label: "Home",
    Icon: Home,
    color: "bg-green-500",
  },
  {
    path: "/curriculum",
    label: "Programs",
    Icon: BarChart3,
    color: "bg-gradient-to-r from-orange-400 to-red-500",
  },
  {
    path: "/aboutus",
    label: "About Us",
    Icon: Info,
    color: "bg-cyan-500",
  },
  {
    path: "/registration",
    label: "Registration",
    Icon: FileText,
    color: "bg-blue-500",
  },
];

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      showSuccess(`Welcome back, ${User.name}!`, 'w-200');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isMenuOpen, closeMenu]);

  const handleNavLinkClick = () => {
    closeMenu();
  };

  return (
    <nav className="sticky top-0 shadow-sm">
      <ToastContainer />
      <div className="flex items-center glass-bar z-5000 px-4 sm:py-4 py-2 md:px-16">
        <Link
          to="/"
          className="text-gray-700 font-extrabold text-xl sm:text-2xl tracking-wide transition duration-200 hover:opacity-80"
          onClick={closeMenu} 
        >
          <span className="text-orange-600 uppercase z-50">NovaTech</span>
        </Link>

        <div className="hidden sm:flex px-4  lg:space-x-8 space-x-4 mr-auto">
          {NAV_LINKS.map(({ path, label, Icon, color }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-200 group"
            >
              <div
                className={`w-7 h-7 ${color} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition`}
              >
                <Icon className="w-4 h-4 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                {label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center z-10 ml-auto space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <img
                src={`${ApiBaseImg}${User.avatar}`}
                className="w-10 h-10 rounded-full object-cover shadow-inner"
                alt={`${User.name}'s avatar`}
              />
              <Button
                onClick={handleLogout}
                className="hidden lg:flex bg-red-500 hover:bg-red-600  text-gray-700 px-3 py-1 text-sm rounded-full shadow-md transition-all items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 px-5 py-2 shadow-md hover:shadow-lg transition-all hidden lg:inline-flex text-sm font-semibold"
            >
              Login
            </Button>
          )}

          <button
            className="sm:hidden p-2  rounded-full text-gray-700 z-30 hover:bg-gray-100 transition focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <HiMiniBars4 className="text-3xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        id="mobile-menu"
        className={`absolute top-1 left-0 w-full  glass pt-20 -z-100 rounded-b-md shadow-xl flex flex-col p-6 sm:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6 pointer-events-none "
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

        {/* Auth Actions (Mobile) */}
        {isLoggedIn ? (
          <Button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="bg-red-500 hover:bg-red-600  text-gray-700 text-sm py-2 mx-5 rounded-full shadow-md transition-all flex justify-center items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleLogin();
              closeMenu();
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 text-sm py-2 shadow-md hover:shadow-lg transition-all"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;