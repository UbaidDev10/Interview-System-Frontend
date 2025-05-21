import API from "../../api/BaseService";

const useInterviews = () => {
  const getInterviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/user/interviews/my-interviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Interviews response:", response);
      return response?.data?.data || []; 
    } catch (error) {
      console.error("Error fetching interviews:", error);
      throw error;
    }
  };
  return { getInterviews };
};

export default useInterviews;
