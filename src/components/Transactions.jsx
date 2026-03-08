import React, { useState, useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaMagnifyingGlass,
  FaFilter,
  FaXmark,
  FaSort,
  FaArrowUpWideShort,
  FaArrowDownWideShort,
  FaCalendarDays,
  FaTriangleExclamation, // Thêm icon cảnh báo cho máu
} from "react-icons/fa6";

const Transactions = () => {
  const { transactions, deleteTransaction, loading } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // STATE MỚI: Quản lý ID giao dịch cần xóa
  const [deleteId, setDeleteId] = useState(null);

  const [filters, setFilters] = useState({
    type: "all",
    sortBy: "date-desc",
  });

  // Logic xử lý dữ liệu
  const processedTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.text
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType =
          filters.type === "all"
            ? true
            : filters.type === "income"
              ? t.amount > 0
              : t.amount < 0;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (filters.sortBy === "date-desc") return dateB - dateA;
        if (filters.sortBy === "date-asc") return dateA - dateB;
        if (filters.sortBy === "amount-desc")
          return Math.abs(b.amount) - Math.abs(a.amount);
        if (filters.sortBy === "amount-asc")
          return Math.abs(a.amount) - Math.abs(b.amount);
        return 0;
      });
  }, [transactions, searchTerm, filters]);

  // HÀM XỬ LÝ XÓA SAU KHI XÁC NHẬN
  const confirmDelete = () => {
    if (deleteId) {
      deleteTransaction(deleteId);
      setDeleteId(null); // Đóng modal sau khi xóa
    }
  };

  return (
    <div
      style={{ fontFamily: "sans-serif" }}
      className="relative flex-1 h-full p-10 overflow-y-auto transition-colors duration-500 bg-slate-50 dark:bg-background custom-scrollbar"
    >
      {/* HEADER & THANH CÔNG CỤ GIỮ NGUYÊN */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-4xl font-bold tracking-tighter uppercase text-slate-800 dark:text-textMain">
          NHẬT KÝ GIAO DỊCH
        </h2>
        <p className="text-slate-400 dark:text-textSub mt-1 text-[10px] font-bold tracking-widest uppercase">
          HỆ ĐIỀU HÀNH TÀI CHÍNH AF FINANCE
        </p>
      </motion.div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 group">
          <FaMagnifyingGlass className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-slate-400 group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 text-sm font-bold transition-all border border-transparent outline-none bg-panel rounded-2xl focus:border-primary dark:text-white"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-primary text-white px-8 rounded-2xl flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
        >
          <FaFilter /> BỘ LỌC CHI TIẾT
        </button>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-panel rounded-[2.5rem] shadow-panel-depth overflow-hidden border border-slate-200 dark:border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5">
              <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-textSub uppercase tracking-widest">
                THỜI GIAN
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-textSub uppercase tracking-widest">
                NỘI DUNG
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-textSub uppercase tracking-widest text-right">
                SỐ TIỀN
              </th>
              <th className="p-6 text-[10px] font-bold text-slate-400 dark:text-textSub uppercase tracking-widest text-center">
                QUẢN TRỊ
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] animate-pulse"
                  >
                    Đang truy xuất dữ liệu...
                  </td>
                </tr>
              ) : processedTransactions.length > 0 ? (
                processedTransactions.map((t) => (
                  <motion.tr
                    key={t.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="transition-colors border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 group"
                  >
                    <td className="p-6 text-xs font-bold tracking-tight text-slate-500 dark:text-textSub">
                      {t.date}
                    </td>
                    <td className="p-6 text-xs font-bold uppercase transition-colors text-slate-800 dark:text-textMain group-hover:text-primary">
                      {t.text}
                    </td>
                    <td
                      className={`p-6 text-right font-bold text-lg tracking-tighter ${t.amount > 0 ? "text-income" : "text-expense"}`}
                    >
                      {t.amount.toLocaleString()}{" "}
                      <span className="text-[10px] opacity-60 font-medium">
                        VNĐ
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => setDeleteId(t.id)} // THAY ĐỔI: Không xóa ngay, mà mở modal
                        className="p-3 transition-all text-slate-300 hover:text-expense hover:bg-expense/10 rounded-xl"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-xs font-bold tracking-widest text-center uppercase text-slate-400 opacity-30"
                  >
                    Không tìm thấy dữ liệu giao dịch phù hợp
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* --- MODAL XÁC NHẬN XÓA (GIGACHAD STYLE) --- */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-expense/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-6 text-3xl rounded-full bg-expense/10 text-expense animate-bounce">
                  <FaTriangleExclamation />
                </div>
                <h3 className="mb-2 text-xl font-bold tracking-tighter uppercase text-slate-800 dark:text-white">
                  Xác nhận xóa?
                </h3>
                <p className="mb-8 text-xs font-medium leading-relaxed text-slate-500 dark:text-textSub">
                  Hành động này sẽ xóa vĩnh viễn giao dịch khỏi hệ thống AF
                  Finance. Bạn có chắc chắn muốn xóa?
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-background text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-4 rounded-2xl bg-expense text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-expense/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY BỘ LỌC */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              style={{ fontFamily: "sans-serif" }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-white/10"
            >
              <button
                onClick={() => setIsFilterOpen(false)}
                className="absolute text-2xl transition-colors top-8 right-8 text-slate-300 hover:text-primary"
              >
                <FaXmark />
              </button>

              <h3 className="flex items-center gap-3 mb-8 text-xl font-bold tracking-tighter uppercase text-slate-800 dark:text-white">
                <FaSort className="text-lg text-primary" /> THIẾT LẬP BỘ LỌC
              </h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    PHÂN LOẠI
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-50 dark:bg-background border border-slate-200 dark:border-slate-800 rounded-2xl h-[48px]">
                    {["all", "income", "expense"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilters({ ...filters, type })}
                        className={`flex-1 rounded-xl text-[9px] font-bold uppercase transition-all ${filters.type === type ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                      >
                        {type === "all"
                          ? "TẤT CẢ"
                          : type === "income"
                            ? "THU NHẬP"
                            : "CHI TIÊU"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    SẮP XẾP THEO
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        id: "date-desc",
                        label: "GẦN ĐÂY NHẤT",
                        icon: <FaCalendarDays />,
                      },
                      {
                        id: "amount-desc",
                        label: "GIÁ TRỊ LỚN NHẤT",
                        icon: <FaArrowUpWideShort />,
                      },
                      {
                        id: "amount-asc",
                        label: "GIÁ TRỊ NHỎ NHẤT",
                        icon: <FaArrowDownWideShort />,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setFilters({ ...filters, sortBy: opt.id })
                        }
                        className={`flex items-center gap-4 p-4 rounded-2xl text-[10px] font-bold uppercase transition-all border ${filters.sortBy === opt.id ? "bg-primary/5 border-primary text-primary" : "bg-slate-50 dark:bg-background border-transparent text-slate-400 hover:border-slate-300"}`}
                      >
                        <span className="text-sm">{opt.icon}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-slate-900 dark:bg-primary text-white font-bold py-4 rounded-2xl text-[12px] uppercase tracking-widest mt-4 shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  XÁC NHẬN BỘ LỌC
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transactions;
