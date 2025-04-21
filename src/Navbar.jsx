import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Home,
  Bell,
  Calendar,
  GraduationCap,
  LampDesk,
  Wallet,
  FileUser,
  Settings,
  Book,
  User,
} from "lucide-react";
import { useTheme } from "./ThemeContext";

// A NavLink component for desktop (icon-only with hover tooltip)
function DesktopNavLink({ to, icon, tooltip }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`group relative flex items-center justify-center w-10 h-10 transition-all ${
        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
      }`}
    >
      {icon}
      {/* Tooltip appears on hover, positioned below the icon */}
      <span className="absolute top-full mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {tooltip}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // CMS URL for student portal (be cautious with storing passwords)
  const cmsUrl = user
    ? `https://cms.guc.edu.eg/apps/student/HomePageStn.aspx?username=${encodeURIComponent(
        user.username
      )}&password=${encodeURIComponent(user.password)}`
    : "#";

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 relative">
      {/* Main Navbar Row */}
      <div className="flex items-center justify-between">
        {/* Mobile Menu Toggle (visible on mobile only) */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="text-gray-900 dark:text-gray-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Logo (centered) */}
        <div className="flex items-center gap-2">
          <img
            src="https://www.guc.edu.eg/20years/img/emblem-guc.png"
            alt="GUC Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Portal
          </span>
        </div>

        {/* Desktop Navigation (icon-only links with tooltips) */}
        <div className="hidden lg:flex gap-6">
          <DesktopNavLink to="/welcome" icon={<Home size={20} />} tooltip="Home" />
          {user && (
            <DesktopNavLink
              to="/grades"
              icon={<GraduationCap size={20} />}
              tooltip="Grades"
            />
          )}
          {user && (
            <DesktopNavLink
              to="/attendance"
              icon={<FileUser size={20} />}
              tooltip="Attendance"
            />
          )}
          <DesktopNavLink
            to="/schedule"
            icon={<Calendar size={20} />}
            tooltip="Schedule"
          />
          <DesktopNavLink
            to="/exam-seats"
            icon={<LampDesk size={20} />}
            tooltip="Exam Seats"
          />
          <DesktopNavLink
            to="/financial-balance"
            icon={<Wallet size={20} />}
            tooltip="Financial Balance"
          />
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <User size={20} />
              <span className="hidden md:inline">{user.username}</span>
            </div>
          )}
          <Link
            to="/settings"
            className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Settings size={20} className="text-gray-900 dark:text-gray-100" />
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user && (
            <Link
              to="/notifications"
              className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Bell size={20} className="text-gray-900 dark:text-gray-100" />
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            aria-label="Logout"
          >
            <LogOut size={20} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu (visible on mobile only) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-3">
          <Link
            to="/welcome"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <Home size={20} /> <span>Home</span>
          </Link>
          {user && (
            <Link
              to={cmsUrl}
              onClick={() => setMobileMenuOpen(false)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
            >
              <Book size={20} /> <span>CMS</span>
            </Link>
          )}
          {user && (
            <Link
              to="/attendance"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
            >
              <FileUser size={20} /> <span>Attendance</span>
            </Link>
          )}
          <Link
            to="/schedule"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <Calendar size={20} /> <span>Schedule</span>
          </Link>
          <Link
            to="/exam-seats"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <LampDesk size={20} /> <span>Exam Seats</span>
          </Link>
          <Link
            to="/financial-balance"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <Wallet size={20} /> <span>Financial Balance</span>
          </Link>
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-900 dark:text-gray-100"
          >
            <Settings size={20} /> <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center"
          >
            <LogOut size={20} /> <span className="ml-2">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
