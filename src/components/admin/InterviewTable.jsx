import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Video, Calendar, Clock, ArrowLeft, User } from 'lucide-react';

const InterviewTable = ({ jobId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // You will replace this mock with actual API data
  const interviews = [
    {
      id: 1,
      candidateName: "Sarah Johnson",
      candidateEmail: "sarah.j@example.com",
      date: "2023-06-15",
      time: "10:00 AM",
      duration: "45 minutes",
      status: "Completed",
      avatar: null,
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      candidateEmail: "michael.c@example.com",
      date: "2023-06-16",
      time: "2:30 PM",
      duration: "30 minutes",
      status: "Scheduled",
      avatar: null,
    },
    {
      id: 3,
      candidateName: "Emily Rodriguez",
      candidateEmail: "emily.r@example.com",
      date: "2023-06-17",
      time: "11:15 AM",
      duration: "60 minutes",
      status: "Completed",
      avatar: null,
    },
    {
      id: 4,
      candidateName: "David Kim",
      candidateEmail: "david.k@example.com",
      date: "2023-06-18",
      time: "9:00 AM",
      duration: "45 minutes",
      status: "Scheduled",
      avatar: null,
    },
    {
      id: 5,
      candidateName: "John Doe",
      candidateEmail: "JohnDoe@example.com",
      date: "2023-06-18",
      time: "9:00 AM",
      duration: "54 minutes",
      status: "Scheduled",
      avatar: null,
    },
  ];

  const filtered = interviews.filter(
    (i) =>
      i.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Interview Recordings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                All interviews for{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Job ID: {jobId}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </button>
              <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                {filtered.length} interviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Search candidates by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Video className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No interviews found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Try adjusting your search or check back later
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Candidate
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.map((interview) => (
                    <tr
                      key={interview.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {interview.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={interview.avatar || "/placeholder.svg"}
                                alt={interview.candidateName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                {getInitials(interview.candidateName)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {interview.candidateName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {interview.candidateEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                            {new Date(interview.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                            {interview.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1.5" />
                          {interview.duration}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            interview.status
                          )}`}
                        >
                          {interview.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/admin/interviews/${jobId}/${interview.id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow"
                        >
                          <Video className="h-4 w-4" />
                          View Recording
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filtered.length}</span> of{" "}
                    <span className="font-medium">{filtered.length}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      aria-current="page"
                      className="z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewTable;