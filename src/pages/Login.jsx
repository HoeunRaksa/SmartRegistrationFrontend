import { useState } from "react";
import { motion } from "framer-motion";
import { loginApi } from "../../src/api/auth.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FIXED
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
      JSON.parse(localStorage.getItem("user"))

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      JSON.parse(localStorage.getItem("user"))
      console.log("✅ Logged in as:", user);
      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          w-full max-w-md
          rounded-[28px]
          border border-white/30
          bg-white/60
          backdrop-blur-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          px-8 py-10
        "
      >
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage the system
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full rounded-xl bg-white/70 px-4 py-3 text-sm border"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/70 px-4 py-3 text-sm border"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Continue"}
          </motion.button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          Protected administrative area
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
