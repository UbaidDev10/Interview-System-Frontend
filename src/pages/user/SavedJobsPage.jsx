import React, { useEffect, useState } from "react";
import Header from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import JobCard from "@/components/user/JobCard";
import JobDetails from "@/components/user/JobDetails";
import useSavedJobs from "@/hooks/user/useSavedJobs";
import useApplyToJob from "@/hooks/user/useApplytoJob";

const SavedJobsPage = () => {
  const { savedJobs, fetchSavedJobs, loading, unsaveJob } = useSavedJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { isApplied } = useApplyToJob();
  const [appliedJobId, setAppliedJobId] = useState(null);
  const [removedJobIds, setRemovedJobIds] = useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // Mark job as applied, but don't remove yet
  const handleJobApplied = (jobId) => {
    setAppliedJobId(jobId);
  };

  // When going back, remove the applied job from the grid
  const handleBackToJobs = async () => {
    setShowDetails(false);
    setSelectedJob(null);
    if (appliedJobId) {
      await fetchSavedJobs();
      setAppliedJobId(null);
    }
  };

  // Optimistically remove job from grid after unsave
  const handleUnsave = async (jobId) => {
    setRemovedJobIds((prev) => [...prev, jobId]);
    await unsaveJob(jobId);
    // Optionally, you can also refetch here for consistency:
    // await fetchSavedJobs();
  };

  // Always filter out the applied job id and removed job ids from the grid
  const filteredSavedJobs = savedJobs.filter(
    item =>
      item.Job &&
      !isApplied(item.Job.id) &&
      item.Job.id !== appliedJobId &&
      !removedJobIds.includes(item.Job.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header activeTab="saved" />

      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Saved Jobs</h1>

        {loading ? (
          <p>Loading saved jobs...</p>
        ) : savedJobs.length === 0 ? (
          <p className="text-gray-600">You haven't saved any jobs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!showDetails ? (
              filteredSavedJobs.map((item) => (
                <JobCard
                  key={item.Job.id}
                  job={item.Job}
                  isSaved={true}
                  onUnsave={handleUnsave}
                  onViewDetails={() => {
                    setSelectedJob(item.Job);
                    setShowDetails(true);
                  }}
                />
              ))
            ) : (
              <div className="col-span-full">
                <JobDetails
                  job={selectedJob}
                  onBack={handleBackToJobs}
                  onJobApplied={handleJobApplied}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SavedJobsPage;
