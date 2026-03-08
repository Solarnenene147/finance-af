import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaShieldHalved, FaMoon, FaSun } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen px-4 py-12 font-bold transition-colors duration-500 bg-slate-50 dark:bg-slate-900 sm:px-6 lg:px-8 text-slate-800 dark:text-slate-200">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-all text-[12px] uppercase tracking-widest"
          >
            <FaChevronLeft /> Quay lại
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 shadow-inner ${
              theme === "dark" ? "bg-primary" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
                theme === "dark" ? "translate-x-7" : "translate-x-1"
              }`}
            >
              {theme === "dark" ? (
                <FaMoon className="text-primary text-[12px]" />
              ) : (
                <FaSun className="text-orange-500 text-[12px]" />
              )}
            </span>
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-[2.5rem] p-10 border border-slate-200 dark:border-white/10 transition-colors duration-500">
          <div className="flex items-center gap-4 pb-8 mb-10 border-b border-slate-100 dark:border-slate-700">
            <div className="p-4 text-4xl shadow-sm bg-primary/10 text-primary rounded-2xl">
              <FaShieldHalved />
            </div>
            <div>
              <h1 className="text-[24px] uppercase tracking-tighter leading-none">
                Chính sách bảo mật
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-2">
                Cập nhật lần cuối: 08/03/2026
              </p>
            </div>
          </div>

          <div className="space-y-10 text-[12px] leading-relaxed tracking-wide">
            {/* SECTION 1 */}
            <section className="space-y-3">
              <h2 className="text-[14px] text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                1. Thu thập thông tin cá nhân
              </h2>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Khi sử dụng ứng dụng AF Finance, hệ thống có thể thu thập một số
                thông tin cá nhân cơ bản bao gồm họ tên, địa chỉ email, số điện
                thoại và ngày sinh. Những thông tin này được cung cấp trực tiếp
                bởi người dùng trong quá trình đăng ký hoặc cập nhật hồ sơ cá
                nhân.
              </p>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Dữ liệu được thu thập nhằm mục đích xác thực tài khoản, hỗ trợ
                quản lý người dùng, cung cấp các tính năng của ứng dụng và cải
                thiện trải nghiệm sử dụng. Chúng tôi chỉ thu thập những thông
                tin cần thiết cho hoạt động của dịch vụ và luôn cố gắng hạn chế
                tối đa việc lưu trữ dữ liệu không cần thiết.
              </p>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-3">
              <h2 className="text-[14px] text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                2. Bảo mật và lưu trữ dữ liệu
              </h2>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Thông tin đăng nhập của người dùng được mã hóa và bảo vệ bằng
                các tiêu chuẩn bảo mật hiện đại. Mật khẩu không được lưu trữ
                dưới dạng văn bản thuần mà được xử lý thông qua cơ chế mã hóa an
                toàn nhằm hạn chế nguy cơ truy cập trái phép.
              </p>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Dữ liệu của người dùng được lưu trữ trên hạ tầng Supabase với
                các lớp bảo mật nhằm đảm bảo tính toàn vẹn và an toàn của thông
                tin. Chúng tôi áp dụng nhiều biện pháp kỹ thuật để giảm thiểu
                rủi ro mất mát, truy cập trái phép hoặc tiết lộ dữ liệu.
              </p>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                AF Finance cam kết không bán, cho thuê hoặc chia sẻ dữ liệu cá
                nhân của người dùng cho bất kỳ bên thứ ba nào, trừ khi có yêu
                cầu hợp pháp từ cơ quan có thẩm quyền theo quy định của pháp
                luật.
              </p>
            </section>

            {/* SECTION 3 */}
            <section className="space-y-3">
              <h2 className="text-[14px] text-primary uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                3. Quyền của người dùng
              </h2>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Người dùng có quyền truy cập và cập nhật thông tin cá nhân của
                mình thông qua các công cụ quản lý tài khoản được cung cấp trong
                ứng dụng. Việc cập nhật thông tin giúp đảm bảo dữ liệu luôn
                chính xác và phản ánh đúng tình trạng hiện tại của tài khoản.
              </p>

              <p className="pl-4 border-l-2 border-slate-100 dark:border-slate-700">
                Ngoài ra, người dùng cũng có quyền thay đổi mật khẩu, tăng cường
                bảo mật tài khoản hoặc yêu cầu xóa tài khoản khỏi hệ thống. Khi
                tài khoản bị xóa, các dữ liệu liên quan có thể được loại bỏ khỏi
                hệ thống theo chính sách lưu trữ và quy trình kỹ thuật của dịch
                vụ.
              </p>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-3">
              <h2 className="text-[14px] text-expense uppercase tracking-wider flex items-center gap-2 font-bold">
                <span className="w-1.5 h-4 bg-expense rounded-full"></span>
                4. Trách nhiệm bảo mật của người dùng
              </h2>

              <p className="pl-4 italic border-l-2 border-slate-100 dark:border-slate-700">
                Người dùng có trách nhiệm bảo mật thông tin đăng nhập của mình,
                bao gồm mật khẩu và các thông tin liên quan đến tài khoản. Chúng
                tôi khuyến nghị không chia sẻ thông tin đăng nhập với bất kỳ cá
                nhân nào và thường xuyên cập nhật mật khẩu để tăng cường mức độ
                an toàn.
              </p>

              <p className="pl-4 italic border-l-2 border-slate-100 dark:border-slate-700">
                Để giảm thiểu rủi ro bảo mật, người dùng nên hạn chế đăng nhập
                tài khoản trên các thiết bị công cộng hoặc mạng internet không
                đáng tin cậy. Trong trường hợp phát hiện hoạt động bất thường,
                người dùng nên thay đổi mật khẩu ngay lập tức để bảo vệ dữ liệu
                cá nhân.
              </p>
            </section>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col items-center pt-8 mt-16 border-t border-slate-100 dark:border-slate-700">
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-bold opacity-60">
              AF Finance Privacy Policy © 2026
            </p>

            <div className="flex gap-6 mt-4 opacity-30">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <div className="w-2 h-2 delay-75 rounded-full bg-primary animate-pulse"></div>
              <div className="w-2 h-2 delay-150 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
