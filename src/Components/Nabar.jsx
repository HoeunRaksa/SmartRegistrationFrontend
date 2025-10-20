import { Button } from "./ui/Button"
import { Home, FileText, BarChart3, Info } from "lucide-react"
import "../App.css"
import { useNavigate } from "react-router-dom"
import { HiMiniBars4 } from "react-icons/hi2";
import { useState } from "react";
import { ApiBaseImg } from "../Configration";
import { showSuccess, showError, ToastContainer } from "./ui/Toast.jsx";
import { useEffect } from "react";
import { Link } from "react-router-dom";
const User = {
  name: "Kakura",
  avatar: "Circle.png",
  email: "kakura@example.com"
};
function Navbar() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleLogin = () => setIsLogin(true);
  useEffect(() => {
    if (isLogin) {
      showSuccess(`Welcome back, ${User.name}!`, 'w-200');
    }
  }, [isLogin]);
  return (
    <nav className="glass border rounded-lg mx-3">
      <ToastContainer />
      <div className="flex items-center justify-between md:px-16 px-4 py-4">
        {/* Logo/Brand */}
        <div className="text-gray-700 font-bold md:text-2xl lg:mr-5 mr-0 sm:text-xl text-xl tracking-wide">
          <span className="text-orange-600 uppercase">NovaTech</span>
        </div>
        {/* Navigation Items + Login grouped together */}
        <div className="sm:flex px-4 mr-auto lg:space-x-8 space-x-3 hidden">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Home className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700 ">Home</span>
          </Link>

          <Link
            to="/curriculum"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <BarChart3 className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Programs</span>
          </Link>

          <Link
            to="/aboutus"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Info className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">About Us</span>
          </Link>
          <Link
            to="/registration"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <FileText className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Registration</span>
          </Link>
        </div>

        {isLogin ? (
          <div className="relative max-w-15" ><img src={`${ApiBaseImg}${User.avatar}`} className="w-full" alt="" /></div>
        ) : (
          <div>
            <Button onClick={handleLogin} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 md:px-5 md:py-2 sm:px-4 sm:py-2 rounded font-semibold shadow-md hover:shadow-lg transition-all hidden lg:inline">
              Login
            </Button>
          </div>
        )}
        <div className="sm:hidden">
          <HiMiniBars4
            className="text-3xl text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
      <div
        className={`absolute top-full left-0 w-full glass rounded-b-md flex flex-col p-4 space-y-3 sm:hidden transform transition-transform duration-300 ease-in-out ${isOpen
          ? "translate-y-0 opacity-100"
          : "-translate-y-5 opacity-0 pointer-events-none"
          }`}
      >
        <nav className="flex p-5 flex-col space-y-6">
          <Link to="/" className="text-gray-800 p-3 itemglass font-medium hover:text-blue-600 transition rounded-lg">
            Home
          </Link>
          <Link to="/curriculum" className="text-gray-800 p-3 itemglass font-medium hover:text-blue-600 transition rounded-lg">
            Programs
          </Link>
          <Link to="/aboutus" className="text-gray-800 p-3 itemglass font-medium hover:text-blue-600 transition  rounded-lg">
            About Us
          </Link>
          <Link to="/registration" className="text-gray-800 p-3 itemglass font-medium hover:text-blue-600 transition  rounded-lg">
            Registration
          </Link>
        </nav>
        <Button
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 md:px-5 md:py-2 sm:px-4 sm:py-2 mx-5 rounded font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Login
        </Button>
      </div>
    </nav>
  )
}
export default Navbar
