import API from "../../api/BaseService";

const useScheduleInterview = () => {
  const scheduleInterview = async (userId, payload) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/admin/users/${userId}/interviews`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error scheduling interview:", err.message);
      throw err;
    }
  };

  return { scheduleInterview };
};

export default useScheduleInterview;
