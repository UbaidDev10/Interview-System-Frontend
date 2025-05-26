import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import useUserProfile from "../../hooks/admin/useUserProfile";
import useUploadResume from "../../hooks/admin/useUploadResume";
import API from "../../api/BaseService";
import { FiUser } from "react-icons/fi";

const UserProfilePage = () => {
  const { profile, loading } = useUserProfile();
  const { uploadResume } = useUploadResume();

  const [username, setUsername] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (imageFile) formData.append("profile", imageFile);

      await API.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (resumeFile) {
        await uploadResume(resumeFile);
      }

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  const handleDeleteResume = async () => {
    try {
      await API.delete("/upload/pdf");
      alert("Resume deleted");
    } catch (err) {
      console.error("Error deleting resume:", err);
      alert("Failed to delete resume");
    }
  };

  if (loading) return null;

  return (
    <>
      <Navbar activeTab="profile" />
      <div className="max-w-md mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md space-y-6 text-center border"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Profile
          </h2>

          {/* Profile Icon or Image */}
          <div className="flex justify-center">
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="h-10 w-10 text-gray-500" />
              </div>
            )}
          </div>

          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="block text-sm file:mr-4 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded-md file:bg-white file:text-sm file:font-semibold file:text-gray-700"
            />
          </div>

          {/* Username Input */}
          <div className="text-left">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Resume Display/Upload */}
          <div className="text-left">
            {profile?.Documents?.[0]?.file_url ? (
              <div className="flex justify-between items-center">
                <a
                  href={profile.Documents[0].file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                >
                  View CV
                </a>
                <button
                  type="button"
                  onClick={handleDeleteResume}
                  className="text-red-600 text-sm underline hover:text-red-800"
                >
                  Delete Resume
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="block text-sm text-gray-700"
              />
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;
