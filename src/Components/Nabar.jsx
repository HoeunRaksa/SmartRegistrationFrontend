import { Button } from "./ui/Button"
import { Home, FileText, BarChart3, Info } from "lucide-react"
import "../App.css"
import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/Login');
  }
  return (
    <nav className="glass border border-gray-200 rounded">
      <div className="flex items-center justify-between md:px-16 px-4 py-6">
        {/* Logo/Brand */}
        <div className="text-gray-700 font-bold sm:text-2xl text-xl tracking-wide">
          <span className="text-orange-600">NovaTech</span>
        </div>
        {/* Navigation Items + Login grouped together */}
        <div className="sm:flex px-5 mr-auto space-x-8 hidden">
          <a
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Home className="w-4 h-4 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Home</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <FileText className="w-4 h-4 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Registration</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <BarChart3 className="w-4 h-4 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">Programs</span>
          </a>
          <a
            href="/AbouteUs"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Info className="w-4 h-4 text-gray-700" />
            </div>
            <span className="lg:text-xl sm:text-sm text-xs text-gray-700">About Us</span>
          </a>
          {/* Login Button */}
        
        </div>
          <Button onClick={handleLogin} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-gray-700 px-6 py-2 rounded font-semibold shadow-md hover:shadow-lg transition-all">
            Login
          </Button>
      </div>
    </nav>
  )
}
export default Navbar
