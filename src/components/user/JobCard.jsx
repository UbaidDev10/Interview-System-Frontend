import React, { useState, useEffect } from "react";
import useApplyToJob from "../../hooks/user/useApplytoJob";

const JobCard = ({ job }) => {
  const { applyToJob, isApplied } = useApplyToJob();
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (job?.id && isApplied(job.id)) {
      setStatus("applied");
    }
  }, [job?.id, isApplied]);

  const handleApply = async () => {
    if (!job?.id) {
      console.error("Job ID is missing:", job);
      return;
    }

    const result = await applyToJob(job.id);
    if (["applied", "already-applied"].includes(result.status)) {
      setStatus("applied");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        {status === "applied" ? (
          <button
            disabled
            className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-green-100 text-green-700 cursor-not-allowed"
          >
            Applied
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition"
          >
            Apply
          </button>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-700">{job.description}</p>
      </div>

      {job.requirements && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
          <p className="mt-2 text-sm text-gray-700">{job.requirements}</p>
        </div>
      )}

      {Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Skills:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600 mt-3">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
};

export default JobCard;
