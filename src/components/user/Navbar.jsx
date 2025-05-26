import { FiHome, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import useUserProfile from "../../hooks/admin/useUserProfile";
import { useNavigate } from "react-router-dom";

const Navbar = ({ activeTab }) => {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-purple-600">
                InterviewHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/user"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "home"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiHome className="mr-2" /> Home
              </Link>

              <Link
                to="/Interviews"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === "interviews"
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiCalendar className="mr-2" /> Interviews
              </Link>

              <Link
                to="/user/profile"
                className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
              >
                {profile?.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <FiUser className="h-6 w-6" />
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                title="Logout"
              >
                <FiLogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
