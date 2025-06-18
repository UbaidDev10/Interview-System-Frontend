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
import { Search, UserCheck, UserX } from "lucide-react";
import { Linkedin } from "lucide-react";
import { FileText } from "lucide-react";

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
        if (jobArray.length > 0) setSelectedJobId(jobArray[0].id);
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

  const handleStatusChange = async (applicationId, newStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await updateStatus(applicationId, newStatus);
      if (response?.data?.status === "success") {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      } else throw new Error("Status update failed");
    } catch (err) {
      showModal({
        title: "Error",
        message: "Failed to update application status. Please try again.",
        type: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenInterviewModal = (app) => {
    if (app.status !== "pending") return;
    setSelectedApplication(app);
    setInterviewModalOpen(true);
  };

  const handleSchedule = async (userId, data) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await scheduleInterview(userId, data);
      if (response?.data?.id || response?.data?.status === "success") {
        await handleStatusChange(data.application_id, "accepted");
        setInterviewModalOpen(false);
        setSelectedApplication(null);
        const apps = await getJobApplications(selectedJobId);
        setApplications(Array.isArray(apps) ? apps : []);
      } else throw new Error("Interview creation failed");
    } catch (error) {
      showModal({
        title: error.response?.status === 409 ? "Warning" : "Error",
        message:
          error.response?.status === 409
            ? "User already has an interview scheduled."
            : "Failed to schedule interview. Please try again.",
        type: error.response?.status === 409 ? "warning" : "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.User?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border rounded-md shadow-sm p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Filter Applicants
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="flex-1 h-10 px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-sm"
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
          </div>
        </div>

        {/* Application Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredApplications.length === 0 ? (
          <p className="text-center text-gray-500">No applicants found.</p>
        ) : (
          filteredApplications.map((app) => {
            const parsed = app?.User?.Documents?.[0]?.parsed_data;
            return (
              <div
                key={app.id}
                className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {app.User?.username}
                    </h3>
                    <p className="text-sm text-gray-500">{app.User?.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusBadgeStyles(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Resume Summary */}
                {parsed && (
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                    {parsed.skills?.length > 0 && (
                      <p>
                        <span className="font-bold text-gray-800 dark:text-white">
                          Skills:
                        </span>{" "}
                        {parsed.skills.join(", ")}
                      </p>
                    )}

                    {parsed.experience?.length > 0 && (
                      <p>
                        <span className="font-bold text-gray-800 dark:text-white">
                          Experience:
                        </span>{" "}
                        {parsed.experience[0].jobTitle} at{" "}
                        {parsed.experience[0].companyName}
                      </p>
                    )}

                    {parsed.education?.length > 0 && (
                      <p>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          Education:
                        </span>{" "}
                        {parsed.education[0].degree} -{" "}
                        {parsed.education[0].university}
                      </p>
                    )}

                    {parsed.projects?.[0]?.techStack?.length > 0 && (
                      <div className="pt-2">
                        <p className="font-bold text-gray-800 dark:text-white">
                          Tech Stack:
                        </p>
                        <ul className="flex flex-wrap gap-2 mt-1">
                          {parsed.projects[0].techStack.map((tech, i) => (
                            <li
                              key={i}
                              className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center flex-wrap gap-3 mt-4">
                  {/* Left side: LinkedIn + Resume */}
                  <div className="flex gap-3 flex-wrap">
                    {parsed?.linkedIn && (
                      <a
                        href={
                          parsed.linkedIn.startsWith("http")
                            ? parsed.linkedIn
                            : `https://${parsed.linkedIn}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200 transition"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}

                    {app.User?.Documents?.[0]?.file_url && (
                      <button
                        onClick={() => {
                          setPreviewUrl(app.User.Documents[0].file_url);
                          setPreviewOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-md hover:bg-indigo-200 transition"
                      >
                        <FileText className="w-4 h-4" />
                        Resume
                      </button>
                    )}
                  </div>

                  {/* Right side: Schedule + Reject */}
                  {app.status === "pending" && (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleOpenInterviewModal(app)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-md hover:bg-green-200 transition"
                      >
                        <UserCheck className="w-4 h-4" />
                        Schedule
                      </button>

                      <button
                        onClick={() => handleStatusChange(app.id, "rejected")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-md hover:bg-red-200 transition"
                      >
                        <UserX className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

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

        <ResumePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          pdfUrl={previewUrl}
        />
        <Modal
          isOpen={isOpen}
          onClose={hideModal}
          title={modalContent.title}
          type={modalContent.type}
        >
          <p className="text-sm">{modalContent.message}</p>
        </Modal>
      </div>
    </>
  );
};

export default ApplicantsList;
