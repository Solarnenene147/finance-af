import React, { useState, useEffect, useRef, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const { user, loading } = useAuth(); // Lấy thêm loading để tránh nháy giao diện
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // --- LOGIC ĐIỀU HƯỚNG TỰ ĐỘNG ---
  useEffect(() => {
    // Nếu đã xác thực xong và có user, đá thẳng sang Dashboard
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

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

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // Nếu đang loading thì trả về null hoặc một màn hình trống để tránh hiện Landing rồi mới nhảy Dashboard
  if (loading) return null;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen p-6 overflow-hidden transition-colors duration-500 bg-background text-textMain">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>

      <div className="z-10 flex flex-col items-center w-full max-w-sm -mt-12">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="flex items-center justify-center w-24 h-24 mb-5 overflow-hidden border-2 rounded-full bg-panel border-primary/20 shadow-panel-depth group">
            <img
              src={logoImg}
              alt="AF"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
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

        {/* Slideshow Content */}
        <div className="relative flex items-center justify-center w-full h-32 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute flex flex-col items-center w-full text-center"
            >
              <div className="mb-3 text-3xl text-primary/80 drop-shadow-sm">
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

        {/* Dots Pagination */}
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

        {/* Buttons Action */}
        <div className="flex flex-col items-center w-full gap-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="w-full py-4 text-sm font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-primary rounded-xl shadow-primary/20"
          >
            Tham Gia Ngay
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
