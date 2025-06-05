import API from "../../api/BaseService";

const useUpdateApplicationStatus = () => {
  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.patch(
        `/admin/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.data) {
        throw new Error("No response data received");
      }
      
      return response;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  };

  return { updateStatus };
};

export default useUpdateApplicationStatus;
