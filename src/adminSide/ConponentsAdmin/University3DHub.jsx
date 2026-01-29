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
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 4000,
                z: (Math.random() - 0.5) * 4000,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                speedZ: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.2,
                color: Math.random() > 0.8 ? `hsl(${Math.random() * 40 + 200}, 100%, 80%)` : '#ffffff', // Cool blue or white stars
                pulseFactor: Math.random() * 0.05 + 0.01,
                phase: Math.random() * Math.PI * 2
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

        // --- Data-Driven Cosmic Units ---
        const celestialBodies = [
            { id: 'depts', x: 0, y: 0, z: 0, size: 180, type: 'sun', color: '#fbbf24', value: stats.totalDepartments, label: 'Departments', icon: '☀️' },
            { id: 'majors', x: 350, y: -100, z: 150, size: 70, type: 'moon', color: '#e2e8f0', value: stats.totalMajors || 0, label: 'Majors', icon: '🌙' },
            { id: 'pending', x: -350, y: 150, z: 200, size: 60, type: 'moon', color: '#f87171', value: stats.pendingRegistrations || 0, label: 'Pending', icon: '☄️' },
            { id: 'students', x: -650, y: -150, z: -150, size: 180, type: 'ringed', color: '#c084fc', value: stats.totalStudents, label: 'Students', icon: '🪐' },
            { id: 'courses', x: 650, y: 150, z: -350, size: 150, type: 'planet', color: '#60a5fa', value: stats.totalCourses, label: 'Courses', icon: '🌍' },
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
        const drawCelestialBody = (body, rotation) => {
            const proj = project3D(body.x, body.y, body.z);
            if (proj.scale <= 0) return;

            const baseSize = body.size * proj.scale;

            // Draw Atmoshere/Glow
            const glow = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, baseSize * 1.5);
            glow.addColorStop(0, body.color + '44');
            glow.addColorStop(0.5, body.color + '22');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, baseSize * 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Solar Flares for Sun
            if (body.type === 'sun') {
                for (let i = 0; i < 8; i++) {
                    const angle = time * 2 + i * Math.PI / 4;
                    const flareLen = baseSize * (1.2 + Math.sin(time * 5 + i) * 0.1);
                    ctx.beginPath();
                    ctx.strokeStyle = body.color + '33';
                    ctx.lineWidth = 15 * proj.scale;
                    ctx.moveTo(proj.x, proj.y);
                    ctx.lineTo(proj.x + Math.cos(angle) * flareLen, proj.y + Math.sin(angle) * flareLen);
                    ctx.stroke();
                }
            }

            // Saturn Rings
            if (body.type === 'ringed') {
                ctx.beginPath();
                ctx.ellipse(proj.x, proj.y, baseSize * 2.2, baseSize * 0.6, rotation + Math.PI / 6, 0, Math.PI * 2);
                ctx.strokeStyle = body.color + '66';
                ctx.lineWidth = 10 * proj.scale;
                ctx.stroke();
            }

            // Main Body
            const bodyGrad = ctx.createRadialGradient(
                proj.x - baseSize / 3, proj.y - baseSize / 3, baseSize / 10,
                proj.x, proj.y, baseSize
            );
            bodyGrad.addColorStop(0, '#ffffff');
            bodyGrad.addColorStop(0.2, body.color);
            bodyGrad.addColorStop(1, '#000000');

            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, baseSize, 0, Math.PI * 2);
            ctx.fill();

            // Surface details (Fake craters/clouds)
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#000';
            for (let i = 0; i < 5; i++) {
                const cx = Math.sin(i * 13) * baseSize * 0.5;
                const cy = Math.cos(i * 17) * baseSize * 0.5;
                ctx.beginPath();
                ctx.arc(proj.x + cx, proj.y + cy, baseSize * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            // Labels
            const centerProj = project3D(body.x, body.y - body.size - 80, body.z);
            ctx.shadowBlur = 10; ctx.shadowColor = body.color;
            ctx.fillStyle = '#ffffff'; ctx.font = `bold ${Math.floor(32 * proj.scale)}px monospace`; ctx.textAlign = 'center';
            ctx.fillText(body.value.toLocaleString(), centerProj.x, centerProj.y);
            ctx.font = `bold ${Math.floor(14 * proj.scale)}px monospace`; ctx.fillStyle = body.color;
            ctx.fillText(body.label.toUpperCase(), centerProj.x, centerProj.y + 20);
            ctx.shadowBlur = 0;
        };

        const drawCosmicUnit = (unit, rotation, type = 'beam') => {
            const proj = project3D(unit.x, unit.y, unit.z);
            if (proj.scale <= 0) return;

            const w = unit.width * proj.scale;
            const h = unit.height * proj.scale;

            if (type === 'beam') {
                // Draw Energy Beam/Pillar
                const grad = ctx.createLinearGradient(proj.x - w / 2, proj.y, proj.x + w / 2, proj.y);
                grad.addColorStop(0, 'transparent');
                grad.addColorStop(0.5, unit.color);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.globalAlpha = 0.6 + Math.sin(time * 4) * 0.2;
                ctx.fillRect(proj.x - w / 2, proj.y - h, w, h);

                // Core beam
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(proj.x - 2 * proj.scale, proj.y - h, 4 * proj.scale, h);
                ctx.globalAlpha = 1;
            } else {
                // Draw Asteroid/Crystal
                const s = unit.width * proj.scale / 2;
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + rotation;
                    const r = s * (0.8 + Math.sin(time + i) * 0.2);
                    const px = proj.x + Math.cos(angle) * r;
                    const py = proj.y + Math.sin(angle) * r - h / 2;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fillStyle = unit.color + '88';
                ctx.fill();
                ctx.strokeStyle = unit.color;
                ctx.stroke();
            }

            const labelPos = project3D(unit.x, unit.y - unit.height - 30, unit.z);
            ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.floor(12 * proj.scale)}px monospace`; ctx.textAlign = 'center';
            ctx.fillText(unit.value, labelPos.x, labelPos.y);
            ctx.font = `bold ${Math.floor(8 * proj.scale)}px monospace`; ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(unit.label.toUpperCase(), labelPos.x, labelPos.y + 12);
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Deep Space Background
            const bgGradient = ctx.createRadialGradient(width / 2 / window.devicePixelRatio, height / 2 / window.devicePixelRatio, 0, width / 2 / window.devicePixelRatio, height / 2 / window.devicePixelRatio, width);
            bgGradient.addColorStop(0, '#0a0a20'); // Dark Indigo core
            bgGradient.addColorStop(0.5, '#020617'); // Almost black middle
            bgGradient.addColorStop(1, '#000000'); // Pure black edges
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
                p.x += p.speedX; p.y += p.speedY; p.z += p.speedZ;
                if (Math.abs(p.x) > 2000) p.x *= -0.9;
                if (Math.abs(p.y) > 2000) p.y *= -0.9;
                if (Math.abs(p.z) > 2000) p.z *= -0.9;

                const proj = project3D(p.x, p.y, p.z);
                if (proj.scale <= 0) return;

                const twinkle = Math.sin(time * 3 + p.phase) * 0.5 + 0.5;
                ctx.beginPath(); ctx.arc(proj.x, proj.y, p.size * proj.scale * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.2 + twinkle * 0.6;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // View Mode Specifics
            if (viewMode === 'summary') celestialBodies.forEach(body => drawCelestialBody(body, rotationAngle));
            if (viewMode === 'summary') celestialBodies.forEach(body => drawCelestialBody(body, rotationAngle));
            if (viewMode === 'finance') revenueTowers.forEach(tower => drawCosmicUnit(tower, rotationAngle, 'beam'));
            if (viewMode === 'academics') academicTowers.forEach(tower => drawCosmicUnit(tower, rotationAngle, 'beam'));
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
                campusBlocks.forEach(block => drawCosmicUnit(block, rotationAngle, 'asteroid'));
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
                        <Sparkles className="text-yellow-400 w-5 h-5" />
                        Cosmic Command Center
                    </h3>
                    <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mt-1">Galaxy Scan: Online</p>
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
