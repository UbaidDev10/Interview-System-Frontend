import API from "../../api/BaseService";

const useUpdateApplicationStatus = () => {
  const updateStatus = async (applicationId, status) => {
    const response = await API.patch(`/admin/applications/${applicationId}/status`, { status });
    return response.data;
  };

  return { updateStatus };
};

export default useUpdateApplicationStatus;
