import { useState, useCallback } from "react";
import API from "@/api/BaseService";

const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/saved-jobs");
      const jobList = res.data?.data?.savedJobs || [];
      setSavedJobs(jobList);
    } catch (err) {
      console.error("Error fetching saved jobs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJob = async (jobId) => {
    try {
      console.log("📤 Saving job:", jobId);
      await API.post(`/jobs/${jobId}/save`);
      fetchSavedJobs();
    } catch (err) {
      console.error("Error saving job", err);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      console.log("🗑️ Unsaving job:", jobId);
      await API.delete(`/jobs/${jobId}/save`);
      fetchSavedJobs();
    } catch (err) {
      console.error("Error unsaving job", err);
    }
  };

  return {
    savedJobs,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    loading,
  };
};

export default useSavedJobs;
