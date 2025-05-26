import React, { useState, useEffect } from "react";
import useUpdateJobs from "../../hooks/admin/useUpdateJobs";
import useDeleteJobs from "../../hooks/admin/useDeleteJobs";
import useGetJobs from "../../hooks/admin/useGetJobs";
import useCreateJob from "../../hooks/admin/useCreateJob";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiVideo } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  });

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
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(id);
      fetchJobs();
    }
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
    <div className={darkMode ? "dark" : ""}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition shadow-sm w-full sm:w-auto justify-center"
          >
            <FiPlus /> Create Job
          </motion.button>
        </div>

        {filteredJobs.length === 0 ? (
          <div
            className={`rounded-xl p-8 text-center ${
              darkMode ? "dark:bg-gray-700" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "No jobs match your search."
                : "No job posts found."}
            </p>
          </div>
        ) : (
          <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -5 }}
                className={`rounded-xl overflow-hidden shadow-sm border ${
                  darkMode
                    ? "dark:bg-gray-700 dark:border-gray-600"
                    : "bg-white border-gray-200"
                } transition-all duration-200`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold dark:text-white">
                      {job.title}
                    </h3>
                  </div>

                  <p
                    className={`text-sm mb-4 ${
                      darkMode ? "dark:text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {job.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2 dark:text-gray-300">
                      Requirements:
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {job.requirements}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2 dark:text-white font-bold">
                      Skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(job.skills) &&
                        job.skills.map((skill, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-1 rounded-full ${
                              darkMode
                                ? "dark:bg-purple-700 dark:text-purple-100"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => handleEdit(job)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 dark:text-purple-300 transition text-sm"
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(job.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300 transition text-sm"
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>

                    <button
                      onClick={() => handleViewInterviews(job.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-900 dark:text-blue-300 transition text-sm"
                    >
                      <FiVideo size={14} /> Interviews
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal remains unchanged */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            className={`w-full max-w-2xl rounded-xl p-6 ${
              darkMode ? "dark:bg-gray-800" : "bg-white"
            } shadow-2xl`}
          >
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold dark:text-white">
                {editingJobId ? "Edit Job" : "Create Job"}
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiX className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Description:
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <label className="block text-sm font-medium mb-1 dark:text-white font-bold">
                Requirements:
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Skills Required:
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  {editingJobId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default JobList;
