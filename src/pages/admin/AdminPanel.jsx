import { useState, useEffect } from "react";
import {
  FiLogOut,
  FiMoon,
  FiSun,
  FiHome,
  FiBriefcase,
  FiUsers,
  FiSettings,
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
        return <FiHome className="text-lg" />;
      case "jobs":
        return <FiBriefcase className="text-lg" />;
      case "applicants":
        return <FiUsers className="text-lg" />;
      case "settings":
        return <FiSettings className="text-lg" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } ${darkMode ? "dark:bg-gray-800" : "bg-white"} border-r ${
          darkMode ? "dark:border-gray-700" : "border-gray-300"
        } p-4 flex flex-col justify-between transition-all duration-300 fixed h-full z-10`}
      >
        <div className="space-y-8">
          {/* Logo & Toggle */}
          <div className="flex justify-between items-center p-2">
            <h1 className="text-xl font-bold dark:text-white text-gray-900">
              {sidebarOpen ? "InterviewHub" : "IH"}
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>

          {/* Profile */}
          <div
            className={`flex flex-col items-center gap-2 p-2 rounded-lg ${
              darkMode ? "dark:bg-gray-700" : "bg-gray-100"
            }`}
          >
            <HiOutlineUserCircle
              className={`${
                sidebarOpen ? "text-5xl" : "text-3xl"
              } text-purple-500`}
            />
            {sidebarOpen && (
              <>
                <h2 className="font-bold text-lg dark:text-white text-gray-900">
                  {username}
                </h2>
                <p className="text-xs text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                  Admin
                </p>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {["dashboard", "jobs", "applicants", "settings"].map((page) => {
              const isActive = activePage === page;
              const base = "w-full flex items-center rounded-lg transition";
              const layout = sidebarOpen
                ? "justify-start gap-3 px-4 py-3"
                : "justify-center p-3";
              const activeStyle = isActive
                ? darkMode
                  ? "dark:bg-purple-900 dark:text-white bg-purple-100 text-purple-800"
                  : "bg-purple-100 text-purple-800"
                : darkMode
                ? "dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-100 text-gray-700";

              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`${base} ${layout} ${activeStyle}`}
                >
                  {getIcon(page)}
                  {sidebarOpen && (
                    <span className="font-medium capitalize">{page}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-2">
          {/* Theme Toggle */}
          {(() => {
            const modeToggleClass = [
              "w-full flex items-center rounded-lg transition",
              sidebarOpen ? "justify-start gap-3 px-4 py-3" : "justify-center p-3",
              darkMode
                ? "dark:hover:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-100 text-gray-700",
            ].join(" ");
            return (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={modeToggleClass}
              >
                {darkMode ? (
                  <FiSun className="text-lg" />
                ) : (
                  <FiMoon className="text-lg" />
                )}
                {sidebarOpen && (
                  <span className="font-medium">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                )}
              </button>
            );
          })()}

          {/* Logout */}
          {(() => {
            const logoutClass = [
              "w-full flex items-center rounded-lg transition",
              sidebarOpen ? "justify-start gap-3 px-4 py-3" : "justify-center p-3",
              darkMode
                ? "dark:hover:bg-red-900/30 hover:bg-red-100 text-red-500"
                : "hover:bg-red-100 text-red-600",
            ].join(" ");
            return (
              <button onClick={handleLogout} className={logoutClass}>
                <FiLogOut className="text-lg" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            );
          })()}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6`}
      >
        <div
          className={`p-6 rounded-xl ${
            darkMode
              ? "dark:bg-gray-800"
              : "bg-white shadow border border-gray-300"
          }`}
        >
          <h1 className="text-2xl font-bold dark:text-white text-gray-900 mb-6 capitalize">
            {activePage}
          </h1>

          {activePage === "dashboard" && <DashboardStats />}
          {activePage === "jobs" && <JobList darkMode={darkMode} />}
          {activePage === "applicants" && (
            <ApplicantsList darkMode={darkMode} />
          )}
          {activePage === "settings" && (
            <div className="flex items-center justify-center h-64">
              <h2 className="text-xl text-gray-600 dark:text-gray-400">
                Settings panel coming soon
              </h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
