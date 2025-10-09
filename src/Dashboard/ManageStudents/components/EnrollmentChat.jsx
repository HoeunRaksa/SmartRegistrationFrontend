import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../Components/ManageStu-ui/Button';

const EnrollmentChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('12months');

  const enrollmentData = [
    { month: 'Jan 2024', enrolled: 1250, graduated: 180, dropped: 45, active: 1025 },
    { month: 'Feb 2024', enrolled: 1320, graduated: 165, dropped: 52, active: 1103 },
    { month: 'Mar 2024', enrolled: 1450, graduated: 220, dropped: 38, active: 1192 },
    { month: 'Apr 2024', enrolled: 1380, graduated: 195, dropped: 41, active: 1144 },
    { month: 'May 2024', enrolled: 1520, graduated: 280, dropped: 35, active: 1205 },
    { month: 'Jun 2024', enrolled: 1680, graduated: 320, dropped: 42, active: 1318 },
    { month: 'Jul 2024', enrolled: 1750, graduated: 185, dropped: 48, active: 1517 },
    { month: 'Aug 2024', enrolled: 1890, graduated: 210, dropped: 55, active: 1625 },
    { month: 'Sep 2024', enrolled: 2100, graduated: 240, dropped: 38, active: 1822 },
    { month: 'Oct 2024', enrolled: 2250, graduated: 195, dropped: 45, active: 2010 }
  ];

  const demographicData = [
    { name: 'Computer Science', value: 35, count: 787 },
    { name: 'Business Admin', value: 28, count: 630 },
    { name: 'Engineering', value: 22, count: 495 },
    { name: 'Liberal Arts', value: 15, count: 338 }
  ];

  const COLORS = ['#1E40AF', '#6366F1', '#F59E0B', '#10B981'];

  const chartTypes = [
    { id: 'line', label: 'Trend', icon: 'TrendingUp' },
    { id: 'bar', label: 'Compare', icon: 'BarChart3' },
    { id: 'pie', label: 'Distribution', icon: 'PieChart' }
  ];

  const timeRanges = [
    { id: '6months', label: '6M' },
    { id: '12months', label: '12M' },
    { id: '24months', label: '24M' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="enrolled" 
                stroke="#1E40AF" 
                strokeWidth={3}
                name="New Enrollments"
                dot={{ fill: '#1E40AF', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Active Students"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="graduated" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Graduated"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={enrollmentData?.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="enrolled" fill="#1E40AF" name="New Enrollments" radius={[4, 4, 0, 0]} />
              <Bar dataKey="graduated" fill="#10B981" name="Graduated" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dropped" fill="#EF4444" name="Dropped" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={demographicData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {demographicData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${props?.payload?.count} students (${value}%)`,
                  props?.payload?.name
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Student Enrollment Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Track enrollment patterns and lifecycle progression
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {chartTypes?.map((type) => (
              <Button
                key={type?.id}
                variant={chartType === type?.id ? "default" : "ghost"}
                size="sm"
                iconName={type?.icon}
                onClick={() => setChartType(type?.id)}
                className="h-8 px-3"
              >
                {type?.label}
              </Button>
            ))}
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <Button
                key={range?.id}
                variant={timeRange === range?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range?.id)}
                className="h-8 px-3"
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Chart Legend/Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-semibold text-foreground">2,250</div>
          <div className="text-sm text-muted-foreground">Total Enrolled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-success">2,010</div>
          <div className="text-sm text-muted-foreground">Active Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-warning">195</div>
          <div className="text-sm text-muted-foreground">Recent Graduates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-error">45</div>
          <div className="text-sm text-muted-foreground">Dropped Out</div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentChart;