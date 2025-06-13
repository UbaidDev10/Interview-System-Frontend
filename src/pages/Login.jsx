import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useLogin from "../hooks/admin/useLogin";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import Modal from "../components/ui/Modal";
import useModal from "../hooks/useModal";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const Login = ({ onSwitchToRegister }) => {
  const { login } = useLogin();
  const navigate = useNavigate();
  const { isOpen, modalContent, showModal, hideModal } = useModal();
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
      showModal({
        title: 'Success',
        message: 'Login successful!',
        type: 'success'
      });
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

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/register");
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AnimatePresence>
          {!isAnimating && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6 border border-gray-100"
            >
              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg mb-4">
                  <FaUserCircle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Sign in to your account</p>
              </div>

              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 text-red-700 text-sm p-3 rounded-lg flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {loginError}
                </motion.div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-sm text-red-500 mt-1"
                      />
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
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-sm text-red-500 mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <FiLogIn className="mr-2" size={18} />
                          Sign In
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
                  <span className="px-2 bg-white text-gray-500">New to our platform?</span>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
              >
                <button
                  onClick={handleRegisterClick}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
                >
                  Create an account
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

export default Login;