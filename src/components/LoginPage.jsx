import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  FaArrowLeft,
  FaMoon,
  FaSun,
  FaLock,
  FaEnvelope,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaTriangleExclamation,
  FaCircleCheck,
} from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const successMsg = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);

      toast.success("HỆ THỐNG PHÊ DUYỆT ĐĂNG NHẬP!", {
        icon: "✅",
        duration: 2500,
        style: {
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
          background: theme === "dark" ? "#1e293b" : "#ffffff",
          color: theme === "dark" ? "#f8fafc" : "#0f172a",
          border:
            theme === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "2px solid #0f172a",
        },
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      // LOG LỖI THẬT TRONG CONSOLE
      console.error("LOGIN ERROR:", err);

      // TOAST CHỈ HIỆN THÔNG BÁO CHUNG
      toast.error("SAI TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU!", {
        icon: "⚠️",
        duration: 3000,
        style: {
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
          background: theme === "dark" ? "#1e293b" : "#ffffff",
          color: theme === "dark" ? "#f8fafc" : "#0f172a",
          border:
            theme === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "2px solid #0f172a",
        },
      });

      setError("SAI TÊN ĐĂNG NHẬP HOẶC MẬT KHẨU!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast("TÍNH NĂNG ĐANG ĐƯỢC XÂY DỰNG.", {
      icon: "ℹ️",
      style: {
        borderRadius: "12px",
        background: theme === "dark" ? "#1e293b" : "#0f172a", // Light mode dùng nền tối cho toast cực gắt
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "12px 20px",
      },
      duration: 3000,
    });
  };

  return (
    <div
      style={{ fontFamily: "sans-serif" }}
      // Nền Light mode từ xám nhạt chuyển sang xám có độ sâu hơn
      className="flex items-center justify-center w-full h-screen p-4 font-bold transition-colors duration-500 bg-slate-200 dark:bg-slate-950"
    >
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // Card được làm border đậm hơn (border-2) và shadow-2xl cực mạnh ở Light mode
        className="w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-2xl border-2 border-slate-300 dark:border-white/5 relative overflow-hidden transition-all"
      >
        {/* BACK BUTTON - Text đậm hơn */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
        >
          <FaArrowLeft /> TRANG CHỦ
        </button>

        {/* THEME SWITCH - Border đậm hơn */}
        <button
          onClick={toggleTheme}
          className="absolute inline-flex items-center w-12 transition-all border rounded-full top-8 right-8 h-7 bg-slate-400 dark:bg-primary border-slate-500 dark:border-transparent"
        >
          <span
            className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
          >
            {theme === "dark" ? (
              <FaMoon className="text-primary text-[8px]" />
            ) : (
              <FaSun className="text-amber-600 text-[10px]" />
            )}
          </span>
        </button>

        {/* HEADER */}
        <div className="mt-12 mb-8 text-center">
          <h2 className="text-4xl font-bold leading-none tracking-tighter uppercase text-slate-900 dark:text-white">
            ĐĂNG <span className="text-primary">NHẬP</span>
          </h2>

          <p className="text-[12px] text-slate-700 dark:text-slate-500 uppercase tracking-widest mt-3 leading-relaxed font-bold">
            HỆ THỀU HÀNH TÀI CHÍNH AF FINANCE
          </p>
        </div>

        {/* MESSAGES - Banner đậm màu hơn */}
        <AnimatePresence>
          {successMsg && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-income text-white text-[12px] font-bold rounded-2xl text-center uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
            >
              <FaCircleCheck /> {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-800 dark:text-slate-400 uppercase ml-1 tracking-widest font-bold">
              ĐỊA CHỈ EMAIL
            </label>

            <div className="relative">
              <FaEnvelope className="absolute text-base -translate-y-1/2 left-4 top-1/2 text-slate-600 dark:text-slate-400" />

              <input
                type="email"
                autoComplete="username"
                required
                placeholder="youremail@af-finance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Border-2 và text-slate-950 để cực đậm ở Light mode
                className="w-full p-4 pl-12 text-[13px] font-bold border-2 outline-none bg-slate-50 dark:bg-slate-800/50 border-slate-400 dark:border-slate-800 rounded-2xl focus:border-primary text-slate-950 dark:text-white transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-800 dark:text-slate-400 uppercase ml-1 tracking-widest font-bold">
              MẬT KHẨU
            </label>

            <div className="relative">
              <FaLock className="absolute text-base -translate-y-1/2 left-4 top-1/2 text-slate-600 dark:text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 text-[13px] font-bold border-2 outline-none bg-slate-50 dark:bg-slate-800/50 border-slate-400 dark:border-slate-800 rounded-2xl focus:border-primary text-slate-950 dark:text-white transition-all placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-600 dark:text-slate-400 hover:text-primary"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD - Màu đậm hơn */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-primary uppercase tracking-widest transition-colors underline underline-offset-4 font-bold"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* LOGIN BUTTON - Shadow mạnh hơn */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl shadow-[0_10px_20px_rgba(var(--color-primary-rgb),0.4)] hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[13px] mt-4 flex items-center justify-center gap-3 font-bold"
          >
            {isLoading ? (
              <FaSpinner className="text-xl animate-spin" />
            ) : (
              "ĐĂNG NHẬP"
            )}
          </motion.button>
        </form>

        {/* SIGNUP */}
        <p className="text-center text-[12px] text-slate-600 dark:text-slate-400 uppercase mt-12 tracking-tighter font-bold">
          CHƯA CÓ QUYỀN TRUY CẬP?
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 font-bold transition-all text-primary hover:underline"
          >
            ĐĂNG KÝ NGAY
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
