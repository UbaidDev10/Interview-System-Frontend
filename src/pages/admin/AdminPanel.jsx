"use client"

import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiMoon,
  FiSun,
  FiHome,
  FiBriefcase,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import JobList from "../../components/admin/JobList";
import ApplicantsList from "../../components/admin/ApplicantsList";
import DashboardStats from "../../components/admin/DashboardStats";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getIcon = (page) => {
    switch (page) {
      case "dashboard":
        return <FiHome className="h-5 w-5" />;
      case "jobs":
        return <FiBriefcase className="h-5 w-5" />;
      case "applicants":
        return <FiUsers className="h-5 w-5" />;
      case "settings":
        return <FiSettings className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "jobs", label: "Job Postings" },
    { id: "applicants", label: "Applicants" },
    { id: "settings", label: "Settings" },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 fixed h-full z-50 lg:relative ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiBriefcase className="h-6 w-6 text-blue-600" />
              </div>
              {sidebarOpen && <h1 className="text-xl font-bold text-gray-900">InterviewHub</h1>}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors hidden lg:block"
            >
              {sidebarOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          {/* Profile */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-8 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div>
                  <h2 className="font-semibold text-gray-900">{username}</h2>
                  <p className="text-sm text-gray-600">Administrator</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center rounded-lg transition-colors p-3 ${
                    sidebarOpen ? "justify-start gap-3" : "justify-center"
                  } ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {getIcon(item.id)}
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Controls */}
        <div className="p-6 space-y-2 border-t border-gray-200">
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center rounded-lg transition-colors p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${
              sidebarOpen ? "justify-start gap-3" : "justify-center"
            }`}
          >
            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            {sidebarOpen && <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg transition-colors p-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
              sidebarOpen ? "justify-start gap-3" : "justify-center"
            }`}
          >
            <FiLogOut className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}>
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activePage === "dashboard"
                    ? "Dashboard Overview"
                    : activePage === "jobs"
                      ? "Job Management"
                      : activePage === "applicants"
                        ? "Applicant Management"
                        : "Settings"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {activePage === "dashboard"
                    ? "Welcome back! Here's what's happening."
                    : activePage === "jobs"
                      ? "Create and manage your job postings"
                      : activePage === "applicants"
                        ? "Review and process applications"
                        : "Configure your preferences"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activePage === "dashboard" && <DashboardStats />}
          {activePage === "jobs" && <JobList darkMode={darkMode} />}
          {activePage === "applicants" && <ApplicantsList darkMode={darkMode} />}
          {activePage === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FiSettings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings Panel</h2>
              <p className="text-gray-600">Configuration options will be available here soon.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
