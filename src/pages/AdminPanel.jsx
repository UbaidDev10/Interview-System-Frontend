import { useState, useEffect } from "react";
import { FiPlus, FiLogOut } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import CreateJob from "../components/CreateJob";
import JobList from "../components/JobList";

const AdminPanel = () => {
  const [activePage, setActivePage] = useState(""); // Default to Dashboard
  const [adminName, setAdminName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "Admin";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#10163A] text-white p-6 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Profile section */}
          <div className="text-center">
            <HiOutlineUserCircle className="mx-auto text-5xl text-blue-400" />
            <h2 className="mt-2 font-bold text-lg">{username}</h2>
            <p className="text-sm text-green-400">Online</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-4 mt-10">
            <button
              onClick={() => setActivePage("create-post")}
              className={`w-full flex items-center gap-3 py-2 px-4 rounded-lg transition ${
                activePage === "create-post" ? "bg-blue-500" : "hover:bg-blue-700"
              }`}
            >
              <FiPlus className="text-xl" />
              <span>Create Post</span>
            </button>
            <button
              onClick={() => setActivePage("view-posts")}
              className={`w-full flex items-center gap-3 py-2 px-4 rounded-lg transition ${
                activePage === "view-posts" ? "bg-blue-500" : "hover:bg-blue-700"
              }`}
            >
              <FiPlus className="text-xl" />
              <span>View Posts</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-red-500 transition"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Content based on selection */}
        {activePage === "create-post" && <CreateJob />}
        {activePage === "view-posts" && <JobList />}
        {activePage === "" && (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl text-gray-500">Select an action from the menu</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
