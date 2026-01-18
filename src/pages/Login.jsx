import { useState } from "react";
import { motion } from "framer-motion";
import { loginApi } from "../api/auth.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginApi(form);
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Logged in as:", user.name, "| Role:", user.role);
      console.log("👤 User object:", user);

      // Small delay to ensure localStorage is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on role
      if (user.role === "admin" || user.role === "staff") {
        console.log("🔄 Redirecting to admin dashboard...");
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "student") {
        console.log("🔄 Redirecting to student dashboard...");
        navigate("/student/dashboard", { replace: true });
      } else {
        console.log("⚠️ Unknown role:", user.role, "- redirecting to home");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-400 opacity-30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="
            w-full max-w-md
            rounded-[28px]
            border-2 border-white/60
            bg-gradient-to-br from-white/80 via-white/70 to-white/60
            backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
            hover:shadow-[0_30px_80px_rgba(139,92,246,0.3)]
            transition-all duration-500
            px-8 py-10
          "
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 rounded-2xl border border-white/50"
            >
              <svg 
                className="w-12 h-12 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </motion.div>
            <h1 className="text-[32px] font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Sign in to manage the system
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-5 rounded-2xl backdrop-blur-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 border-2 border-red-200/60 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl backdrop-blur-xl bg-white/80 pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 border-2 border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all duration-300 placeholder:text-gray-400 shadow-lg"
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl backdrop-blur-xl bg-white/80 pl-12 pr-4 py-3.5 text-sm font-medium text-gray-800 border-2 border-white/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 outline-none transition-all duration-300 placeholder:text-gray-400 shadow-lg"
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="relative w-full mt-6 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.6)] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8"
          >
            <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-white/40 text-center">
              <p className="text-xs text-gray-500 font-medium">
                🔒 Protected administrative area
              </p>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;