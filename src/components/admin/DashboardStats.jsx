"use client"

import { useState, useEffect } from "react";
import { Briefcase, Users, Clock, TrendingUp, Building } from "lucide-react";
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
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Total Applicants",
      value: stats.totalApplicants,
      icon: <Users className="h-6 w-6" />,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: <Clock className="h-6 w-6" />,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor} mb-1`}>{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Recent Applications
            </h3>
            <p className="text-sm text-gray-600 mt-1">Latest candidate submissions</p>
          </div>

          <div className="p-6">
            {recentApplicants.length > 0 ? (
              <ul className="space-y-4">
                {recentApplicants.map((app, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                        {app.User?.username?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{app.User?.username || "Unknown"}</span>
                        <p className="text-xs text-gray-500">{app.jobTitle}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                        app.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : app.status === "accepted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No recent applications</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Recent Job Postings
            </h3>
            <p className="text-sm text-gray-600 mt-1">Latest job opportunities</p>
          </div>

          <div className="p-6">
            {recentJobs.length > 0 ? (
              <ul className="space-y-4">
                {recentJobs.map((job, index) => {
                  const totalApps = job.applications?.length || 0;
                  return (
                    <li
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h4>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                            {totalApps} {totalApps === 1 ? "applicant" : "applicants"}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">No recent job postings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
