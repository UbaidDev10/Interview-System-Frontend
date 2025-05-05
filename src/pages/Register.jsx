import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/BaseService"
import useRegister from "../hooks/admin/useRegister"
import useUploadResume from "../hooks/admin/useUploadResume"

const Register = () => {
  const navigate = useNavigate();
  const { register } = useRegister();
  const { uploadResume } = useUploadResume(); 

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.role === "user" && !resume) {
      alert("Resume is required for user registration.");
      return;
    }
  
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role
    };
  
    try {
      const user = await register(payload);
      alert("Registered successfully!");
  
      if (form.role === "user") {
        await uploadResume(resume);
        alert("Resume uploaded!");
      }
  
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration error");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Create your Account
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {form.role === "user" && (
          <div className="w-full">
            <label
              htmlFor="resume"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Resume 
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2 text-sm text-gray-700 border border-dashed border-gray-400 bg-gray-50 rounded-md file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
            />
            {resume && (
              <p className="mt-1 text-xs text-green-600">Selected: {resume.name}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-3 w-full rounded-md hover:bg-blue-600 transition duration-200"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register