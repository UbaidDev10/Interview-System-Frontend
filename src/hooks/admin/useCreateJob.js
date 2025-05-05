import API from "../../api/BaseService"; 

const useCreateJob = () => {
  const createJob = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/admin/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return res.data;
    } catch (err) {
      console.log("Error creating job:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  return { createJob };
};

export default useCreateJob;
