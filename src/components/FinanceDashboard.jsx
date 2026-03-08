import React, { useState, useMemo, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowTrendUp, FaArrowTrendDown, FaPlus } from "react-icons/fa6";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from "recharts";

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const FinanceDashboard = () => {
  const { transactions, addTransaction } = useGlobalContext();
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState({
    text: "",
    amount: "",
    type: "income",
  });
  useEffect(() => {
    document.title = "Dashboard";
  }, []);
  const { income, expense, totalBalance } = useMemo(() => {
    const inc = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
    const exp = Math.abs(
      transactions
        .filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + t.amount, 0),
    );
    return { income: inc, expense: exp, totalBalance: inc - exp };
  }, [transactions]);

  const chartData = useMemo(() => {
    if (income === 0 && expense === 0) return [{ name: "Trống", value: 1 }];
    return [
      { name: "Thu nhập", value: income },
      { name: "Chi tiêu", value: expense },
    ];
  }, [income, expense]);

  const COLORS =
    income === 0 && expense === 0 ? ["#334155"] : ["#22c55e", "#ef4444"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.amount) return;
    const amountNum = Math.abs(parseFloat(formData.amount));
    await addTransaction({
      text: formData.text,
      amount: formData.type === "expense" ? -amountNum : amountNum,
      category: "General",
    });
    setFormData({ text: "", amount: "", type: "income" });
  };

  // --- MẸO GIGACHAD: TỰ GIẢM SIZE CHỮ KHI SỐ QUÁ DÀI ---
  const getFontSize = (value) => {
    const len = value.toLocaleString().length;
    if (len > 15) return "text-xl";
    if (len > 12) return "text-2xl";
    if (len > 10) return "text-3xl";
    return "text-4xl";
  };

  return (
    <div className="flex flex-col flex-1 h-screen p-8 overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-background">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 mb-6"
      >
        <h2 className="text-3xl font-bold tracking-tight uppercase text-slate-800 dark:text-textMain">
          Tổng Quan Tài Sản
        </h2>
        <p className="text-slate-500 dark:text-textSub text-[10px] font-bold tracking-widest uppercase">
          AF Finance Management • System Stable
        </p>
      </motion.div>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CỘT 1: VÍ & NHẬP LIỆU */}
        <div className="flex flex-col gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white border shadow-sm dark:bg-panel border-slate-200 dark:border-white/5 rounded-3xl dark:shadow-panel-depth"
          >
            <h3 className="text-slate-500 dark:text-textSub text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
              Số dư hiện hữu
            </h3>
            <div
              className={`font-bold tracking-tighter transition-all duration-300 ${getFontSize(totalBalance)} ${totalBalance >= 0 ? "text-income" : "text-expense"}`}
            >
              {totalBalance.toLocaleString()}{" "}
              <span className="text-lg font-normal opacity-40">đ</span>
            </div>
          </motion.div>

          <div className="flex flex-col flex-1 p-6 overflow-hidden bg-white border shadow-sm dark:bg-panel border-slate-200 dark:border-white/5 rounded-3xl dark:shadow-panel-depth">
            <h3 className="flex items-center mb-4 text-lg font-bold uppercase text-slate-800 dark:text-textMain">
              <span className="w-1 h-5 mr-3 rounded-full bg-primary"></span> Ghi
              Chép
            </h3>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full gap-4"
            >
              <div className="flex p-1 border bg-slate-100 dark:bg-background border-slate-200 dark:border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all ${formData.type === "income" ? "bg-income text-white shadow-lg" : "text-slate-500 dark:text-textSub"}`}
                >
                  THU NHẬP
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all ${formData.type === "expense" ? "bg-expense text-white shadow-lg" : "text-slate-500 dark:text-textSub"}`}
                >
                  CHI TIÊU
                </button>
              </div>
              <input
                type="text"
                placeholder="Nội dung..."
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="w-full p-3 text-sm font-bold border outline-none bg-slate-50 dark:bg-background border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary text-slate-800 dark:text-textMain"
              />
              <input
                type="number"
                placeholder="Số tiền..."
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full p-3 text-sm font-bold border outline-none bg-slate-50 dark:bg-background border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary text-slate-800 dark:text-textMain"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-full gap-2 py-4 mt-auto text-xs font-bold tracking-widest text-white uppercase transition-all shadow-lg bg-primary hover:bg-primary/90 rounded-xl active:scale-95"
              >
                <FaPlus /> Xác nhận
              </button>
            </form>
          </div>
        </div>

        {/* CỘT 2: PHÂN TÍCH */}
        <div className="flex flex-col p-6 bg-white border shadow-sm dark:bg-panel border-slate-200 dark:border-white/5 rounded-3xl dark:shadow-panel-depth">
          <h3 className="mb-4 text-lg font-bold text-center uppercase text-slate-800 dark:text-textMain">
            Phân Tích
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  innerRadius="68%"
                  outerRadius="82%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active &&
                    payload?.length && (
                      <div className="p-3 bg-white border shadow-2xl dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          {payload[0].name}
                        </p>
                        <p
                          className={`text-sm font-bold ${payload[0].name === "Thu nhập" ? "text-income" : "text-expense"}`}
                        >
                          {payload[0].value.toLocaleString()} đ
                        </p>
                      </div>
                    )
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {["Thu nhập", "Chi tiêu"].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-2 transition-opacity ${activeIndex === i || activeIndex === null ? "opacity-100" : "opacity-30"}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${i === 0 ? "bg-income" : "bg-expense"}`}
                />
                <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-textMain">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT 3: NHẬT KÝ (FIXED COLORS) */}
        <div className="flex flex-col p-6 overflow-hidden bg-white border shadow-sm dark:bg-panel border-slate-200 dark:border-white/5 rounded-3xl dark:shadow-panel-depth">
          <h3 className="mb-4 text-lg font-bold text-center uppercase text-slate-800 dark:text-textMain">
            Nhật Ký
          </h3>
          <div className="flex-1 pr-2 space-y-3 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {transactions.length > 0 ? (
                transactions.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between p-4 transition-all border border-transparent bg-slate-50 dark:bg-slate-800/40 rounded-2xl hover:border-primary/30 group"
                  >
                    <div className="flex items-center min-w-0 gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs ${t.amount > 0 ? "bg-income/20 text-income" : "bg-expense/20 text-expense"}`}
                      >
                        {t.amount > 0 ? (
                          <FaArrowTrendUp size={14} />
                        ) : (
                          <FaArrowTrendDown size={14} />
                        )}
                      </div>
                      <div className="truncate">
                        {/* Fix màu chữ text-slate-700 -> dark:text-white */}
                        <p className="text-xs font-bold uppercase truncate transition-colors text-slate-700 dark:text-slate-100 group-hover:text-primary">
                          {t.text}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                          {t.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold text-sm tracking-tighter ${t.amount > 0 ? "text-income" : "text-expense"}`}
                    >
                      {t.amount.toLocaleString()} đ
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-textSub">
                    Không có giao dịch
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
