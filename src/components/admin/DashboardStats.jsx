// Updated DashboardStats.jsx with improved light mode styles

import { FiBriefcase, FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";

const DashboardStats = () => {
  const stats = [
    { title: "Total Jobs", value: "24", icon: <FiBriefcase className="text-2xl" />, color: "bg-blue-100 text-blue-600" },
    { title: "Active Jobs", value: "18", icon: <FiCheckCircle className="text-2xl" />, color: "bg-green-100 text-green-600" },
    { title: "Total Applicants", value: "156", icon: <FiUsers className="text-2xl" />, color: "bg-purple-100 text-purple-600" },
    { title: "Pending Reviews", value: "12", icon: <FiClock className="text-2xl" />, color: "bg-yellow-100 text-yellow-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-sm flex items-center justify-between ${stat.color} border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700`}>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color.replace('text', 'bg').replace('100', '50')}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700">
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Recent Applicants</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-500">
            Applicants chart placeholder
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-300 dark:border-gray-700">
          <h3 className="font-medium mb-4 text-gray-900 dark:text-white">Job Status</h3>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-500">
            Jobs status chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
