import API from "../../api/BaseService";

const useUserStatistics = () => {
  const getUserStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/user/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User statistics response:", response);
      return response?.data?.data || null; 
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  };
  return { getUserStatistics };
};

export default useUserStatistics;