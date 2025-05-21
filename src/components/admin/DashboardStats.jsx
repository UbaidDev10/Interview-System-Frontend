import { useState, useEffect } from "react";
import { FiBriefcase, FiUsers, FiClock, FiUser } from "react-icons/fi";
import useGetJobs from "../../hooks/admin/useGetJobs";
import useGetJobApplications from "../../hooks/admin/useGetJobApplications";

const DashboardStats = () => {
  const { getJobs } = useGetJobs();
  const { getJobApplications } = useGetJobApplications();

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    pendingReviews: 0,
  });

  const [recentApplicants, setRecentApplicants] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobList = await getJobs();
        const jobArray = jobList?.data?.jobs || [];

        // Fetch all applications grouped by job
        const applicationsGrouped = await Promise.all(
          jobArray.map(async (job) => {
            const applications = await getJobApplications(job.id);
            return {
              job,
              applications,
            };
          })
        );

        // Flatten all applications and attach job info
        const mergedApps = applicationsGrouped.flatMap((group) =>
          group.applications.map((app) => ({
            ...app,
            jobTitle: group.job.title,
            jobCreatedAt: group.job.createdAt,
          }))
        );

        // Recent 5 applicants from ALL applications
        const recent = [...mergedApps]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Stats from ALL applications
        const totalApplicants = mergedApps.length;
        const pendingReviews = mergedApps.filter(
          (app) => app.status === "pending"
        ).length;

        // Attach applications to each job
        const jobsWithApps = jobArray.map((job) => {
          const match = applicationsGrouped.find((g) => g.job.id === job.id);
          return {
            ...job,
            applications: match?.applications || [],
          };
        });

        // Get 5 most recently created jobs
        const recJobs = [...jobsWithApps]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        // Set state
        setStats({
          totalJobs: jobArray.length,
          totalApplicants,
          pendingReviews,
        });

        setRecentApplicants(recent);
        setRecentJobs(recJobs);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };

    fetchData();
  }, []);

  const statItems = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: <FiBriefcase className="text-white" />,
      color: "bg-blue-500 text-blue-100",
    },
    {
      title: "Total Applicants",
      value: stats.totalApplicants,
      icon: <FiUsers className="text-white" />,
      color: "bg-green-500 text-green-100",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: <FiClock className="text-white" />,
      color: "bg-yellow-500 text-yellow-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-sm flex items-center justify-between ${stat.color}`}
          >
            <div>
              <p className="text-sm font-medium text-white">{stat.title}</p>
              <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
            </div>
            <div className="p-3 rounded-full bg-white bg-opacity-10">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applicants */}
        <div className="bg-[#0e1629] rounded-xl p-6 shadow-sm border border-gray-800 text-white">
          <h3 className="text-lg font-semibold mb-1">Recent Applications</h3>
          <p className="text-sm text-gray-400 mb-4">
            Latest candidate applications
          </p>

          <ul className="space-y-4">
            {recentApplicants.map((app, index) => (
              <li key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold uppercase">
                    <FiUser className="font-bold" />
                  </div>
                  <span className="font-medium text-white">
                    {app.User?.username || "Unknown"}
                  </span>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium
                    ${
                      app.status === "pending"
                        ? "bg-blue-500 text-white"
                        : app.status === "accepted"
                        ? "bg-green-500 text-white"
                        : app.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </li>
            ))}

            {recentApplicants.length === 0 && (
              <li className="text-gray-400 text-sm">No recent applications</li>
            )}
          </ul>
        </div>

        {/* Recent Jobs */}
        <div className="bg-[#0e1629] rounded-xl p-6 shadow-sm border border-gray-800 text-white">
          <h3 className="text-lg font-semibold mb-1">Recent Jobs</h3>
          <p className="text-sm text-gray-400 mb-4">
            Latest job postings overview
          </p>

          <ul className="space-y-4">
            {recentJobs.map((job, index) => {
              const totalApps = job.applications?.length || 0;
              return (
                <li
                  key={index}
                  className="border-b border-gray-700 pb-3 last:border-none"
                >
                  <div className="flex justify-between border rounded-full p-5 items-start">
                    <div>
                      <h4 className="text-sm font-semibold">{job.title}</h4>
                      <p className="text-xs text-gray-300 mt-1 truncate w-64">
                        {job.description}
                      </p>
                    </div>
                    <div className="text-sm text-white font-medium bg-blue-600 bg-opacity-20 px-3 py-1 rounded-full self-start">
                      {totalApps} Applicant{totalApps !== 1 && "s"}
                    </div>
                  </div>
                </li>
              );
            })}

            {recentJobs.length === 0 && (
              <li className="text-gray-400 text-sm">No recent jobs</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
