import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  Users,
  Briefcase,
  ClipboardList,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import JobCard from "../../components/user/JobCard";
import JobDetails from "../../components/user/JobDetails";
import useFetchJobs from "../../hooks/user/useFetchJobs";
import useUserStatistics from "@/hooks/user/useUserStatistics";
import useSavedJobs from "@/hooks/user/useSavedJobs";

const Homepage = () => {
  const { jobs, loading, currentPage, totalPages, totalJobs, fetchJobs } =
    useFetchJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userStats, setUserStats] = useState({
    total_applications: 0,
    scheduled_interviews: 0,
    available_jobs: 0,
  });
  const { getUserStatistics } = useUserStatistics();
  const [jobsList, setJobsList] = useState([]);
  const { saveJob, unsaveJob, savedJobs, fetchSavedJobs } = useSavedJobs();

  useEffect(() => {
    if (jobs.length) {
      setJobsList(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const removeJobFromList = (jobId) => {
    setJobsList((prev) => prev.filter((job) => job.id !== jobId));
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await getUserStatistics();
        if (stats) {
          setUserStats({
            total_applications: stats.total_applications,
            scheduled_interviews: stats.scheduled_interviews,
            available_jobs: stats.available_jobs,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
      }
    };

    fetchUserStats();
  }, []);

  const filteredJobs = useMemo(() => {
    const filtered = jobsList.filter((job) => {
      const search = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.requirements.toLowerCase().includes(search) ||
        (Array.isArray(job.skills) &&
          job.skills.join(" ").toLowerCase().includes(search))
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [jobsList, searchTerm, sortOrder]);

  const savedJobIds = useMemo(() => savedJobs.map(item => item.Job.id), [savedJobs]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Don't reset page when searching - maintain current page
    fetchJobs(currentPage, value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchJobs(1); // Reset to page 1 when clearing search
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsAnimating(true);
    setShowDetails(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleBackToList = () => {
    setIsAnimating(true);
    setShowDetails(false);
    setTimeout(() => {
      setSelectedJob(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <Header activeTab="home" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing opportunities from top companies. Your next
              career move starts here.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Briefcase className="h-8 w-8 mx-auto mb-2 text-blue-200" />
                  <div className="text-2xl font-bold text-white">
                    {userStats.available_jobs}
                  </div>
                  <div className="text-blue-200">Total Jobs</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-purple-200" />
                  <div className="text-2xl font-bold text-white">
                    {userStats.total_applications}
                  </div>
                  <div className="text-purple-200">Applications</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <CalendarCheck className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                  <div className="text-2xl font-bold text-white">
                    {userStats.scheduled_interviews}
                  </div>
                  <div className="text-indigo-200">Interviews</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full relative overflow-x-hidden">
        {/* Search and Filter Section */}
        {!showDetails && (
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Jobs
              </CardTitle>
              <CardDescription>
                Find the perfect job that matches your skills and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by title, description, skills..."
                    className="pl-11 h-14 text-base w-full rounded-md border border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-48 h-14 border border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {searchTerm && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Showing {filteredJobs.length} of {totalJobs} jobs
                  </span>
                  {filteredJobs.length !== totalJobs && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="h-6 px-2 text-xs"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        <div className="relative">
          {/* Job List Section */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              !showDetails
                ? "translate-x-0"
                : isAnimating
                ? "-translate-x-full"
                : "-translate-x-full absolute"
            }`}
            style={{ width: "100%" }}
          >
            {!showDetails && (
              <>
                {/* Results Header with Pagination on top right */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {searchTerm ? "Search Results" : "Available Jobs"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {loading
                        ? "Loading..."
                        : `Showing ${filteredJobs.length} job${
                            filteredJobs.length !== 1 ? "s" : ""
                          } (Page ${currentPage} of ${totalPages})`}
                    </p>
                  </div>

                  {/* Pagination Controls - Moved to top right */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1 || loading}
                        onClick={() => fetchJobs(currentPage - 1, searchTerm)}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages || loading}
                        onClick={() => fetchJobs(currentPage + 1, searchTerm)}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Job Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                          Loading amazing opportunities...
                        </p>
                      </div>
                    </div>
                  ) : filteredJobs.length === 0 ? (
                    <Card className="col-span-full text-center py-12">
                      <CardContent>
                        <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {searchTerm
                            ? "No jobs match your search"
                            : "No jobs available"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {searchTerm
                            ? "Try adjusting your search terms or filters"
                            : "Check back later for new opportunities"}
                        </p>
                        {searchTerm && (
                          <Button onClick={handleClearSearch} variant="outline">
                            Clear search
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        className="h-full flex flex-col"
                        onViewDetails={handleViewDetails}
                        onSave={saveJob}
                        onUnsave={unsaveJob}
                        isSaved={savedJobIds.includes(job.id)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Job Details Section */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              showDetails
                ? "translate-x-0"
                : isAnimating
                ? "translate-x-full"
                : "translate-x-full absolute"
            }`}
            style={{ width: "100%" }}
          >
            {selectedJob && (
              <JobDetails
                job={selectedJob}
                onBack={handleBackToList}
                onJobApplied={removeJobFromList}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
