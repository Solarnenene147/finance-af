/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";

// Tạo Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Lấy trạng thái lưu trong bộ nhớ, nếu chưa có thì mặc định là 'dark' cho ngầu
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Hàm này sẽ chạy mỗi khi bro gạt công tắc (biến 'theme' thay đổi)
  useEffect(() => {
    // Túm lấy thẻ <html> ngoài cùng
    const html = window.document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark"); // Gắn mác dark
      html.classList.remove("light"); // Nhổ mác light đi
    } else {
      html.classList.add("light"); // Gắn mác light
      html.classList.remove("dark"); // Nhổ mác dark đi
    }

    // Lưu vào LocalStorage để F5 không bị mất màu
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hàm lật công tắc
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
