import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
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

      toast.success("Đăng nhập thành công. Đang chuyển hướng...", {
        icon: "✅",
        duration: 2500,
        style: {
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "bold",
        },
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      setError(
        err.message ||
          "Xác thực không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast("Tính năng khôi phục mật khẩu đang được phát triển.", {
      icon: "ℹ️",
      style: {
        borderRadius: "12px",
        background: theme === "dark" ? "#1e293b" : "#ffffff",
        color: theme === "dark" ? "#f8fafc" : "#0f172a",
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
      className="flex items-center justify-center w-full h-screen p-4 transition-colors duration-500 bg-slate-100 dark:bg-slate-950"
    >
      {/* TOASTER */}
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden"
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-slate-400 hover:text-primary transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2"
        >
          <FaArrowLeft /> TRANG CHỦ
        </button>

        {/* THEME SWITCH */}
        <button
          onClick={toggleTheme}
          className="absolute inline-flex items-center w-12 transition-all rounded-full top-8 right-8 h-7 bg-slate-300 dark:bg-primary"
        >
          <span
            className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
          >
            {theme === "dark" ? (
              <FaMoon className="text-primary text-[8px]" />
            ) : (
              <FaSun className="text-amber-500 text-[10px]" />
            )}
          </span>
        </button>

        {/* HEADER */}
        <div className="mt-12 mb-8 text-center">
          <h2 className="text-3xl font-bold leading-none tracking-tighter uppercase text-slate-800 dark:text-white">
            ĐĂNG <span className="text-primary">NHẬP</span>
          </h2>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
            Hệ thống quản trị tài chính AF Finance
          </p>
        </div>

        {successMsg && !error && (
          <div className="mb-6 p-3 bg-income/10 border border-income/20 text-income text-[10px] rounded-xl text-center uppercase tracking-widest flex items-center justify-center gap-2">
            <FaCircleCheck /> {successMsg}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-expense/10 border border-expense/20 text-expense text-[10px] rounded-xl text-center uppercase tracking-widest flex items-center justify-center gap-2 leading-relaxed">
            <FaTriangleExclamation className="text-xs" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">
              ĐỊA CHỈ EMAIL
            </label>

            <div className="relative">
              <FaEnvelope className="absolute text-sm -translate-y-1/2 left-4 top-1/2 text-slate-400" />

              <input
                type="email"
                autoComplete="username"
                required
                placeholder="Nhập địa chỉ email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 text-[12px] border-2 outline-none bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary dark:text-white transition-all"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-widest">
              MẬT KHẨU
            </label>

            <div className="relative">
              <FaLock className="absolute text-sm -translate-y-1/2 left-4 top-1/2 text-slate-400" />

              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 pr-12 text-[12px] border-2 outline-none bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary dark:text-white transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-primary"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[10px] text-slate-400 hover:text-primary uppercase tracking-widest transition-colors italic underline underline-offset-4"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl shadow-xl hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[12px] mt-4 flex items-center justify-center gap-3 shadow-primary/20"
          >
            {isLoading ? (
              <FaSpinner className="text-lg animate-spin" />
            ) : (
              "ĐĂNG NHẬP"
            )}
          </motion.button>
        </form>

        {/* SIGNUP */}
        <p className="text-center text-[12px] text-slate-400 uppercase mt-10 tracking-tighter">
          CHƯA CÓ TÀI KHOẢN?
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 italic transition-all text-primary hover:underline"
          >
            Đăng ký
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
