import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { GlobalProvider } from "./context/GlobalContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import PrivacyPolicy from "./components/PrivacyPolicy";
import Sidebar from "./components/Sidebar";
import FinanceDashboard from "./components/FinanceDashboard";
import Transactions from "./components/Transactions";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import Goals from "./components/Goals";
import { Toaster } from "react-hot-toast"; // Import thư viện

/* ---------------- LOADING SCREEN ---------------- */
const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen font-bold bg-slate-50 dark:bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Khởi tạo hệ thống...
        </p>
      </div>
    </div>
  );
};

/* ---------------- PROTECTED ROUTE (Cố định Sidebar) ---------------- */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Nếu chưa đăng nhập, đá về Landing thay vì Login (tùy meta của đại ca)
  // Ở đây tôi giữ về /login để ép đăng nhập khi vào link nội bộ
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden font-bold bg-slate-50 dark:bg-background">
      <Sidebar />
      <div className="flex-1 overflow-y-auto custom-scrollbar">{children}</div>
    </div>
  );
};

/* ---------------- PUBLIC ROUTE (Dành cho Login/Signup) ---------------- */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Nếu đã đăng nhập mà còn định vào Login/Signup thì đẩy vào Dashboard ngay
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ---------------- APP ---------------- */
function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          // Cấu hình mặc định cho toàn bộ app
          style: {
            fontFamily: "sans-serif",
            fontWeight: "bold",
          },
        }}
      />
      <ThemeProvider>
        <GlobalProvider>
          <Router>
            <Routes>
              {/* LANDING PAGE: Để ở ngoài cùng. 
                Nếu đại ca muốn user đã login khi vào "/" vẫn thấy Landing thì để nguyên element={<LandingPage />}.
                Nếu muốn đã login vào "/" là bay thẳng vào Dashboard thì dùng logic dưới đây:
              */}
              <Route path="/" element={<LandingPage />} />

              {/* TRANG LOGIN/SIGNUP: Chỉ cho phép khi chưa đăng nhập */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUpPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/privacy"
                element={
                  <PublicRoute>
                    <PrivacyPolicy />
                  </PublicRoute>
                }
              />

              {/* HỆ THỐNG QUẢN TRỊ: Bảo mật tuyệt đối */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <FinanceDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK: Mọi đường dẫn lạ đều về Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </GlobalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
