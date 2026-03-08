import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaMoneyBillWave,
  FaBullseye,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import SettingsOverlay from "./SettingOverlay";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { logout, profile } = useAuth(); // Lấy profile chính chủ từ AuthContext

  const menuItems = [
    { name: "Tổng quan", icon: <FaChartPie />, path: "/dashboard" },
    { name: "Giao dịch", icon: <FaMoneyBillWave />, path: "/transactions" },
    { name: "Mục tiêu", icon: <FaBullseye />, path: "/goals" },
  ];

  // --- LOGIC HIỂN THỊ DANH TÍNH GIGACHAD ---

  // 1. Ưu tiên lấy full_name từ database, nếu đang fetch thì hiện "Đang tải..."
  const displayName = profile?.full_name || "Thành viên ẩn danh";

  // 2. Lấy Role (Admin/User) hoặc mặc định
  const displayRole =
    profile?.role === "admin"
      ? "Quản trị viên"
      : profile?.role === "user"
        ? "Thành viên"
        : "Thành viên";
  // 3. Lấy Avatar URL
  const avatarUrl = profile?.avatar_url;

  // 4. Logic bóc 2 chữ cái đầu (Ví dụ: Huỳnh Minh Phước -> HP)
  const displayInitials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AF";

  return (
    <>
      <motion.div
        animate={{ width: isExpanded ? "18rem" : "6rem" }}
        className="relative z-20 flex flex-col h-full py-6 font-sans transition-colors duration-500 border-r bg-panel shadow-panel-depth border-slate-800/50"
      >
        {/* NÚT ĐÓNG/MỞ & TOGGLE THEME */}
        <div
          className={`flex px-6 mb-8 items-center ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg text-textSub hover:text-primary hover:bg-slate-800/50"
          >
            <motion.div animate={{ rotate: isExpanded ? 0 : 180 }}>
              <FaBars className="text-2xl" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* LOGO SECTION */}
        {isExpanded && (
          <div className="px-6 mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-primary">
              AF{" "}
              <span className="font-bold text-textMain dark:text-white">
                Finance
              </span>
            </h1>
            <p className="text-[10px] text-textSub mt-1 uppercase tracking-[0.3em] font-bold opacity-60">
              Wealth Management
            </p>
          </div>
        )}

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center rounded-xl transition-all font-bold h-14 ${isExpanded ? "px-5" : "justify-center"} ${isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-textSub bg-slate-800/10 hover:bg-slate-800/40 hover:text-textMain"}`
              }
            >
              <span className="flex-shrink-0 text-xl">{item.icon}</span>
              {isExpanded && (
                <span className="ml-4 text-lg whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* PROFILE SECTION - CẦN SỬA ĐỂ HIỆN TÊN THẬT */}
        <div className="px-4 mt-auto">
          <button
            onClick={() => setIsOverlayOpen(true)}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 ${!isExpanded && "justify-center"}`}
          >
            {/* Vòng tròn Avatar/Initials */}
            <div className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 overflow-hidden border-2 rounded-full shadow-lg bg-asset border-white/10">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-lg font-bold tracking-tighter text-white uppercase">
                  {displayInitials}
                </span>
              )}
            </div>

            {isExpanded && (
              <div className="flex flex-col overflow-hidden text-left">
                {/* TÊN THẬT HIỂN THỊ TẠI ĐÂY */}
                <p className="text-sm font-bold truncate text-textMain dark:text-white">
                  {displayName}
                </p>
                <p className="text-[9px] text-asset font-bold uppercase tracking-tighter opacity-80">
                  {displayRole}
                </p>
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* OVERLAY CÀI ĐẶT */}
      <SettingsOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        userData={profile}
        logout={logout}
      />
    </>
  );
};

export default Sidebar;
