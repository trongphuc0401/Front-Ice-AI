import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">
            <span className={`line ${isOpen ? "open" : ""}`}></span>
            <span className={`line ${isOpen ? "open" : ""}`}></span>
            <span className={`line ${isOpen ? "open" : ""}`}></span>
          </span>
        </button>
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Front Ice AI</h2>
          {isMobile && (
            <button className="close-sidebar" onClick={closeSidebar}>
              ×
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <a href="#dashboard" onClick={closeSidebar}>
                <span className="icon">📊</span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#compare" onClick={closeSidebar}>
                <span className="icon">⚖️</span>
                Compare Files
              </a>
            </li>
            <li>
              <a href="#history" onClick={closeSidebar}>
                <span className="icon">📜</span>
                History
              </a>
            </li>
            <li>
              <a href="#settings" onClick={closeSidebar}>
                <span className="icon">⚙️</span>
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="theme-toggle">
          <button onClick={toggleTheme} className="theme-toggle-button">
            <span className="icon">{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <div className="sidebar-footer">
          <p>© 2024 Front Ice AI</p>
          <small>Version 1.0.0</small>
        </div>
      </aside>

      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;
