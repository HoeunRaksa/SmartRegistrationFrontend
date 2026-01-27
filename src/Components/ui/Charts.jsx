// Reusable Chart Components with Standardized Palette
import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Strict 3-Color Professional Palette
export const CHART_COLORS = {
    primary: ['#2563eb', '#4f46e5', '#7c3aed', '#3b82f6', '#6366f1'],
    palette: {
        blue: '#2563eb',
        indigo: '#4f46e5',
        purple: '#7c3aed',
    },
    gradients: {
        blue: ['#2563eb', '#60a5fa'],
        indigo: ['#4f46e5', '#818cf8'],
        purple: ['#7c3aed', '#a78bfa'],
    }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="backdrop-blur-xl bg-white/90 p-4 rounded-xl border-2 border-white/60 shadow-2xl"
            >
                <p className="font-bold text-gray-800 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}:</span>
                        <span className="font-bold text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </motion.div>
        );
    }
    return null;
};

export const TrendChart = ({ data, dataKey, title, color = CHART_COLORS.palette.blue }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border-2 border-white/60 shadow-lg"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        fill={`url(#gradient-${dataKey})`}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export const ComparisonBarChart = ({ data, dataKeys, title, colors = CHART_COLORS.primary }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border-2 border-white/60 shadow-lg"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6', opacity: 0.4 }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    {dataKeys.map((key, index) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[index % colors.length]}
                            radius={[6, 6, 0, 0]}
                            animationDuration={1500}
                            barSize={30}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export const DistributionPieChart = ({ data, title }) => {
    const COLORS = CHART_COLORS.primary;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border-2 border-white/60 shadow-lg"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export const MultiLineChart = ({ data, dataKeys, title, colors = CHART_COLORS.primary }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border-2 border-white/60 shadow-lg"
        >
            <h3 className="text-lg font-bold text-gray-800 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    {dataKeys.map((key, index) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors[index % colors.length]}
                            strokeWidth={3}
                            dot={{ r: 4, fill: colors[index % colors.length], strokeWidth: 2, stroke: 'white' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export const SparklineChart = ({ data, color = CHART_COLORS.palette.blue }) => {
    return (
        <div className="w-full h-10">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill="url(#sparkGradient)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default { TrendChart, ComparisonBarChart, DistributionPieChart, MultiLineChart, SparklineChart };
