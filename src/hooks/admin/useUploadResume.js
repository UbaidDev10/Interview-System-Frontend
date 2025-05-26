import API from "../../api/BaseService";

const useUploadResume = () => {
  const uploadResume = async (resumeFile, token) => {
    const formData = new FormData();
    formData.append("file", resumeFile);

    const res = await API.post("/upload/pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // 👈 Required for protected upload
      },
    });

    return res.data;
  };

  return { uploadResume };
};

export default useUploadResume;
