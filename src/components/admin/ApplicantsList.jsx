"use client";

import { useState, useEffect } from "react";
import useGetJobs from "../../hooks/admin/useGetJobs";
import useGetJobApplications from "../../hooks/admin/useGetJobApplications";
import useUpdateApplicationStatus from "../../hooks/admin/useUpdateApplicationStatus";
import useScheduleInterview from "../../hooks/admin/useScheduleInterview";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import ResumePreviewModal from "./ResumePreviewModal";
import Modal from "../ui/Modal";
import useModal from "../../hooks/useModal";
import { Search, Users, Calendar, UserCheck, UserX } from "lucide-react";

const ApplicantsList = () => {
  const { getJobs } = useGetJobs();
  const { getJobApplications } = useGetJobApplications();
  const { updateStatus } = useUpdateApplicationStatus();
  const { scheduleInterview } = useScheduleInterview();
  const { isOpen, modalContent, showModal, hideModal } = useModal();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getJobs();
        const jobArray = jobList?.data?.jobs || [];
        setJobs(jobArray);

        if (jobArray.length > 0) {
          setSelectedJobId(jobArray[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const apps = await getJobApplications(selectedJobId);
        setApplications(Array.isArray(apps) ? apps : []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedJobId]);

  const handleOpenInterviewModal = (app) => {
    if (app.status !== "pending") return;
    setSelectedApplication(app);
    setInterviewModalOpen(true);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      console.log("Updating status:", { applicationId, newStatus });
      const response = await updateStatus(applicationId, newStatus);
      console.log("Status update response:", response);

      if (response?.data?.status === "success") {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else {
        throw new Error("Status update failed");
      }
    } catch (err) {
      console.error("Failed to update status", err);
      showModal({
        title: "Error",
        message: "Failed to update application status. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSchedule = async (userId, data) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      console.log("Scheduling interview with data:", data);
      const response = await scheduleInterview(userId, data);
      console.log("Interview schedule response:", response);

      if (response?.data?.id || response?.data?.status === "success") {
        // Update the application status to accepted
        await handleStatusChange(data.application_id, "accepted");
        setInterviewModalOpen(false);
        setSelectedApplication(null);

        // Refresh the applications list
        const apps = await getJobApplications(selectedJobId);
        setApplications(Array.isArray(apps) ? apps : []);
      } else {
        throw new Error("Interview creation failed without error response");
      }
    } catch (error) {
      console.error("Interview scheduling failed:", error);
      if (error.response?.status === 409) {
        showModal({
          title: "Warning",
          message: "User already has an interview scheduled during this time.",
          type: "warning",
        });
      } else {
        showModal({
          title: "Error",
          message: "Failed to schedule interview. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.User?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Applicants
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search applicants..."
                className="pl-10 pr-4 py-2 w-full h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-[220px]">
              <select
                value={selectedJobId || ""}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 appearance-none"
              >
                <option value="" disabled>
                  Select a job
                </option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 dark:text-gray-500"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-[200px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-[150px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="p-6 flex flex-col items-center justify-center h-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 dark:text-gray-500 mb-2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                {applications.length === 0
                  ? "No applicants for the selected job."
                  : "No applicants match your search criteria."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {app.User?.username || "Unnamed Applicant"}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyles(
                              app.status
                            )}`}
                          >
                            {app.status === "accepted"
                              ? "Scheduled"
                              : app.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {app.User?.email}
                        </p>

                        {app.User?.Documents?.[0]?.file_url && (
                          <button
                            onClick={() => {
                              setPreviewUrl(app.User.Documents[0].file_url);
                              setPreviewOpen(true);
                            }}
                            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline cursor-pointer"
                          >
                            📄 Preview Resume
                          </button>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        {app.applied_date && (
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="4"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span>
                              Applied:{" "}
                              {new Date(app.applied_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {app.status === "pending" && (
                      <div className="flex md:flex-col gap-2 p-6 md:p-4 md:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 md:bg-transparent justify-end">
                        <div className="relative group">
                          <button
                            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                              isUpdating
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            } text-emerald-700 transition-colors`}
                            onClick={() => handleOpenInterviewModal(app)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">
                                  Schedule Interview
                                </span>
                              </>
                            )}
                          </button>
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Schedule interview and mark as hired
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>

                        <div className="relative group">
                          <button
                            className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${
                              isUpdating
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            } text-red-700 transition-colors`}
                            onClick={() =>
                              handleStatusChange(app.id, "rejected")
                            }
                            disabled={isUpdating}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Reject</span>
                          </button>
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Reject this application
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interview Modal */}
        {selectedApplication && (
          <ScheduleInterviewModal
            isOpen={interviewModalOpen}
            onClose={() => setInterviewModalOpen(false)}
            onSubmit={handleSchedule}
            userId={selectedApplication.User.user_id}
            applicationId={selectedApplication.id}
            isUpdating={isUpdating}
          />
        )}

        {/* Resume Preview Modal */}
        <ResumePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          pdfUrl={previewUrl}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={hideModal}
        title={modalContent.title}
        type={modalContent.type}
      >
        <p className="text-sm">{modalContent.message}</p>
      </Modal>
    </>
  );
};

export default ApplicantsList;
