import React, { useState, useEffect } from "react";
import MetricsCard from "./components/MetricsCard";
import EnrollmentChart from "./components/EnrollmentChat";
import PredictivePanel from "./components/PredictivePanel";
import StudentDataTable from "./components/StudentDataTable";
import GlobalControls from "./components/GlobalControls";

const StudentLifecycleTracker = () => {
  const [filters, setFilters] = useState({
    year: "2024-2025",
    program: "all",
    demographic: "all",
    comparison: false,
  });

  useEffect(() => {
    document.title = "Student Lifecycle Tracker - ClassRoom Analytics";
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const metricsData = [
    {
      title: "Enrollment Velocity",
      value: "2,250",
      change: "+12.5%",
      changeType: "positive",
      icon: "TrendingUp",
      description:
        "New student enrollments this academic year with 12.5% increase from previous period",
    },
    {
      title: "Retention Rate",
      value: "89.2%",
      change: "+2.1%",
      changeType: "positive",
      icon: "Users",
      description:
        "Student retention rate showing improvement in academic support programs",
    },
    {
      title: "Demographic Distribution",
      value: "4 Programs",
      change: "0%",
      changeType: "neutral",
      icon: "PieChart",
      description:
        "Active academic programs with balanced enrollment distribution",
    },
    {
      title: "Lifecycle Progression",
      value: "94.3%",
      change: "+1.8%",
      changeType: "positive",
      icon: "BarChart3",
      description:
        "Students progressing through academic milestones on schedule",
    },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Global Controls */}
      <GlobalControls onFiltersChange={handleFiltersChange} />
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metricsData?.map((metric, index) => (
          <MetricsCard
            key={index}
            title={metric?.title}
            value={metric?.value}
            change={metric?.change}
            changeType={metric?.changeType}
            icon={metric?.icon}
            description={metric?.description}
          />
        ))}
      </div>
      {/* Main Analytical Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Enrollment Chart - 8 columns */}
        <div className="lg:col-span-8">
          <EnrollmentChart />
        </div>
        {/* Predictive Panel - 4 columns */}
        <div className="lg:col-span-4">
          <PredictivePanel />
        </div>
      </div>
      {/* Student Data Table */}
      <StudentDataTable />
    </div>
  );
};

export default StudentLifecycleTracker;
