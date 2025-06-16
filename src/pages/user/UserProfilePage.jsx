import React, { useState, useEffect } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import useUserProfile from "../../hooks/admin/useUserProfile";
import useUploadResume from "../../hooks/admin/useUploadResume";
import API from "../../api/BaseService";
import { FiUser, FiUpload, FiFileText, FiTrash2, FiCamera, FiMail, FiCalendar, FiDownload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Modal from "../../components/ui/Modal";
import useModal from "../../hooks/useModal";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";

const UserProfilePage = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const { uploadResume } = useUploadResume();
  const { isOpen, modalContent, showModal, hideModal } = useModal();

  const [username, setUsername] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

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

      showModal({
        title: "Success",
        message: "Profile updated successfully!",
        type: "success",
      });

      if (imageFile) {
        setPreviewImage(null);
        setImageFile(null);
      }
      if (resumeFile) {
        setResumeFile(null);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      showModal({
        title: "Error",
        message: "Failed to update profile. Please try again.",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    try {
      await API.delete("/upload/pdf");
      showModal({
        title: "Success",
        message: "Resume deleted successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error deleting resume:", err);
      showModal({
        title: "Error",
        message: "Failed to delete resume. Please try again.",
        type: "error",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (profileLoading) return null;

  return (
    <>
      <Navbar activeTab="profile" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          {/* Header - Made larger */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-lg text-gray-600">Manage your account information and preferences</p>
          </div>

          <Modal
            isOpen={isOpen}
            onClose={hideModal}
            title={modalContent.title}
            type={modalContent.type}
          >
            <p className="text-base">{modalContent.message}</p>
          </Modal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview Card - Made larger */}
            <Card className="lg:col-span-1 p-6">
              <CardHeader className="text-center space-y-2">
                <div className="relative mx-auto">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={previewImage || profile?.profile_picture} alt="Profile picture" />
                    <AvatarFallback className="text-4xl bg-gradient-to-r from-blue-100 to-indigo-100">
                      <FiUser className="w-16 h-16 text-indigo-600" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{profile?.username}</CardTitle>
                <div className="flex items-center justify-center gap-3 text-base text-gray-600">
                  <FiMail className="w-5 h-5 text-indigo-600" />
                  {profile?.email}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator className="my-4 bg-gradient-to-r from-blue-100 to-indigo-100 h-[2px]" />
                <div className="space-y-4 text-base">
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium">{formatDate(profile?.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium">{formatDate(profile?.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Profile Form - Made larger */}
            <Card className="lg:col-span-2 p-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <FiUser className="w-6 h-6 text-indigo-600" />
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Profile Picture Upload - Larger */}
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Profile Picture</Label>
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={previewImage || profile?.profile_picture} alt="Profile preview" />
                        <AvatarFallback className="bg-gradient-to-r from-blue-100 to-indigo-100">
                          <FiUser className="w-12 h-12 text-indigo-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Label htmlFor="profile-image" className="cursor-pointer">
                          <div className="flex items-center gap-3 px-6 py-3 border-2 border-dashed border-indigo-200 rounded-lg hover:border-indigo-300 transition-colors text-base bg-gradient-to-r from-blue-50 to-indigo-50">
                            <FiCamera className="w-5 h-5 text-indigo-600" />
                            <span className="text-indigo-700">Choose new photo</span>
                          </div>
                          <Input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </Label>
                        <p className="text-sm text-indigo-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 bg-gradient-to-r from-blue-100 to-indigo-100 h-[2px]" />
                  
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-lg font-medium text-indigo-800">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="text-lg h-12 px-4 border-indigo-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                  </div>

                  <Separator className="my-6 bg-gradient-to-r from-blue-100 to-indigo-100 h-[2px]" />

                  {/* Resume Section - Larger */}
                  <div className="space-y-6">
                    <Label className="text-lg font-medium text-indigo-800">Resume/CV</Label>

                    {profile?.Documents?.[0]?.file_url ? (
                      <div className="border-2 border-indigo-100 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                              <FiFileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-base text-indigo-800">{profile.Documents[0].file_name}</p>
                              <p className="text-sm text-indigo-500">PDF Document</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={() => window.open(profile.Documents[0].file_url, "_blank")}
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                            >
                              <FiDownload className="w-5 h-5 mr-2 text-indigo-600" />
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={handleDeleteResume}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 text-center hover:border-indigo-300 transition-colors bg-gradient-to-r from-blue-50 to-indigo-50">
                            <FiUpload className="w-10 h-10 mx-auto text-indigo-400 mb-3" />
                            <p className="text-lg font-medium text-indigo-700">Upload your resume</p>
                            <p className="text-sm text-indigo-500">PDF files only, max 10MB</p>
                          </div>
                          <Input
                            id="resume-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                            className="hidden"
                          />
                        </Label>
                        {resumeFile && (
                          <div className="flex items-center gap-3 text-base text-green-600">
                            <FiCheckCircle className="w-5 h-5" />
                            {resumeFile.name} selected
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button - Larger */}
                  <div className="pt-6">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-md"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;