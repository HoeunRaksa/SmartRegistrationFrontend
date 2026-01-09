import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Nabar from "../Components/navbar/Nabar";
import { Footer } from "../Components/footer/Footer";
import MainRouter from "../Router/mainRouter";
import "../App.css";
import { ToastProvider } from "../Components/Context/ToastProvider";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const hideFooterRoutes = ["/registration", "/admin/dashboard", "/login"];
  const hideNavbarRoutes = ["/admin/dashboard"];

  const pathname = location.pathname.toLowerCase();
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center transition-colors duration-500 overflow-hidden">
      
      {/* ================= PREMIUM BACKGROUND SYSTEM ================= */}
      
      {/* Layer 1: Base Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />

      {/* Layer 2: Animated Mesh Gradient */}
      <div className="fixed inset-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-purple-100/40 to-pink-100/40 animate-gradient-shift" />
      </div>

      {/* Layer 3: Large Animated Orbs (Primary) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blue Orb - Top Left */}
        <motion.div
          animate={{
            x: [0, 120, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.3, 1.1, 1],
            rotate: [0, 90, 180, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/25 via-cyan-400/20 to-transparent rounded-full blur-[140px]"
        />

        {/* Purple Orb - Top Right */}
        <motion.div
          animate={{
            x: [0, -100, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.25, 1.15, 1],
            rotate: [0, -90, -180, -360],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-purple-400/25 via-pink-400/20 to-transparent rounded-full blur-[150px]"
        />

        {/* Pink Orb - Bottom Center */}
        <motion.div
          animate={{
            x: [0, 60, -70, 0],
            y: [0, -90, 40, 0],
            scale: [1, 1.2, 1.25, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-gradient-to-br from-pink-400/20 via-rose-400/15 to-transparent rounded-full blur-[160px]"
        />

        {/* Orange Orb - Right Side */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 80, -50, 0],
            scale: [1, 1.15, 1.3, 1],
            rotate: [0, -60, -120, -180],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-gradient-to-br from-orange-400/20 via-amber-400/15 to-transparent rounded-full blur-[130px]"
        />
      </div>

      {/* Layer 4: Medium Orbs (Secondary) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 120, -80, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.15, 0.30, 0.20, 0.15],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/20 via-blue-400/15 to-transparent rounded-full blur-[110px]"
        />

        <motion.div
          animate={{
            x: [0, 70, -40, 0],
            y: [0, -70, 90, 0],
            scale: [1, 0.95, 1.25, 1],
            opacity: [0.2, 0.35, 0.25, 0.2],
          }}
          transition={{
            duration: 42,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, 50, -60, 0],
            y: [0, -100, 60, 0],
            scale: [1, 1.1, 1.2, 1],
            opacity: [0.18, 0.28, 0.22, 0.18],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-violet-400/20 via-fuchsia-400/15 to-transparent rounded-full blur-[100px]"
        />
      </div>

      {/* Layer 5: Animated Grid Pattern */}
      <motion.div 
        animate={{
          opacity: [0.02, 0.05, 0.02],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </motion.div>

      {/* Layer 6: Radial Light Beams */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg 20deg,
              rgba(59, 130, 246, 0.1) 20deg 40deg,
              transparent 40deg 60deg,
              rgba(168, 85, 247, 0.1) 60deg 80deg,
              transparent 80deg 100deg,
              rgba(236, 72, 153, 0.1) 100deg 120deg,
              transparent 120deg 360deg
            )`,
          }}
        />
      </div>

      {/* Layer 7: Floating Particles (Small) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -200 - Math.random() * 100, 0],
              x: [0, Math.random() * 150 - 75, 0],
              opacity: [0, 0.4, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${10 + (i % 5) * 18}%`,
              width: `${4 + Math.random() * 4}px`,
              height: `${4 + Math.random() * 4}px`,
              background: `radial-gradient(circle, ${
                i % 3 === 0 
                  ? 'rgba(59, 130, 246, 0.5)' 
                  : i % 3 === 1 
                  ? 'rgba(168, 85, 247, 0.5)' 
                  : 'rgba(236, 72, 153, 0.5)'
              }, transparent)`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Layer 8: Corner Decorative Rings */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Left */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-20 -left-20 w-48 h-48 border-2 border-blue-300/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 0.95, 1] }}
          transition={{ 
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-16 -left-16 w-36 h-36 border border-purple-300/20 rounded-full"
        />

        {/* Top Right */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.08, 1] }}
          transition={{ 
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-20 -right-20 w-48 h-48 border-2 border-pink-300/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.03, 1] }}
          transition={{ 
            rotate: { duration: 55, repeat: Infinity, ease: "linear" },
            scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-16 -right-16 w-36 h-36 border border-orange-300/20 rounded-full"
        />

        {/* Bottom Left */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.06, 1] }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -bottom-20 -left-20 w-48 h-48 border-2 border-green-300/20 rounded-full"
        />

        {/* Bottom Right */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.04, 1] }}
          transition={{ 
            rotate: { duration: 50, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -bottom-20 -right-20 w-48 h-48 border-2 border-cyan-300/20 rounded-full"
        />
      </div>

      {/* Layer 9: Shimmer Wave Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[5]"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 10: Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 11: Snow / Ambient Particles 
      <div className="fixed inset-0 pointer-events-none z-10">
        <SnowAnimation />
      </div>
      */}

      {/* ================= CONTENT LAYERS ================= */}

      {/* Navbar */}
      <AnimatePresence>
        {!shouldHideNavbar && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
            className="fixed top-4 left-0 w-full z-50 flex justify-center rounded-2xl px-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="
              w-full
                rounded-[26px]
                backdrop-blur-[28px]
                bg-white/45
                border border-white/30
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                hover:shadow-[0_25px_70px_rgba(0,0,0,0.22)]
                transition-shadow duration-300
              "
            >
              <Nabar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`
          relative w-full flex-1
          flex flex-col items-center
          transition-all duration-500 z-20
          ${shouldHideNavbar ? "pt-0" : "pt-28"}
        `}
      >
        <div className="w-full xl:px-[10%] lg:px-[8%] md:px-[6%] px-[5%]">
          <div className="min-h-[calc(100vh-220px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <MainRouter />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <AnimatePresence>
        {!shouldHideFooter && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
            className="relative w-full z-20 mt-10 flex justify-center px-4 pb-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="
                w-full max-w-[1600px]
                rounded-[26px]
                backdrop-blur-[28px]
                bg-white/45
                border border-white/30
                shadow-[0_-20px_60px_rgba(0,0,0,0.12)]
                hover:shadow-[0_-25px_70px_rgba(0,0,0,0.16)]
                transition-shadow duration-300
              "
            >
              <Footer />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
     
    </div>
  );
}

export default App;