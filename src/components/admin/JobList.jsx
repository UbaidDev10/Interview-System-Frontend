"use client";

import React, { useState, useEffect } from "react";
import useUpdateJobs from "../../hooks/admin/useUpdateJobs";
import useDeleteJobs from "../../hooks/admin/useDeleteJobs";
import useGetJobs from "../../hooks/admin/useGetJobs";
import useCreateJob from "../../hooks/admin/useCreateJob";
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Video,
  Briefcase,
  Building,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import Drawer from "../ui/Drawer";

const JobList = ({ darkMode }) => {
  const { getJobs } = useGetJobs();
  const { updateJob } = useUpdateJobs();
  const { deleteJob } = useDeleteJobs();
  const { createJob } = useCreateJob();

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    responsibilities: "",
    location: "",
    salary: "",
    working_hours: "",
    job_type: "",
    employment_type: "",
  });

  const [deleteJobId, setDeleteJobId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState({});

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      const jobsData = response?.data?.jobs || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(job.skills) &&
          job.skills.join(" ").toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const openModal = () => {
    setEditingJobId(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      skills: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      skills: job.skills.join(", "),
      responsibilities: job.responsibilities || "",
      working_hours: job.working_hours || "",
      job_type: job.job_type || "",
      employment_type: job.employment_type || "",
      location: job.location || "",
      salary: job.salary || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteJobId(id);
    setConfirmDeleteOpen(true);
  };

  const handleViewInterviews = (jobId) => {
    navigate(`/admin/interviews/${jobId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedJob = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      if (editingJobId) {
        await updateJob(editingJobId, formattedJob);
      } else {
        await createJob(formattedJob);
      }

      fetchJobs();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            Job Postings
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your job listings and track applications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Create Job Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </motion.button>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? "No jobs match your search" : "No job postings yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Create your first job posting to get started"}
          </p>
          {!searchTerm && (
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all"
            >
              <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start flex-wrap">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewInterviews(job.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 text-sm"
                  >
                    <Video className="h-4 w-4" />
                    Interviews
                  </button>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Job Description
                  </h4>
                  <p className="text-sm text-gray-700">{job.description}</p>
                </div>

                {/* Responsibilities */}
                {job.responsibilities && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Responsibilities
                    </h4>
                    <p className="text-sm text-gray-700">
                      {job.responsibilities}
                    </p>
                  </div>
                )}

                {/* Requirements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Requirements
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {job.requirements.split(",").map((req, idx) => (
                      <li key={idx}>{req.trim()}</li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Skills Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(expandedSkills[job.id]
                      ? job.skills
                      : job.skills.slice(0, 6)
                    ).map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 6 && (
                      <button
                        onClick={() =>
                          setExpandedSkills((prev) => ({
                            ...prev,
                            [job.id]: !prev[job.id],
                          }))
                        }
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        {expandedSkills[job.id]
                          ? "Show less"
                          : `+${job.skills.length - 6} more`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Job Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700 pt-2 border-t border-gray-100 mt-4">
                  <p>
                    <strong>Working Hours:</strong> {job.working_hours || "N/A"}
                  </p>
                  <p>
                    <strong>Job Type:</strong> {job.job_type || "N/A"}
                  </p>
                  <p>
                    <strong>Employment Type:</strong>{" "}
                    {job.employment_type || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {job.location || "N/A"}
                  </p>
                  <p>
                    <strong>Salary:</strong> {job.salary || "N/A"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(job)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-sm"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Drawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingJobId ? "Edit Job Posting" : "Create New Job"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Job Title"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Job Description"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Requirements"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleInputChange}
            placeholder="Responsibilities"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Skills (comma separated)"
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="working_hours"
            value={formData.working_hours}
            onChange={handleInputChange}
            placeholder="Working Hours"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Job Type</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
          </select>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="Salary"
            required
            className="w-full px-4 py-2 border rounded"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingJobId ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </Drawer>

      <Modal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Confirm Deletion"
      >
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this job post? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setConfirmDeleteOpen(false)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                await deleteJob(deleteJobId);
                setConfirmDeleteOpen(false);
                fetchJobs();
              } catch (err) {
                console.error("Failed to delete job", err);
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default JobList;
