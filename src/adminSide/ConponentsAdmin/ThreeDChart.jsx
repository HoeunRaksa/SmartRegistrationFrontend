import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const ThreeDChart = ({ data }) => {
    const [viewMode, setViewMode] = useState('revenue'); // 'revenue' or 'students'
    const [rotation, setRotation] = useState({ x: 60, z: -45 });

    // Process data for the grid
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return { matrix: [], maxVal: 0, depts: [], months: [] };

        // Unique Departments and Months
        const depts = [...new Set(data.map(d => d.dept_name))].sort();
        const months = [...new Set(data.map(d => `${d.year}-${d.month}`))].sort();

        // Map data to grid
        const matrix = depts.map(dept => {
            return months.map(month => {
                const [y, m] = month.split('-');
                const item = data.find(d => d.dept_name === dept && d.year == y && d.month == m);

                let value = 0;
                if (item) {
                    value = viewMode === 'revenue'
                        ? parseFloat(item.revenue)
                        : parseInt(item.student_count);
                }
                return { value, dept, month };
            });
        });

        // Find max value for scaling
        const maxVal = Math.max(...matrix.flat().map(i => i.value)) || 1;

        return { matrix, maxVal, depts, months };
    }, [data, viewMode]);

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/40 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Dimensional Analytics
                    </h3>
                    <p className="text-sm text-gray-500">Departments vs Time ({viewMode})</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('students')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${viewMode === 'students' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border'}`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setViewMode('revenue')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${viewMode === 'revenue' ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border'}`}
                    >
                        Revenue
                    </button>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div className="flex-1 flex items-center justify-center perspective-1000 py-10" style={{ perspective: '1000px' }}>
                <motion.div
                    className="relative transform-style-3d"
                    initial={{ rotateX: 60, rotateZ: -45 }}
                    animate={{ rotateX: rotation.x, rotateZ: rotation.z }}
                    transition={{ type: "spring", stiffness: 50 }}
                    style={{
                        transformStyle: 'preserve-3d',
                        width: '300px',
                        height: '300px',
                    }}
                    onMouseMove={(e) => {
                        // Simple interactive tilt
                        const { clientX, clientY } = e;
                        // In a real app, calculate relative to center. 
                        // For now keeping it static controllable or auto-animated could be better, 
                        // but user wants "3D dashboard".
                    }}
                >
                    {/* Base Grid */}
                    <div
                        className="absolute inset-0 bg-white/40 border border-gray-300 shadow-2xl rounded-xl"
                        style={{ transform: 'translateZ(0px)' }}
                    />

                    {/* Bars */}
                    {processedData.matrix.map((row, rIdx) => (
                        <React.Fragment key={`row-${rIdx}`}>
                            {row.map((cell, cIdx) => {
                                const height = (cell.value / processedData.maxVal) * 150; // Max height 150px
                                if (height === 0) return null;

                                const x = cIdx * 40 - (row.length * 20);
                                const y = rIdx * 40 - (processedData.matrix.length * 20);

                                return (
                                    <motion.div
                                        key={`${rIdx}-${cIdx}`}
                                        className="absolute bottom-0"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(height, 2)}px` }}
                                        transition={{ duration: 0.8, delay: (rIdx + cIdx) * 0.05 }}
                                        style={{
                                            width: '24px',
                                            height: `${Math.max(height, 2)}px`,
                                            background: viewMode === 'revenue'
                                                ? `linear-gradient(to top, rgba(16, 185, 129, 0.8), rgba(52, 211, 153, 0.9))`
                                                : `linear-gradient(to top, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.9))`,
                                            transform: `translate3d(${x}px, ${y}px, 0px) rotateX(-90deg)`,
                                            transformOrigin: 'bottom center',
                                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1), 5px 5px 15px rgba(0,0,0,0.2)'
                                        }}
                                    >
                                        {/* Top Cap */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-[24px]"
                                            style={{
                                                background: viewMode === 'revenue' ? '#34d399' : '#60a5fa',
                                                transform: 'translateY(-100%) rotateX(90deg)',
                                                transformOrigin: 'bottom'
                                            }}
                                        />
                                        {cell.value > 0 && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-700 bg-white/80 px-1 rounded shadow"
                                                style={{ transform: 'rotateX(90deg)' }}>
                                                {cell.value >= 1000 ? `${(cell.value / 1000).toFixed(1)}k` : cell.value}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </motion.div>
            </div>

            {/* Legend / Controls */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <strong>Shortcuts:</strong> Hover to inspect (coming soon).
                    Current View: {processedData.depts.length} Depts x {processedData.months.length} Months.
                </div>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => setRotation(r => ({ ...r, z: r.z + 45 }))}
                        className="px-3 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                        Rotate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreeDChart;
