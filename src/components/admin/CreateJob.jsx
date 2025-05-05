import React from 'react'
import { useState } from "react"
import useCreateJob from '../../hooks/admin/useCreateJob';

const CreateJob = () => {
    const { createJob } = useCreateJob();
    const [form, setForm] = useState({
      title: "",
      description: "",
      requirements: "",
    });
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createJob(form);
        alert("Job created successfully!");
        setForm({ title: "", description: "", requirements: "" });
      } catch (err) {
        console.log(err.message);
      }
    };
  
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Job Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="Job Requirements"
            rows={4}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    );
}

export default CreateJob