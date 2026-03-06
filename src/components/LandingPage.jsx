import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Vũ khí điều hướng
import { FaWallet, FaShieldHalved, FaBoltLightning } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";

const slides = [
  {
    id: 0,
    icon: <FaWallet />,
    title: "Kiểm Soát Chi Tiêu",
    description: "Ghi chép và phân loại mọi khoản thu chi một cách kỷ luật.",
  },
  {
    id: 1,
    icon: <FaShieldHalved />,
    title: "Bảo Mật Dữ Liệu",
    description:
      "Hệ thống lưu trữ an toàn, đảm bảo bí mật tài chính tuyệt đối.",
  },
  {
    id: 2,
    icon: <FaBoltLightning />,
    title: "Thống Kê Thần Tốc",
    description: "Xử lý dữ liệu tức thì, báo cáo trực quan trong nháy mắt.",
  },
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { bypass } = useAuth();
  const navigate = useNavigate(); // Khởi tạo navigator
  const timerRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
  }, [stopTimer]);

  const handleDotClick = (index) => {
    stopTimer();
    setCurrentSlide(index);
    startTimer();
  };

  const handleDevMode = () => {
    bypass(); // Kích hoạt quyền truy cập ưu tiên
    navigate("/dashboard"); // Phi thẳng vào tổng hành dinh
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  return (
    <div className="h-screen w-full bg-background text-textMain flex flex-col items-center justify-center relative overflow-hidden p-6 transition-colors duration-500">
      {/* Hiệu ứng mờ nền cho tinh tế */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="flex flex-col items-center max-w-sm w-full -mt-12 z-10">
        {/* LOGO & BRANDING */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-24 h-24 bg-panel rounded-full overflow-hidden border-2 border-primary/20 shadow-panel-depth flex items-center justify-center mb-5 group">
            <img
              src={logoImg}
              alt="AF"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML =
                  '<span class="text-primary font-bold text-4xl">AF</span>';
              }}
            />
          </div>

          <h1 className="text-2xl font-bold tracking-[0.25em] uppercase">
            <span className="text-primary">AF</span> Finance
          </h1>
        </motion.div>

        {/* SLIDER SECTION */}
        <div className="w-full h-32 flex items-center justify-center relative mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center text-center w-full absolute"
            >
              <div className="text-3xl text-primary/80 mb-3 drop-shadow-sm">
                {slides[currentSlide].icon}
              </div>

              <h2 className="text-lg font-bold mb-1.5 text-textMain">
                {slides[currentSlide].title}
              </h2>

              <p className="text-textSub text-xs max-w-[240px] leading-relaxed font-medium">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* INTERACTIVE DOTS */}
        <div className="flex gap-2.5 mb-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-primary w-10"
                  : "bg-slate-700 w-2.5 hover:bg-slate-500"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col items-center gap-5 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")} // Điều hướng sang trang Login
            className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest"
          >
            Tham Gia Ngay
          </motion.button>

          <button
            onClick={handleDevMode}
            className="text-[10px] text-textSub hover:text-primary transition-colors uppercase tracking-[0.25em] font-bold"
          >
            Chế độ nhà phát triển
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
