import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Eye, Sparkles, Orbit, ZoomIn, ZoomOut, Play, Pause,
    DollarSign, BookOpen, Building2, Plus, Users, Layout, Zap, Database
} from 'lucide-react';

const University3DHub = ({ stats, charts, extendedStats, activities, systemStatus }) => {
    const [viewMode, setViewMode] = useState('summary'); // summary, finance, academics, operations
    const [autoRotate, setAutoRotate] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [cameraMode, setCameraMode] = useState('orbit');
    const [particleIntensity, setParticleIntensity] = useState('high');
    const [visualMode, setVisualMode] = useState('neural');

    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const timeRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            init3DView();
            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
            };
        }
    }, [viewMode, stats, charts, extendedStats, visualMode, particleIntensity]);

    const init3DView = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        let time = 0;
        let rotationAngle = 0;
        let cameraOffset = { x: 0, y: 0, z: 0 };
        let targetCameraOffset = { x: 0, y: 0, z: 0 };

        const particleCounts = { low: 500, medium: 2000, high: 5000, ultra: 10000 };
        const particleCount = particleCounts[particleIntensity];

        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: (Math.random() - 0.5) * 2000,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                speedZ: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 0.5,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                pulseOffset: Math.random() * Math.PI * 2,
                life: Math.random() * 100,
            });
        }

        const neuralNodes = [];
        for (let i = 0; i < 50; i++) {
            neuralNodes.push({
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 600,
                z: (Math.random() - 0.5) * 800,
                connections: [],
                activity: Math.random(),
                size: Math.random() * 15 + 5,
            });
        }

        neuralNodes.forEach((node, i) => {
            neuralNodes.forEach((otherNode, j) => {
                if (i !== j) {
                    const distance = Math.sqrt((node.x - otherNode.x) ** 2 + (node.y - otherNode.y) ** 2 + (node.z - otherNode.z) ** 2);
                    if (distance < 200 && Math.random() > 0.7) node.connections.push(j);
                }
            });
        });

        // --- Data-Driven Visual Units ---
        const dataIslands = [
            { x: -600, y: -200, z: 0, size: 180, color: '#3b82f6', value: stats.totalStudents, label: 'Students', icon: '👥' },
            { x: -200, y: -200, z: 0, size: 180, color: '#a855f7', value: stats.totalCourses, label: 'Courses', icon: '📚' },
            { x: 200, y: -200, z: 0, size: 180, color: '#10b981', value: stats.totalDepartments, label: 'Departments', icon: '🏢' },
            { x: 600, y: -200, z: 0, size: 180, color: '#f59e0b', value: stats.pendingRegistrations, label: 'Pending', icon: '🎓' },
        ];

        const revenueTowers = (charts.revenueByDept || []).map((dept, i) => ({
            x: i * 150 - 500, y: 300, z: -400, width: 80, height: Math.max((dept.total_revenue / 1000) * 1.5, 50), depth: 80,
            color: `hsl(${140 + i * 20}, 70%, 50%)`, label: dept.name, value: dept.total_revenue, growth: Math.random() * 20 - 10
        }));

        const academicTowers = (extendedStats.academicStats || []).map((dept, i) => ({
            x: i * 150 - 300, y: 300, z: 400, width: 70, height: (parseFloat(dept.avg_gpa) || 0) * 80, depth: 70,
            color: `hsl(${260 - i * 15}, 70%, 55%)`, label: dept.dept_name, value: parseFloat(dept.avg_gpa).toFixed(2), subtitle: 'GPA'
        }));

        const attendanceOrbs = (extendedStats.attendanceStats || []).map((dept, i) => ({
            x: (i - 2) * 200, y: -400, z: 0, size: Math.max((parseFloat(dept.rate) || 50) * 2, 30),
            color: parseFloat(dept.rate) >= 80 ? '#10b981' : parseFloat(dept.rate) >= 60 ? '#f59e0b' : '#ef4444',
            label: dept.dept_name, value: parseFloat(dept.rate).toFixed(1) + '%'
        }));

        const campusBlocks = (extendedStats.campusStats || []).map((room, i) => ({
            x: (i % 5) * 150 - 300, y: 500, z: (Math.floor(i / 5)) * 150 - 300,
            width: 100, height: (parseInt(room.session_count) || 1) * 20, depth: 100,
            color: `hsl(${20 + i * 30}, 80%, 60%)`, label: room.room_name || room.room_number, value: room.session_count
        }));

        const majorBadges = (charts.popularMajors || []).slice(0, 8).map((major, i) => ({
            angle: (i / 8) * Math.PI * 2, orbitRadius: 700, y: -100, size: 40 + (major.count / 10),
            color: `hsl(${180 + i * 25}, 70%, 55%)`, label: major.name, value: major.count, orbitSpeed: 0.001 + i * 0.0002
        }));

        const project3D = (x, y, z, scale = 1) => {
            const perspective = 1200;
            const scaledX = x + cameraOffset.x;
            const scaledY = y + cameraOffset.y;
            const scaledZ = z + cameraOffset.z;
            const centerX = width / 2 / window.devicePixelRatio;
            const centerY = height / 2 / window.devicePixelRatio;
            const scale3d = perspective / (perspective + scaledZ) * scale * zoom;
            return { x: centerX + scaledX * scale3d, y: centerY + scaledY * scale3d, scale: scale3d, z: scaledZ };
        };

        const rotatePoint = (x, y, z, angleY, angleX = 0) => {
            const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
            const x1 = x * cosY - z * sinY, z1 = x * sinY + z * cosY;
            const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
            return { x: x1, y: y * cosX - z1 * sinX, z: y * sinX + z1 * cosX };
        };

        // --- Core Rendering Functions ---
        const drawHolographicCube = (island, rotation) => {
            const s = island.size / 2;
            const vertices = [[-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s], [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]];
            const rotatedVertices = vertices.map(([x, y, z]) => {
                const rotated = rotatePoint(x, y, z, rotation, Math.sin(time * 0.5) * 0.3);
                return project3D(rotated.x + island.x, rotated.y + island.y, rotated.z + island.z);
            });
            const faces = [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]];
            faces.forEach((face, i) => {
                ctx.beginPath();
                ctx.moveTo(rotatedVertices[face[0]].x, rotatedVertices[face[0]].y);
                face.forEach(v => ctx.lineTo(rotatedVertices[v].x, rotatedVertices[v].y));
                ctx.closePath();
                const brightness = 0.3 + (i / faces.length) * 0.5 + Math.sin(time + i) * 0.2;
                ctx.fillStyle = island.color + Math.floor(brightness * 150).toString(16).padStart(2, '0');
                ctx.globalAlpha = 0.6 + Math.sin(time * 2 + i) * 0.2;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = island.color;
                ctx.stroke();
            });
            const centerProj = project3D(island.x, island.y - s - 100, island.z);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px monospace'; ctx.textAlign = 'center';
            ctx.fillText(island.value.toLocaleString(), centerProj.x, centerProj.y);
            ctx.font = 'bold 12px monospace'; ctx.fillStyle = island.color;
            ctx.fillText(island.label.toUpperCase(), centerProj.x, centerProj.y + 20);
        };

        const draw3DTower = (tower, rotation) => {
            const cos = Math.cos(rotation), sin = Math.sin(rotation);
            const w = tower.width / 2, h = tower.height, d = tower.depth / 2;
            const vertices = [[-w, 0, -d], [w, 0, -d], [w, 0, d], [-w, 0, d], [-w, -h, -d], [w, -h, -d], [w, -h, d], [-w, -h, d]];

            const rotatedVertices = vertices.map(([vx, vy, vz]) => {
                const rx = vx * cos - vz * sin;
                const rz = vx * sin + vz * cos;
                return project3D(rx + tower.x, vy + tower.y, rz + tower.z);
            });

            const faces = [[4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
            faces.forEach((face, i) => {
                ctx.beginPath();
                ctx.moveTo(rotatedVertices[face[0]].x, rotatedVertices[face[0]].y);
                face.forEach(v => ctx.lineTo(rotatedVertices[v].x, rotatedVertices[v].y));
                ctx.closePath();

                const grad = ctx.createLinearGradient(
                    rotatedVertices[face[0]].x, rotatedVertices[face[0]].y,
                    rotatedVertices[face[2]].x, rotatedVertices[face[2]].y
                );
                const brightness = 0.4 + (i / faces.length) * 0.4;
                grad.addColorStop(0, tower.color);
                grad.addColorStop(1, `hsl(${rotationAngle * 50 + i * 20}, 70%, ${20 + brightness * 30}%)`);

                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.8;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.stroke();
            });

            const top = project3D(tower.x, tower.y - h - 30, tower.z);
            ctx.shadowBlur = 15; ctx.shadowColor = tower.color;
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
            ctx.fillText(tower.value, top.x, top.y);
            ctx.font = 'bold 10px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.fillText(tower.label.toUpperCase(), top.x, top.y + 15);
            ctx.shadowBlur = 0;
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Background
            const bgGradient = ctx.createRadialGradient(width / 2 / window.devicePixelRatio, height / 2 / window.devicePixelRatio, 0, width / 2 / window.devicePixelRatio, height / 2 / window.devicePixelRatio, width);
            bgGradient.addColorStop(0, visualMode === 'matrix' ? '#001a00' : '#0f172a');
            bgGradient.addColorStop(1, '#020617');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width / window.devicePixelRatio, height / window.devicePixelRatio);

            time += 0.016;
            if (autoRotate) rotationAngle += 0.005;

            targetCameraOffset.x = mouseRef.current.x * 100;
            targetCameraOffset.y = mouseRef.current.y * 50;
            cameraOffset.x += (targetCameraOffset.x - cameraOffset.x) * 0.05;
            cameraOffset.y += (targetCameraOffset.y - cameraOffset.y) * 0.05;

            // Layers
            if (visualMode === 'neural') {
                neuralNodes.forEach((node, i) => {
                    const proj = project3D(node.x, node.y, node.z);
                    ctx.beginPath(); ctx.arc(proj.x, proj.y, node.size * proj.scale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(147, 51, 234, ${Math.sin(time + i) * 0.3 + 0.4})`;
                    ctx.fill();
                });
            }

            particles.forEach((p, i) => {
                p.y += p.speedY; if (p.y > 1000) p.y = -1000;
                const proj = project3D(p.x, p.y, p.z);
                ctx.beginPath(); ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
                ctx.fillStyle = visualMode === 'matrix' ? '#22c55e' : p.color;
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // View Mode Specifics
            if (viewMode === 'summary') dataIslands.forEach(island => drawHolographicCube(island, rotationAngle));
            if (viewMode === 'finance') revenueTowers.forEach(tower => draw3DTower(tower, rotationAngle));
            if (viewMode === 'academics') academicTowers.forEach(tower => draw3DTower(tower, rotationAngle));
            if (viewMode === 'operations') {
                attendanceOrbs.forEach((orb, i) => {
                    const pulse = Math.sin(time * 2 + i) * 0.2 + 1;
                    const proj = project3D(orb.x, orb.y, orb.z);

                    const grad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, orb.size * proj.scale * pulse);
                    grad.addColorStop(0, orb.color);
                    grad.addColorStop(1, 'transparent');

                    ctx.beginPath(); ctx.arc(proj.x, proj.y, orb.size * proj.scale * pulse, 0, Math.PI * 2);
                    ctx.fillStyle = grad; ctx.fill();

                    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
                    ctx.fillText(orb.value, proj.x, proj.y + 5);
                    ctx.font = 'bold 10px monospace'; ctx.fillStyle = orb.color;
                    ctx.fillText(orb.label, proj.x, proj.y - orb.size * proj.scale * pulse - 10);
                });
                campusBlocks.forEach(block => draw3DTower(block, rotationAngle));
            }

            majorBadges.forEach(badge => {
                badge.angle += badge.orbitSpeed;
                const proj = project3D(Math.cos(badge.angle) * badge.orbitRadius, badge.y, Math.sin(badge.angle) * badge.orbitRadius);
                ctx.beginPath(); ctx.arc(proj.x, proj.y, badge.size * proj.scale, 0, Math.PI * 2);
                ctx.fillStyle = badge.color; ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    return (
        <div className="relative bg-[#020617] rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ height: '700px' }}>
            <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

            {/* Overlays */}
            <div className="absolute top-6 left-6 z-10 space-y-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                    <h3 className="text-white font-black text-xl flex items-center gap-2">
                        <Zap className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                        Digital Twin Hub
                    </h3>
                    <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mt-1">Status: Operational</p>
                </div>

                <div className="flex flex-col gap-2">
                    {[
                        { id: 'summary', icon: Layout, label: 'Summary' },
                        { id: 'finance', icon: DollarSign, label: 'Finance' },
                        { id: 'academics', icon: BookOpen, label: 'Academics' },
                        { id: 'operations', icon: Building2, label: 'Campus' },
                    ].map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${viewMode === mode.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <mode.icon className="w-5 h-5" />
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme Controls */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                    <div className="flex gap-2">
                        {['neural', 'cosmic', 'matrix', 'hologram'].map(theme => (
                            <button
                                key={theme}
                                onClick={() => setVisualMode(theme)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${visualMode === theme ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                title={theme}
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 space-y-3">
                    <button
                        onClick={() => setAutoRotate(!autoRotate)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 rounded-lg text-white font-bold text-xs"
                    >
                        {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {autoRotate ? 'Freeze' : 'Rotate'}
                    </button>
                    <div className="flex gap-2">
                        <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="flex-1 bg-white/10 p-2 rounded-lg text-white"><ZoomIn className="w-4 h-4" /></button>
                        <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))} className="flex-1 bg-white/10 p-2 rounded-lg text-white"><ZoomOut className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Live Stats */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 pointer-events-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-mono">Camera Mode</span>
                            <span className="text-white font-bold">{cameraMode.toUpperCase()}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-mono">DPR</span>
                            <span className="text-white font-bold">{window.devicePixelRatio}x</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-mono">Active Nodes</span>
                            <span className="text-white font-bold">128</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-[10px] font-black animate-pulse">
                        LIVE QUANTUM STREAM
                    </div>
                    <div className="text-white/20 font-black text-6xl tracking-tighter uppercase opacity-10">
                        {viewMode}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default University3DHub;
