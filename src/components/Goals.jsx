/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBullseye,
  FaPlus,
  FaXmark,
  FaFlagCheckered,
  FaCircleCheck,
} from "react-icons/fa6";

const Goals = () => {
  const { goals, addGoal } = useGlobalContext();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target) return;

    setIsSubmitting(true);

    try {
      await addGoal({
        ...newGoal,
        current: 0,
        target: parseFloat(newGoal.target),
      });

      // Thành công thì hiện thông báo
      setIsOverlayOpen(false);
      setShowToast(true);
      setNewGoal({ title: "", target: "", deadline: "" });

      // Tự động tắt thông báo sau 3 giây
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Lỗi gửi goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex-1 h-full p-10 overflow-y-auto bg-background">
      {/* THÔNG BÁO THÀNH CÔNG (TOAST) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[110] bg-income text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-sm"
          >
            <FaCircleCheck className="text-xl" />
            <span>Mục tiêu đã được thiết lập thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <h2 className="text-4xl font-bold tracking-tight uppercase text-textMain">
            Mục Tiêu Tài Chính
          </h2>
          <p className="text-textSub mt-1 text-[10px] font-bold tracking-widest uppercase">
            Kỷ luật sắt cho tương lai rực rỡ
          </p>
        </div>
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-primary rounded-2xl shadow-primary/20 hover:scale-105"
        >
          <FaPlus /> Thiết lập mới
        </button>
      </motion.div>

      {/* DANH SÁCH GOALS */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.min(
            ((goal.current || 0) / goal.target) * 100,
            100,
          );
          return (
            <motion.div
              key={goal.id}
              layout
              className="bg-panel p-8 rounded-[2.5rem] border border-white/5 shadow-panel-depth"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 text-xl rounded-full shadow-inner bg-primary/10 text-primary">
                  <FaBullseye />
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-textSub font-bold uppercase tracking-widest">
                    Hạn chót
                  </p>
                  <p className="text-xs font-bold text-textMain">
                    {goal.deadline || "Không có"}
                  </p>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold tracking-tighter uppercase text-textMain">
                {goal.title}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-textSub">
                  <span>Tiến độ</span>
                  <span className="text-primary">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="flex items-end justify-between pt-2">
                  <div>
                    <p className="text-[8px] text-textSub uppercase font-bold tracking-tighter">
                      Hiện có
                    </p>
                    <p className="text-lg font-bold text-income">
                      {goal.current?.toLocaleString() || 0} đ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-textSub uppercase font-bold tracking-tighter">
                      Mục tiêu
                    </p>
                    <p className="text-lg font-bold text-textMain">
                      {goal.target.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* OVERLAY ADD NEW GOAL */}
      <AnimatePresence>
        {isOverlayOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOverlayOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-panel border border-white/5 p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tighter uppercase text-textMain">
                  <FaFlagCheckered className="text-primary" /> Mục Tiêu Mới
                </h3>
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="transition-colors text-textSub hover:text-textMain"
                >
                  <FaXmark className="text-2xl" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textSub uppercase tracking-widest ml-1">
                    Tên mục tiêu
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Mua Mercedes..."
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    className="w-full p-4 font-bold transition-all border outline-none bg-background border-slate-800 rounded-2xl focus:border-primary text-textMain"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textSub uppercase tracking-widest ml-1">
                    Số tiền mục tiêu (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="50,000,000"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                    className="w-full p-4 font-bold transition-all border outline-none bg-background border-slate-800 rounded-2xl focus:border-primary text-textMain"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-textSub uppercase tracking-widest ml-1">
                    Hạn chót
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                    className="w-full p-4 font-bold transition-all border outline-none bg-background border-slate-800 rounded-2xl focus:border-primary text-textMain"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all uppercase tracking-widest text-sm mt-4"
                >
                  {isSubmitting ? "Đang ghi nhận..." : "Bắt đầu chinh phục"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
