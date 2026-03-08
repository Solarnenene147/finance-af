import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMoon,
  FaSun,
  FaChartLine,
  FaShieldHalved,
  FaRocket,
  FaSpinner,
} from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SignUpPage = () => {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    agree: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "QUẢN TRỊ TÀI CHÍNH TOÀN DIỆN",
      desc: "Theo dõi dòng tiền, kiểm soát chi phí và phân tích hiệu suất tài chính trong thời gian thực.",
      icon: <FaChartLine className="text-6xl text-primary" />,
    },
    {
      title: "NỀN TẢNG TÀI CHÍNH HIỆN ĐẠI",
      desc: "Thiết lập mục tiêu tài chính, quản lý kế hoạch dài hạn và tối ưu chiến lược tài chính cá nhân.",
      icon: <FaRocket className="text-6xl text-primary" />,
    },
    {
      title: "BẢO MẬT DỮ LIỆU CẤP DOANH NGHIỆP",
      desc: "Hệ thống bảo mật nhiều lớp với tiêu chuẩn mã hóa hiện đại đảm bảo an toàn tuyệt đối.",
      icon: <FaShieldHalved className="text-6xl text-primary" />,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (error) setError("");
  };

  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,20}$/;
    return regex.test(pass);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // 1. KIỂM TRA ĐIỀU KIỆN (VALIDATION)
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      setError("Đại ca cần đủ 18 tuổi để gia nhập pháo đài AF Finance!");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Mật mã chưa đủ giáp (8-20 ký tự, đủ chữ hoa, thường, số, ký hiệu)!",
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật mã xác nhận không khớp!");
      return;
    }

    if (!formData.agree) {
      setError("Đại ca vui lòng chấp nhận chính sách bảo mật!");
      return;
    }

    // 2. GIAO TIẾP VỚI SUPABASE
    setIsLoading(true);
    try {
      // Gọi register từ Context, truyền email, password và object chứa metadata
      await register(formData.email, formData.password, {
        fullName: formData.fullName,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
      });

      // Nếu Supabase chưa tắt xác thực email, báo người dùng kiểm tra mail
      // Nếu đã tắt, Supabase sẽ tự động đăng nhập (nhưng ta nên hướng về login cho chắc)
      navigate("/login", {
        state: {
          message:
            "Gia nhập thành công! Đăng nhập để kích hoạt phiên làm việc.",
        },
      });
    } catch (err) {
      // Xử lý lỗi từ Supabase (Email đã tồn tại, lỗi mạng, v.v.)
      setError(
        err.message || "Không thể khởi tạo tài khoản. Vui lòng kiểm tra lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "sans-serif" }}
      className="flex items-center justify-center w-full h-screen p-4 transition-colors duration-500 bg-slate-100 dark:bg-slate-950"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl h-[88vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-white/5"
      >
        {/* LEFT PANEL: SLIDER THÔNG TIN */}
        <div className="relative flex-col items-center justify-center hidden p-12 transition-colors border-r lg:flex lg:w-5/12 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 left-8 flex items-center text-slate-400 hover:text-primary transition-colors font-bold text-[12px] uppercase tracking-widest gap-2"
          >
            <FaArrowLeft /> QUAY LẠI
          </button>
          <div className="absolute top-8 right-6">
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${theme === "dark" ? "bg-primary" : "bg-slate-300"}`}
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
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-center"
            >
              <div className="flex justify-center drop-shadow-xl">
                {slides[currentSlide].icon}
              </div>
              <div className="px-8 space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter uppercase text-slate-800 dark:text-white">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                  {slides[currentSlide].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? "w-8 bg-primary" : "w-1.5 bg-slate-300 dark:bg-slate-700"}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: FORM ĐĂNG KÝ */}
        <div className="relative flex flex-col w-full p-10 overflow-y-auto transition-colors bg-white lg:w-7/12 custom-scrollbar dark:bg-slate-900">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold leading-none tracking-tighter uppercase text-slate-800 dark:text-white">
                TẠO <span className="text-primary">TÀI KHOẢN</span>
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-2">
                HỆ ĐIỀU HÀNH TÀI CHÍNH AF FINANCE
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-5 p-3 bg-expense/10 border border-expense/20 text-expense text-[9px] font-bold rounded-xl text-center uppercase tracking-widest leading-relaxed"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    HỌ VÀ TÊN
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    SỐ ĐIỆN THOẠI
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="090-XXX-XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    NGÀY SINH
                  </label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    GIỚI TÍNH
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl h-[46px]">
                    {["male", "female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`flex-1 rounded-lg text-[9px] font-bold uppercase transition-all ${formData.gender === g ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {g === "male" ? "NAM" : "NỮ"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                  EMAIL ĐỊNH DANH
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="youremail@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    MẬT KHẨU
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                    XÁC NHẬN
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-primary dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <input
                  type="checkbox"
                  name="agree"
                  id="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-4 h-4 rounded cursor-pointer border-slate-300 text-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-700"
                />
                <label
                  htmlFor="agree"
                  className="text-[9px] text-slate-500 font-bold uppercase cursor-pointer dark:text-slate-400"
                >
                  TÔI ĐỒNG Ý VỚI{" "}
                  <a href="/privacy" className="underline text-primary">
                    CHÍNH SÁCH BẢO MẬT
                  </a>{" "}
                  CỦA AF FINANCE
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[10px] mt-4 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  "TẠO TÀI KHOẢN"
                )}
              </motion.button>
            </form>

            <p className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-tighter mt-8">
              ĐÃ CÓ TÀI KHOẢN?{" "}
              <button
                onClick={() => navigate("/login")}
                className="ml-1 transition-all text-primary hover:underline"
              >
                ĐĂNG NHẬP NGAY
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
