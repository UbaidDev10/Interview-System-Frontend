import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useRegister from "../hooks/admin/useRegister";
import useUploadResume from "../hooks/admin/useUploadResume";
import { FiEye, FiEyeOff, FiUserPlus, FiUpload } from "react-icons/fi";
import Modal from "../components/ui/Modal";
import useModal from "../hooks/useModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserEdit } from "react-icons/fa";

const Register = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { register } = useRegister();
  const { uploadResume } = useUploadResume();
  const { isOpen, modalContent, showModal, hideModal } = useModal();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resume, setResume] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

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
        showModal({
          title: 'Success',
          message: 'Resume uploaded!',
          type: 'success'
        });
      }

      showModal({
        title: 'Success',
        message: 'Registered successfully!',
        type: 'success'
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      const message = err.response?.data?.message;
      setBackendError(message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AnimatePresence>
          {!isAnimating && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full shadow-lg mb-4">
                  <FaUserEdit className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                <p className="text-gray-500 mt-2">Join us today</p>
              </div>

              {backendError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-700 p-3 text-sm rounded-lg mb-4 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {backendError}
                </motion.div>
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
                  <Form className="space-y-5">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        placeholder="john_doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        Must contain at least one uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <div className="relative">
                        <Field
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                        >
                          {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <Field
                        as="select"
                        id="role"
                        name="role"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
                      >
                        <option value="">Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </Field>
                      <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {values.role === "user" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4">
                          <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF/DOC)</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                  htmlFor="resume"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    className="sr-only"
                                  />
                                </label>
                              </div>
                              <div className="flex items-center justify-center text-xs text-gray-500">
                                <FiUpload className="mr-1" size={14} />
                                {resume ? resume.name : "or drag and drop"}
                              </div>
                              {resume && (
                                <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-xs text-green-600 mt-1"
                                >
                                  File selected
                                </motion.p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center shadow-md mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="mr-2" size={18} />
                          Register
                        </>
                      )}
                    </motion.button>
                  </Form>
                )}
              </Formik>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
              >
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-center"
                >
                  Sign in instead
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default Register;