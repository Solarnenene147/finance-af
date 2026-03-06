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
    <div className="flex-1 h-full bg-background p-10 overflow-y-auto relative">
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
        className="mb-10 flex justify-between items-end"
      >
        <div>
          <h2 className="text-4xl font-bold text-textMain tracking-tight uppercase">
            Mục Tiêu Tài Chính
          </h2>
          <p className="text-textSub mt-1 text-[10px] font-bold tracking-widest uppercase">
            Kỷ luật sắt cho tương lai rực rỡ
          </p>
        </div>
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaPlus /> Thiết lập mới
        </button>
      </motion.div>

      {/* DANH SÁCH GOALS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl shadow-inner">
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
              <h3 className="text-xl font-bold text-textMain mb-4 uppercase tracking-tighter">
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
                <div className="flex justify-between items-end pt-2">
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
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-textMain uppercase tracking-tighter flex items-center gap-3">
                  <FaFlagCheckered className="text-primary" /> Mục Tiêu Mới
                </h3>
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="text-textSub hover:text-textMain transition-colors"
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
                    className="w-full bg-background border border-slate-800 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-textMain"
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
                    className="w-full bg-background border border-slate-800 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-textMain"
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
                    className="w-full bg-background border border-slate-800 p-4 rounded-2xl outline-none focus:border-primary transition-all font-bold text-textMain"
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
