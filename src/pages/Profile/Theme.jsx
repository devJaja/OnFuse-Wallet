import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

const ThemeProvider = ({ children }) => {
  // Get saved theme or default to "light"
  const savedTheme = localStorage.getItem("theme") || "light";

  const [theme, setTheme] = useState(savedTheme);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
