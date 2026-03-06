import React, { useState, useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { motion } from "framer-motion";
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
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-lg"
        style={{ cursor: "pointer" }}
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

  const chartData = [
    { name: "Thu nhập", value: income || 0.1 },
    { name: "Chi tiêu", value: expense || 0 },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.amount) return;
    const amountNum = parseFloat(formData.amount);
    await addTransaction({
      text: formData.text,
      amount:
        formData.type === "expense"
          ? -Math.abs(amountNum)
          : Math.abs(amountNum),
      date: new Date().toISOString().split("T")[0],
    });
    setFormData({ text: "", amount: "", type: "income" });
  };

  return (
    // bg-background ở Light Mode sẽ là xám nhạt, Dark Mode là đen sâu
    <div className="flex-1 h-screen bg-slate-50 dark:bg-background p-8 flex flex-col overflow-hidden transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6 flex-shrink-0"
      >
        <h2 className="text-3xl font-bold text-slate-800 dark:text-textMain tracking-tight uppercase">
          Tổng Quan Tài Sản
        </h2>
        <p className="text-slate-500 dark:text-textSub text-[10px] font-bold tracking-widest uppercase">
          AF Finance Management
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* CỘT 1: BALANCE & FORM */}
        <div className="flex flex-col gap-6 h-full min-h-0">
          {/* bg-panel ở Light Mode là trắng, có shadow nhẹ và border slate-200 */}
          <div className="bg-white dark:bg-panel p-6 rounded-3xl shadow-sm dark:shadow-panel-depth border border-slate-200 dark:border-white/5 flex-shrink-0 group">
            <h3 className="text-slate-400 dark:text-textSub text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60 transition-opacity group-hover:opacity-100">
              Số dư hiện hữu
            </h3>
            <div
              className={`text-4xl font-bold tracking-tighter truncate ${totalBalance >= 0 ? "text-income" : "text-expense"}`}
            >
              {totalBalance.toLocaleString()}{" "}
              <span className="text-lg font-normal opacity-40">đ</span>
            </div>
          </div>

          <div className="bg-white dark:bg-panel p-6 rounded-3xl shadow-sm dark:shadow-panel-depth border border-slate-200 dark:border-white/5 flex-1 flex flex-col min-h-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-textMain mb-4 flex items-center uppercase tracking-tighter flex-shrink-0">
              <span className="w-1 h-5 bg-primary rounded-full mr-3"></span> Ghi
              Chép
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex-1 flex flex-col justify-center"
            >
              <div className="flex p-1 bg-slate-100 dark:bg-background rounded-xl border border-slate-200 dark:border-slate-800 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "income" })}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all ${formData.type === "income" ? "bg-income text-white shadow-md" : "text-slate-400 dark:text-textSub"}`}
                >
                  THU NHẬP
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "expense" })}
                  className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all ${formData.type === "expense" ? "bg-expense text-white shadow-md" : "text-slate-400 dark:text-textSub"}`}
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
                className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm outline-none focus:border-primary dark:focus:border-primary text-slate-800 dark:text-textMain transition-all font-bold"
              />
              <input
                type="number"
                placeholder="Số tiền..."
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-background border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm outline-none focus:border-primary dark:focus:border-primary text-slate-800 dark:text-textMain transition-all font-bold"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-primary/30 active:scale-95 transition-all uppercase tracking-widest text-xs mt-auto"
              >
                Xác nhận
              </button>
            </form>
          </div>
        </div>

        {/* CỘT 2: BIỂU ĐỒ */}
        <div className="bg-white dark:bg-panel p-6 rounded-3xl shadow-sm dark:shadow-panel-depth border border-slate-200 dark:border-white/5 flex flex-col h-full min-h-0 items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-textMain mb-4 uppercase tracking-tighter flex-shrink-0">
            Phân Tích
          </h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  innerRadius="65%"
                  outerRadius="80%"
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      className="focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-textSub mb-1">
                            {payload[0].name}
                          </p>
                          <p
                            className={`text-sm font-bold ${payload[0].name === "Thu nhập" ? "text-income" : "text-expense"}`}
                          >
                            {payload[0].value.toLocaleString()} đ
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend Custom */}
          <div className="flex gap-8 mt-4 flex-shrink-0">
            <div
              className={`flex items-center gap-2 transition-opacity ${activeIndex === 0 ? "opacity-100" : "opacity-40"}`}
            >
              <div className="w-3 h-3 rounded-full bg-income shadow-sm"></div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-textMain uppercase">
                Thu nhập
              </span>
            </div>
            <div
              className={`flex items-center gap-2 transition-opacity ${activeIndex === 1 ? "opacity-100" : "opacity-40"}`}
            >
              <div className="w-3 h-3 rounded-full bg-expense shadow-sm"></div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-textMain uppercase">
                Chi tiêu
              </span>
            </div>
          </div>
        </div>

        {/* CỘT 3: NHẬT KÝ */}
        <div className="bg-white dark:bg-panel p-6 rounded-3xl shadow-sm dark:shadow-panel-depth border border-slate-200 dark:border-white/5 flex flex-col h-full min-h-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-textMain mb-4 uppercase tracking-tighter flex-shrink-0">
            Nhật Ký
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-0">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-background/40 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${t.amount > 0 ? "bg-income/10 text-income" : "bg-expense/10 text-expense"}`}
                  >
                    {t.amount > 0 ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-700 dark:text-textMain text-xs truncate group-hover:text-primary transition-colors">
                      {t.text}
                    </p>
                    <p className="text-[8px] text-slate-400 dark:text-textSub font-bold uppercase">
                      {t.date}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-bold text-sm tracking-tighter flex-shrink-0 ${t.amount > 0 ? "text-income" : "text-expense"}`}
                >
                  {t.amount.toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
