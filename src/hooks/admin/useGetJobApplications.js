import API from "../../api/BaseService";

const useGetJobApplications = () => {
  const getJobApplications = async (jobId) => {
    const response = await API.get(`/admin/jobs/${jobId}/applications`);
    console.log("response", response);
    return response.data.data.applications; 
  };

  return { getJobApplications };
};

export default useGetJobApplications;
