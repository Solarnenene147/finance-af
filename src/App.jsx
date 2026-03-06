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

import Sidebar from "./components/Sidebar";
import FinanceDashboard from "./components/FinanceDashboard";
import Transactions from "./components/Transactions";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import Goals from "./components/Goals";

// VỆ SĨ: Chỉ cho phép vào nếu đã đăng nhập hoặc đang ở Dev Mode
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isDevMode } = useAuth();
  if (!isLoggedIn && !isDevMode) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-row h-screen w-full bg-background text-textMain overflow-hidden transition-colors duration-500">
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <GlobalProvider>
            <Routes>
              {/* Trang công khai */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Trang bảo mật - Cần login */}
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

              {/* Nếu gõ bậy bạ thì về trang chủ */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </GlobalProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
