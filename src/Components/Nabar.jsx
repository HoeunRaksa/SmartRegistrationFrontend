import { Button } from "./ui/Button"
import { Home, FileText, BarChart3, Info } from "lucide-react"
import "../App.css"
import { useNavigate } from "react-router-dom"
import { HiMiniBars4 } from "react-icons/hi2";
import { useState } from "react";
function Navbar() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/Login');
  }
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="glass border border-gray-200 rounded">
      <div className="flex items-center justify-between md:px-16 px-4 py-6">
        {/* Logo/Brand */}
        <div className="text-gray-700 font-bold md:text-2xl lg:mr-5 mr-0 sm:text-xl text-xl tracking-wide">
          <span className="text-orange-600 uppercase">NovaTech</span>
        </div>
        {/* Navigation Items + Login grouped together */}
        <div className="sm:flex px-4 mr-auto lg:space-x-8 space-x-3 hidden">
          <a
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Home className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Home</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <FileText className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Registration</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <BarChart3 className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Programs</span>
          </a>
          <a
            href="/AbouteUs"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Info className="sm:w-3 md:w-4 w-5 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">About Us</span>
          </a>
          {/* Login Button */}
        
        </div>
          <Button onClick={handleLogin} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 md:px-5 md:py-2 sm:px-4 sm:py-2 rounded font-semibold shadow-md hover:shadow-lg transition-all hidden lg:inline">
            Login
          </Button>
           <div className="sm:hidden">
          <HiMiniBars4
            className="text-3xl text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>   
      </div>
 <div
        className={`absolute top-full left-0 w-full navglass rounded-b-md flex flex-col p-4 space-y-3 sm:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-5 opacity-0 pointer-events-none"
        }`}
      >
        <a href="/" className="text-gray-800 font-medium hover:text-blue-600 transition">Home</a>
        <a href="#" className="text-gray-800 font-medium hover:text-blue-600 transition">Registration</a>
        <a href="#" className="text-gray-800 font-medium hover:text-blue-600 transition">Programs</a>
        <a href="/AboutUs" className="text-gray-800 font-medium hover:text-blue-600 transition">About Us</a>
        <Button
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Login
        </Button>
      </div>


    </nav>
  )
}
export default Navbar
