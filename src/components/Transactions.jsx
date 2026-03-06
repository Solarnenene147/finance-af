import React, { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaMagnifyingGlass, FaFilter } from "react-icons/fa6";

const Transactions = () => {
  const { transactions, deleteTransaction } = useGlobalContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Logic lọc dữ liệu
  const filteredTransactions = transactions.filter((t) =>
    t.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 h-full bg-background p-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h2 className="text-4xl font-bold text-textMain tracking-tight uppercase">
          Nhật Ký Giao Dịch
        </h2>
        <p className="text-textSub mt-1 text-[10px] font-bold tracking-widest uppercase">
          Quản lý chi tiết dòng tiền
        </p>
      </motion.div>

      {/* Thanh công cụ */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-textSub group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-panel p-4 pl-12 rounded-2xl text-sm outline-none focus:border-primary transition-all font-bold"
          />
        </div>

        <button className="bg-panel px-6 rounded-2xl text-textSub hover:text-primary flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all">
          <FaFilter /> Lọc dữ liệu
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-panel rounded-[2.5rem] shadow-panel-depth overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="p-6 text-[10px] font-bold text-textSub uppercase tracking-widest">
                Ngày
              </th>
              <th className="p-6 text-[10px] font-bold text-textSub uppercase tracking-widest">
                Nội dung
              </th>
              <th className="p-6 text-[10px] font-bold text-textSub uppercase tracking-widest text-right">
                Số tiền
              </th>
              <th className="p-6 text-[10px] font-bold text-textSub uppercase tracking-widest text-center">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-6 text-xs text-textSub font-bold">
                      {t.date}
                    </td>

                    <td className="p-6 font-bold text-textMain group-hover:text-primary transition-colors">
                      {t.text}
                    </td>

                    <td
                      className={`p-6 text-right font-bold text-lg ${
                        t.amount > 0 ? "text-income" : "text-expense"
                      }`}
                    >
                      {t.amount.toLocaleString()} đ
                    </td>

                    <td className="p-6 text-center">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-3 text-textSub hover:text-expense hover:bg-expense/10 rounded-xl transition-all"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center text-textSub font-bold uppercase text-xs tracking-widest opacity-30"
                  >
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
