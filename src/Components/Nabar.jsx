import { Button } from "./ui/Button"
import { Home, FileText, BarChart3, Info } from "lucide-react"
import "../App.css"

function Navbar() {
  return (
    <nav className="backdrop-blur-md glass border border-gray-200 rounded-2xl shadow-md my-4">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="text-white font-bold text-xl tracking-wide">
          Department Of War
        </div>

        {/* Navigation Items + Login grouped together */}
        <div className="flex items-center space-x-8">
          <a
            href="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white khmerFont">ទំព័រដើម</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white khmerFont">ការចុះឈ្មោះ</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white khmerFont">កម្មវិធីសិក្សា</span>
          </a>

          <a
            href="/AbouteUs"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
          >
            <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center shadow hover:scale-110 transition">
              <Info className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white khmerFont">អំពីយើង</span>
          </a>
          {/* Login Button */}
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
