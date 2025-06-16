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
                className="border rounded-lg p-6 bg-white dark:bg-gray-900 shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {app.User?.username}
                    </h3>
                    <p className="text-sm text-gray-500">{app.User?.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                {parsed && (
                  <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {parsed.skills?.length > 0 && (
                      <div>
                        <span className="font-medium">Skills:</span>{" "}
                        {parsed.skills.slice(0, 10).join(", ")}
                      </div>
                    )}
                    {parsed.experience?.length > 0 && (
                      <div>
                        <span className="font-medium">Experience:</span>{" "}
                        {parsed.experience[0].jobTitle} at{" "}
                        {parsed.experience[0].companyName}
                      </div>
                    )}

                    {parsed.education?.length > 0 && (
                      <div>
                        <span className="font-medium">Education:</span>{" "}
                        {parsed.education[0].degree} -{" "}
                        {parsed.education[0].university}
                      </div>
                    )}
                    {parsed.projects?.length > 0 &&
                      parsed.projects[0].techStack?.length > 0 && (
                        <div className="mt-2">
                          <span className="font-semibold">Tech Stack:</span>
                          <ul className="flex flex-wrap gap-2 mt-1">
                            {parsed.projects[0].techStack.map((tech, index) => (
                              <li
                                key={index}
                                className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {parsed.linkedIn && (
                      <div>
                        <a
                          href={parsed.linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600  hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                )}

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

                {app.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleOpenInterviewModal(app)}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      <UserCheck className="h-4 w-4 mr-2" /> Schedule
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, "rejected")}
                      className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      <UserX className="h-4 w-4 mr-2" /> Reject
                    </button>
                  </div>
                )}
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
