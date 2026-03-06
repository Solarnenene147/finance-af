import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Nhập vô lăng điều hướng
import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LoginPage = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Khởi tạo điều hướng
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(); // Kích hoạt trạng thái login
    navigate("/dashboard"); // Phi thẳng vào tổng hành dinh
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* CÔNG TẮC THEME */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 shadow-inner ${theme === "dark" ? "bg-primary" : "bg-slate-400"}`}
        >
          <span
            className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-7" : "translate-x-1"}`}
          >
            {theme === "dark" ? (
              <FaMoon className="text-primary text-[10px]" />
            ) : (
              <FaSun className="text-asset text-[12px]" />
            )}
          </span>
        </button>
      </div>

      {/* HIỆU ỨNG ÁNH SÁNG */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-asset/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-panel w-full max-w-md p-10 rounded-[2.5rem] shadow-panel-depth z-10 border border-white/5"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-textSub hover:text-primary transition-colors mb-8 text-xs font-bold uppercase tracking-widest group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
          Quay lại
        </button>

        <div className="mb-10 text-left">
          <h2 className="text-3xl font-bold text-textMain mb-2 uppercase tracking-tighter">
            Đăng Nhập <span className="text-primary">AF</span>
          </h2>
          <p className="text-textSub text-sm font-medium">
            Quản trị tài chính cá nhân chuẩn mực.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-textSub uppercase ml-1 tracking-widest">
              Địa chỉ Email
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="mailcuaban@gmail.com"
                className="w-full bg-background border border-slate-800 text-textMain py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-textSub uppercase tracking-widest">
                Mật khẩu
              </label>
              <a
                href="#"
                className="text-[10px] text-primary hover:underline font-bold"
              >
                Quên?
              </a>
            </div>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-background border border-slate-800 text-textMain py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all uppercase tracking-widest text-sm mt-4"
          >
            Vào Việc Ngay
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-textSub text-xs">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary font-bold cursor-pointer hover:underline uppercase tracking-tighter"
            >
              Đăng ký tại đây
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
