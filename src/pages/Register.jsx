import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useRegister from "../hooks/admin/useRegister";
import useUploadResume from "../hooks/admin/useUploadResume";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useRegister();
  const { uploadResume } = useUploadResume();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resume, setResume] = useState(null);
  const [backendError, setBackendError] = useState("");
  

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().required("Select a role"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setBackendError("");
    if (values.role === "user" && !resume) {
      setBackendError("Resume is required for user registration.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      await register(payload);
      const token = localStorage.getItem("token");

      if (values.role === "user") {
        await uploadResume(resume, token);
        alert("Resume uploaded!");
      }

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      const message = err.response?.data?.message;
      setBackendError(message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create your Account</h2>

        {backendError && (
          <div className="bg-red-100 text-red-700 p-3 text-sm rounded mb-4">{backendError}</div>
        )}

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="space-y-5" encType="multipart/form-data">
              {/* Username */}
              <div>
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Field
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute top-3 right-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </span>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Role */}
              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Resume upload for users only */}
              {values.role === "user" && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Upload Resume</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="w-full border p-2 text-sm rounded file:bg-blue-500 file:text-white"
                  />
                  {resume && <p className="text-xs text-green-600 mt-1">Selected: {resume.name}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:cursor-pointer hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
