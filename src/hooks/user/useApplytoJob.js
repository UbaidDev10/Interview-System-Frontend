// hooks/useApplyToJob.js
import { useState } from "react";
import API from "../../api/BaseService"; // adjust path as needed

const useApplyToJob = () => {
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const applyToJob = async (jobId) => {
    try {
      const response = await API.post(`/user/applications/${jobId}`);
      if (response.status === 201) {
        setAppliedJobs((prev) => new Set(prev).add(jobId));
        return { status: "applied" };
      }
    } catch (err) {
      if (err.response?.status === 400) {
        // Already applied — mark as applied
        setAppliedJobs((prev) => new Set(prev).add(jobId));
        return { status: "already-applied" };
      }
      console.error("Error applying to job:", err);
    }
    return { status: "error" };
  };

  const isApplied = (jobId) => appliedJobs.has(jobId);

  return { applyToJob, isApplied };
};

export default useApplyToJob;
