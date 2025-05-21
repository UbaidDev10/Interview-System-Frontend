import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useLogin from "../hooks/admin/useLogin";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const { login } = useLogin();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("");
    try {
      const user = await login(values);
      alert("Login successful!");
      if (user.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed.";
      setLoginError(
        message.toLowerCase().includes("email") || message.toLowerCase().includes("user")
          ? "Email is incorrect"
          : message.toLowerCase().includes("password")
          ? "Password is incorrect"
          : "Invalid credentials"
      );
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {loginError && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded">{loginError}</div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email Field */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2.5 right-3 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>

         <p className="text-center text-sm text-gray-600 mt-6">
          Don't have a account?{" "}
          <a href="/register" className="text-blue-500 hover:cursor-pointer hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
