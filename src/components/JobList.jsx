import React, { useState, useEffect } from "react";
import useUpdateJobs from "../hooks/useUpdateJobs";
import useDeleteJobs from "../hooks/useDeleteJobs";
import useGetJobs from "../hooks/useGetJobs";

const JobList = () => {
  const { getJobs } = useGetJobs();
  const { updateJob } = useUpdateJobs();
  const { deleteJob } = useDeleteJobs();

  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
  });

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs);
    } catch (err) {
      console.log("Error fetching jobs:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(id);
        alert("Job deleted successfully!");
        fetchJobs();
      } catch (err) {
        console.log("Error deleting job:", err.response?.data?.message || err.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateJob(editingJobId, formData);
      alert("Job updated successfully!");
      setEditingJobId(null);
      setFormData({ title: "", description: "", requirements: "" });
      fetchJobs();
    } catch (err) {
      console.log("Error updating job:", err.response?.data?.message || err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">My Job Posts</h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No job posts found.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded-md shadow-sm">
              {editingJobId === job.id ? (
                <form onSubmit={handleUpdate} className="space-y-3">
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    placeholder="Job Title"
                    required
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    placeholder="Job Description"
                    required
                  />
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    rows={2}
                    placeholder="Job Requirements"
                    required
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingJobId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-700 mt-2"><span className="text-lg font-bold"> Description: </span>{job.description}</p>
                  <p className="text-gray-600 text-md mt-1 "><span className="text-lg font-bold"> Requirements:</span> {job.requirements}</p>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleEdit(job)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
