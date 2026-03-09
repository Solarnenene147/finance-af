import React, { useState, useMemo, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBullseye,
  FaPlus,
  FaXmark,
  FaFlagCheckered,
  FaCircleCheck,
  FaCalendarDay,
  FaTrophy,
  FaTrash,
  FaTriangleExclamation,
} from "react-icons/fa6";

const Goals = () => {
  const { goals, addGoal, transactions, addTransaction, deleteGoal, loading } =
    useGlobalContext();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false); // Chốt bảo hiểm
  const [deleteId, setDeleteId] = useState(null); // ID để xác nhận xóa
  const [showToast, setShowToast] = useState({ show: false, msg: "" });
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
  });
  useEffect(() => {
    document.title = "Mục tiêu";
  }, []);
  // 1. TÍNH TOÁN NGÂN SÁCH THỰC TẾ ĐỂ SO SÁNH TIẾN ĐỘ
  const currentBudget = useMemo(() => {
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  // 2. VALIDATION NGÀY TƯƠNG LAI
  const minDate = new Date().toISOString().split("T")[0];

  const triggerToast = (msg) => {
    setShowToast({ show: true, msg });
    setTimeout(() => setShowToast({ show: false, msg: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || newGoal.deadline <= minDate) {
      alert("Mục tiêu phải có hạn chót ở tương lai!");
      return;
    }
    setIsSubmitting(true);
    try {
      await addGoal({
        title: newGoal.title,
        target_amount: parseFloat(newGoal.target),
        deadline: newGoal.deadline,
        current_amount: 0,
      });
      setIsOverlayOpen(false);
      triggerToast("Mục tiêu vĩ đại đã được thiết lập!");
      setNewGoal({ title: "", target: "", deadline: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteGoal = async (goal) => {
    if (currentBudget < goal.target_amount) {
      alert("Ngân sách chưa đủ lực, cày tiếp đi bro!");
      return;
    }
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      await addTransaction({
        text: `CHINH PHỤC: ${goal.title}`,
        amount: -Math.abs(goal.target_amount),
        category: "Goal Achievement",
      });
      await deleteGoal(goal.id);
      setSelectedGoal(null);
      triggerToast("Đã quyết toán thành công mục tiêu!");
    } catch (error) {
      console.error(error);
      setIsCompleting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteGoal(deleteId);
        setDeleteId(null);
        triggerToast("Đã xóa bỏ mục tiêu khỏi kế hoạch.");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="relative flex-1 h-full p-10 overflow-y-auto bg-background custom-scrollbar">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] bg-income text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-sm"
          >
            <FaCircleCheck className="text-xl" /> <span>{showToast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight uppercase text-textMain">
            Mục Tiêu Tài Chính
          </h2>
          <p className="text-textSub mt-1 text-[12px] font-bold tracking-widest uppercase">
            Ngân sách hiện có:{" "}
            <span className="text-income">
              {currentBudget.toLocaleString()} đ
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="flex items-center gap-2 px-6 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-primary rounded-2xl hover:scale-105 active:scale-95 shadow-primary/20"
        >
          <FaPlus /> Thiết lập mới
        </button>
      </div>

      {/* DANH SÁCH GOALS - HIỆU ỨNG BORDER KẾT NỐI */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-20 text-center text-[12px] font-bold text-textSub uppercase tracking-[0.5em] animate-pulse">
            Đang truy xuất...
          </div>
        ) : (
          goals.map((goal) => {
            const progress = Math.min(
              (currentBudget / goal.target_amount) * 100,
              100,
            );
            return (
              <motion.div key={goal.id} layout className="relative group">
                {/* NÚT XÓA BAY BÊN NGOÀI */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(goal.id);
                  }}
                  className="absolute z-10 p-3 transition-all duration-300 border shadow-xl opacity-0 -top-4 -right-4 bg-panel border-white/10 text-slate-500 hover:text-expense hover:border-expense/50 rounded-2xl group-hover:opacity-100"
                >
                  <FaTrash size={14} />
                </button>

                {/* KHUNG MỤC TIÊU CHÍNH */}
                <div
                  onClick={() => {
                    setSelectedGoal(goal);
                    setIsCompleting(false);
                  }}
                  className="relative bg-panel p-8 rounded-[2.5rem] border border-white/5 shadow-panel-depth cursor-pointer transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]"
                >
                  {/* LỚP BORDER NỐI KHI HOVER */}
                  <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-expense/20 transition-all duration-300 pointer-events-none"></div>

                  <div className="flex justify-between mb-6">
                    <div className="flex items-center justify-center w-12 h-12 text-xl transition-all rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white">
                      <FaBullseye />
                    </div>
                    <div className="font-bold text-right">
                      <p className="text-[10px] text-textSub uppercase">
                        Tiến độ
                      </p>
                      <p
                        className={`text-sm ${progress >= 100 ? "text-income" : "text-textMain"}`}
                      >
                        {progress.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <h3 className="mb-4 text-xl font-bold uppercase truncate text-textMain">
                    {goal.title}
                  </h3>
                  <div className="w-full h-2 mb-4 overflow-hidden border rounded-full bg-background border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${progress >= 100 ? "bg-income shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-primary"}`}
                    />
                  </div>
                  <div className="flex items-end justify-between font-bold">
                    <p className="text-xs text-textSub">
                      {goal.target_amount.toLocaleString()} đ
                    </p>
                    <FaTrophy
                      className={
                        progress >= 100
                          ? "text-income animate-bounce"
                          : "text-slate-700"
                      }
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* DRAWER CHI TIẾT */}
      <AnimatePresence>
        {selectedGoal && (
          <div className="absolute inset-0 z-[120] flex justify-end overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGoal(null)}
              className="absolute inset-0 bg-background/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 250 }}
              className="relative w-full max-w-[360px] h-[calc(100%-40px)] my-5 mr-5 bg-panel border border-white/5 shadow-[-30px_0_60px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-8 flex flex-col z-20"
            >
              <button
                onClick={() => setSelectedGoal(null)}
                className="absolute transition-all top-6 right-6 text-textSub hover:text-white hover:rotate-90"
              >
                <FaXmark size={18} />
              </button>
              <div className="mt-6 mb-8">
                <h3 className="text-2xl font-bold uppercase truncate text-textMain">
                  {selectedGoal.title}
                </h3>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-0.5 w-8 bg-primary rounded-full"></div>
                  <p className="text-[9px] font-bold text-textSub uppercase tracking-[0.2em] opacity-60">
                    Chi tiết mục tiêu
                  </p>
                </div>
              </div>
              <div className="flex-1 pr-1 space-y-5 overflow-y-auto custom-scrollbar">
                <div className="p-3 border bg-background/40 rounded-3xl border-white/5">
                  <p className="text-[10px] font-bold text-textSub uppercase mb-1 tracking-widest opacity-50">
                    Số tiền cần đạt
                  </p>
                  <p className="text-xl font-bold text-textMain">
                    {selectedGoal.target_amount.toLocaleString()}{" "}
                    <span className="text-xs font-normal uppercase opacity-40">
                      vnđ
                    </span>
                  </p>
                </div>
                <div className="p-3 border bg-background/40 rounded-3xl border-white/5">
                  <p className="text-[10px] font-bold text-textSub uppercase mb-1 tracking-widest opacity-50">
                    Thời hạn dự kiến
                  </p>
                  <p className="flex items-center gap-2 text-base font-bold text-textMain">
                    <FaCalendarDay className="text-sm text-primary" />{" "}
                    {selectedGoal.deadline
                      ? new Date(selectedGoal.deadline).toLocaleDateString(
                          "vi-VN",
                        )
                      : "Chưa đặt"}
                  </p>
                </div>
                <div className="pt-5 mt-2 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[9px] font-bold text-textSub uppercase tracking-widest">
                      Tiến độ
                    </p>
                    <span className="text-[12px] font-bold text-primary italic">
                      {Math.min(
                        (currentBudget / selectedGoal.target_amount) * 100,
                        100,
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 mb-3 overflow-hidden border rounded-full bg-background border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((currentBudget / selectedGoal.target_amount) * 100, 100)}%`,
                      }}
                      className={`h-full ${currentBudget >= selectedGoal.target_amount ? "bg-income" : "bg-primary"}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-textSub uppercase px-1 mb-8">
                    <p>
                      Hiện có:{" "}
                      <span className="text-textMain">
                        {currentBudget.toLocaleString()} đ
                      </span>
                    </p>
                    <p>
                      Còn:{" "}
                      <span className="text-textMain">
                        {Math.max(
                          selectedGoal.target_amount - currentBudget,
                          0,
                        ).toLocaleString()}{" "}
                        đ
                      </span>
                    </p>
                  </div>
                  {currentBudget >= selectedGoal.target_amount ? (
                    <div className="p-5 text-center border bg-income/5 border-income/10 rounded-3xl">
                      <p className="text-income font-bold text-[11px] mb-4 uppercase tracking-tighter">
                        Sẵn sàng chinh phục!
                      </p>
                      <button
                        disabled={isCompleting}
                        onClick={() => handleCompleteGoal(selectedGoal)}
                        className={`w-full font-bold py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 ${isCompleting ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-income hover:brightness-110 text-white shadow-income/20"}`}
                      >
                        {isCompleting
                          ? "Đang quyết toán..."
                          : "Xác nhận hoàn thành"}
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 text-center border bg-slate-800/20 rounded-3xl border-white/5 opacity-80">
                      <p className="text-textSub text-[12px] italic leading-relaxed text-center font-bold">
                        Tích lũy thêm để hoàn thành mục tiêu này.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL XÁC NHẬN XÓA */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-panel border border-expense/20 p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-3xl rounded-full bg-expense/10 text-expense animate-bounce">
                <FaTriangleExclamation />
              </div>
              <h3 className="mb-2 text-xl font-bold uppercase text-textMain">
                Hủy mục tiêu?
              </h3>
              <p className="text-[12px] font-bold text-textSub uppercase tracking-widest mb-8">
                Hành động này không thể hoàn tác. Bạn chắc chứ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 rounded-2xl bg-slate-800 text-slate-400 text-[12px] font-bold uppercase tracking-widest"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl bg-expense text-white text-[12px] font-bold uppercase tracking-widest shadow-lg shadow-expense/20"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY THÊM MỚI */}
      <AnimatePresence>
        {isOverlayOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOverlayOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-panel border border-white/5 p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="flex items-center gap-3 text-2xl font-bold uppercase text-textMain">
                  <FaFlagCheckered className="text-primary" /> Mục Tiêu Mới
                </h3>
                <button
                  onClick={() => setIsOverlayOpen(false)}
                  className="text-textSub hover:text-textMain"
                >
                  <FaXmark className="text-2xl" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-textSub uppercase tracking-widest">
                    Tên mục tiêu
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Mua Mercedes G63..."
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    className="w-full p-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-primary text-textMain dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-textSub uppercase tracking-widest">
                    Số tiền (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="5,000,000,000"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                    className="w-full p-4 font-bold transition-all border outline-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:border-primary text-textMain dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-textSub uppercase tracking-widest">
                    Hạn chót
                  </label>
                  <input
                    type="date"
                    min={minDate}
                    required
                    value={newGoal.deadline}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, deadline: e.target.value })
                    }
                    className="w-full p-4 font-bold bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-primary text-textMain dark:text-white outline-none transition-all [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] disabled:opacity-50 transition-all uppercase tracking-widest text-[12px] shadow-primary/20"
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
