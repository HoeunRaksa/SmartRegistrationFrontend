import { useState } from "react"
import { ChevronFirst, LayoutDashboard, DollarSign, FileText, Settings, GraduationCap, CreditCard, UserIcon } from "lucide-react"
import Profile from "../assets/Images/profile.png"
import Logo from "../assets/Images/AdminLogo.png"
import PaidStudentsTable from "./PaidStudentsTable"

// Navigation items
const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Paid Students", icon: CreditCard, id: "paid-students" },
  { title: "All Students", icon: GraduationCap, id: "all-students" },
  { title: "Manage Students", icon: UserIcon, id: "manage-students" },
  { title: "Payments", icon: DollarSign, id: "payments" },
  { title: "Reports", icon: FileText, id: "reports" },
  { title: "Settings", icon: Settings, id: "settings" },
]

const AdminSidebar = ({ children }) => {
  const [activeView, setActiveView] = useState("dashboard")

  const renderContent = () => {
    switch (activeView) {
      case "paid-students":
        return <PaidStudentsTable />
      case "dashboard":
        return <div className="text-gray-600">Dashboard Content</div>
      case "all-students":
        return <div className="text-gray-600">All Students Content</div>
      case "manage-students":
        return <div className="text-gray-600">Manage Students Content</div>
      case "payments":
        return <div className="text-gray-600">Payments Content</div>
      case "reports":
        return <div className="text-gray-600">Reports Content</div>
      case "settings":
        return <div className="text-gray-600">Settings Content</div>
      default:
        return <div className="text-gray-600">Select a menu item</div>
    }
  }

  return (
    <section className="flex min-h-screen glass my-7">
      {/* Sidebar */}
      <aside className="w-64 border-r shadow-md flex flex-col justify-between">
        <div>
          {/* Logo & Title */}
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" width={40} height={40} className="object-contain" />
              <h4 className="font-bold text-gray-800">Admin Dashboard</h4>
            </div>
            <button className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition">
              <ChevronFirst className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Profile section */}
        <div className="border-t p-4 flex items-center gap-3">
          <img
            src={Profile}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-md object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 leading-tight">Lang Makara</p>
            <p className="text-xs text-gray-500">langmakara122@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </section>
  )
}

export default AdminSidebar;
