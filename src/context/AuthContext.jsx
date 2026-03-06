/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("af_finance_logged_in") === "true";
  });

  const [isDevMode, setIsDevMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false); // Trạng thái Đăng ký

  useEffect(() => {
    localStorage.setItem("af_finance_logged_in", isLoggedIn);
  }, [isLoggedIn]);

  // Điều hướng
  const checkLogin = () => {
    setShowLogin(true);
    setIsSigningUp(false);
  };
  const goToSignUp = () => {
    setIsSigningUp(true);
    setShowLogin(false);
  };
  const goToLogin = () => {
    setIsSigningUp(false);
    setShowLogin(true);
  };
  const backToHome = () => {
    setIsSigningUp(false);
    setShowLogin(false);
  };

  const bypass = () => setIsDevMode(true);
  const login = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setIsSigningUp(false);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setIsDevMode(false);
    localStorage.removeItem("af_finance_logged_in");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isDevMode,
        showLogin,
        isSigningUp,
        checkLogin,
        goToSignUp,
        goToLogin,
        backToHome,
        bypass,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
