import { useEffect, useState } from "react";
import API from "@/api/BaseService";

const useJobInterviews = (jobId) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!jobId) return;

    const fetchInterviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(`/admin/jobs/${jobId}/interviews`);
        const rawData = response.data.data.interviews;

        const mapped = rawData.map((item) => {
          const start = new Date(`1970-01-01T${item.start_time}Z`);
          const end = new Date(`1970-01-01T${item.end_time}Z`);
          const durationMins = (end - start) / (1000 * 60);

          return {
            id: item.id,
            candidateName: item.User?.username || "Unknown",
            candidateEmail: item.User?.email || "N/A",
            date: item.interview_date,
            time: item.start_time.slice(0, 5),
            duration: `${durationMins} minutes`,
            status: "Scheduled", 
            avatar: null,
          };
        });

        setInterviews(mapped);
      } catch (err) {
        setError("Failed to fetch interviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [jobId]);

  return { interviews, loading, error };
};

export default useJobInterviews;
