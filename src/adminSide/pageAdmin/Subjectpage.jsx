import React from "react";
import SubjectsForm from '../ConponentsAdmin/SubjectsForm.jsx';
import {
  BookOpen,
  Home,
  ChevronRight,
  Settings,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

const SubjectsPage = () => {
  const quickStats = [
    { label: "Active", value: "24", color: "from-green-500 to-emerald-500", icon: TrendingUp },
    { label: "Students", value: "2.4K", color: "from-blue-500 to-cyan-500", icon: Users },
    { label: "Growth", value: "+18%", color: "from-purple-500 to-pink-500", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6 z-100">
      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
          <Home className="w-4 h-4" />
          <span>Home</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
          <span>Management</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <div className="flex items-center gap-2 text-blue-600 font-medium">
          <BookOpen className="w-4 h-4" />
          <span>Subjects</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="bg-white/40 rounded-3xl p-6 border border-white/50 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title Section */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-1">
                Subjects Management
              </h1>
              <p className="text-sm text-gray-600">
                Create, manage, and organize your academic subjects
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex-1 min-w-[90px]">
                  <div className="bg-white/50 rounded-2xl p-3 border border-white/40 shadow-md hover:shadow-lg transition-shadow">
                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${stat.color} mb-1.5`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FORM */}
      <SubjectsForm />
    </div>
  );
};

export default SubjectsPage;