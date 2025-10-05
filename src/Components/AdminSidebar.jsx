import { NavLink } from "react-router-dom"
import { LayoutDashboard, DollarSign, FileText, Settings, GraduationCap, CreditCard } from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Paid Students", href: "/paid-students", icon: CreditCard },
  { title: "All Students", href: "/admin/students", icon: GraduationCap },
  { title: "Payments", href: "/admin/payments", icon: DollarSign },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground")
              }
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
