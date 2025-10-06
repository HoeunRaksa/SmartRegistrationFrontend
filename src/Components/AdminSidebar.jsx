import React from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronFirst,
  LayoutDashboard,
  DollarSign,
  FileText,
  Settings,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import logo from "../assets/Images/AdminLogo.png";
import Profiler from "../assets/Images/profile.png";

// Navigation items
const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Paid Students", href: "/paid-students", icon: CreditCard },
  { title: "All Students", href: "/admin/students", icon: GraduationCap },
  { title: "Payments", href: "/admin/payments", icon: DollarSign },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const AdminSidebar = ({ children }) => {
  return (
    <section className="flex min-h-screen glass my-7">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md flex flex-col justify-between">
        <div>
          {/* Logo & Title */}
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <img src={logo} className="w-10 h-10 object-contain" alt="Logo" />
              <h4 className="font-bold text-gray-800">Admin Dashboard</h4>
            </div>
            <button className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition">
              <ChevronFirst className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Profile section */}
        <div className="border-t p-4 flex items-center gap-3">
          <img
            src={Profiler}
            alt="Profile"
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <p className="font-semibold text-gray-800 leading-tight">John Doe</p>
            <p className="text-xs text-gray-500">langmakara122@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </section>
  );
};

export default AdminSidebar;
