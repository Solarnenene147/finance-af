/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  FaChartPie,
  FaMoneyBillWave,
  FaBullseye,
  FaGear,
  FaBars,
  FaMoon,
  FaSun,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Tổng quan", icon: <FaChartPie />, path: "/dashboard" },
    { name: "Giao dịch", icon: <FaMoneyBillWave />, path: "/transactions" },
    { name: "Mục tiêu", icon: <FaBullseye />, path: "/goals" },
    { name: "Cài đặt", icon: <FaGear />, path: "/settings" },
  ];

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? "18rem" : "6rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full bg-panel flex flex-col py-6 shadow-panel-depth z-20 flex-shrink-0 relative overflow-hidden border-r border-slate-800/50 transition-colors duration-500"
      >
        {/* HEADER */}
        <div
          className={`flex w-full px-6 mb-8 items-center ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-textSub hover:text-primary transition-colors flex justify-center items-center w-10 h-10 rounded-lg hover:bg-slate-800/50 flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
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

        {/* LOGO */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-10 flex flex-col items-center justify-center px-6"
            >
              <h1 className="text-4xl font-extrabold text-primary whitespace-nowrap tracking-tighter">
                AF <span className="text-textMain">Finance</span>
              </h1>
              <p className="text-[10px] text-textSub mt-1 uppercase tracking-[0.3em] font-black opacity-60">
                Wealth Management
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MENU */}
        <nav className="flex-1 flex flex-col space-y-3 px-4 overflow-hidden">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center rounded-xl transition-all font-bold h-14 flex-shrink-0 ${isExpanded ? "px-5 w-full" : "w-14 justify-center mx-auto"} ${isActive ? "bg-primary text-white shadow-lg" : "text-textSub hover:bg-slate-800/40"}`
              }
            >
              <span className="text-xl flex items-center justify-center w-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              {isExpanded && (
                <span className="ml-4 text-lg whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* USER INFO & LOGOUT BUTTON */}
        <div className="mt-auto pt-6 border-t border-slate-800/50 flex flex-col px-4">
          <div
            className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"}`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-asset flex flex-shrink-0 items-center justify-center text-white font-bold text-lg border-2 border-white/10 shadow-lg">
                MP
              </div>
              {isExpanded && (
                <div className="flex flex-col text-left overflow-hidden">
                  <p className="text-sm font-bold text-textMain whitespace-nowrap">
                    Minh Phước
                  </p>
                  <p className="text-[10px] text-asset uppercase tracking-wider font-black opacity-80">
                    CFO AF Finance
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`text-textSub hover:text-expense transition-all ${isExpanded ? "p-2" : "mt-4"}`}
            >
              <FaArrowRightFromBracket
                className={
                  isExpanded
                    ? "text-lg"
                    : "text-xl opacity-40 hover:opacity-100"
                }
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* LOGOUT OVERLAY */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-panel p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm text-center border border-white/5"
            >
              <div className="w-20 h-20 bg-expense/10 text-expense rounded-full flex items-center justify-center mx-auto mb-6">
                <FaArrowRightFromBracket className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-textMain mb-2 uppercase tracking-tighter">
                Xác nhận thoát?
              </h2>
              <p className="text-sm text-textSub mb-8 font-medium">
                Đại ca có chắc muốn đăng xuất không? Hệ thống sẽ ngừng đồng bộ
                ngay lập tức.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutConfirm(false);
                  }}
                  className="w-full bg-expense text-white font-bold py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-sm"
                >
                  Xác nhận thoát
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-slate-800/50 text-textSub hover:text-textMain font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
