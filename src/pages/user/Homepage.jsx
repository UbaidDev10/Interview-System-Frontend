import React, { useState, useMemo } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import JobCard from "../../components/user/JobCard";
import useFetchJobs from "../../hooks/user/useFetchJobs";


const Homepage = () => {
  const { jobs, loading } = useFetchJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); 
  

 
  
  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const search = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.requirements.toLowerCase().includes(search) ||
        (Array.isArray(job.skills) && job.skills.join(" ").toLowerCase().includes(search))
      );
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [jobs, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="home" />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Jobs</h2>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Search Bar */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, skill..."
              className="w-full sm:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:outline-none"
            />

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:ring-purple-500 focus:outline-none"
            >
              <option value="newest">Sort: Newest to Oldest</option>
              <option value="oldest">Sort: Oldest to Newest</option>
            </select>
          </div>

          {/* Job List */}
          <div className="space-y-6">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : filteredJobs.length === 0 ? (
              <p className="text-center">No New Job Found. Please check again later</p>
            ) : (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>

         
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
