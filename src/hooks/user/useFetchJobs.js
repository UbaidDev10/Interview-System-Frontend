import { useState, useEffect } from "react";
import API from "../../api/BaseService";

const useFetchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/admin/jobs");
        const fetchedJobs = res?.data?.data?.jobs || [];
        console.log("Fetched jobs:", fetchedJobs);

        // For now, skip apply status tracking
        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return { jobs, loading };
};

export default useFetchJobs;
