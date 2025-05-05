import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import JobCard from "../../components/user/JobCard";
const Homepage = () => {
  // Mock data
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      description: "We're looking for a skilled frontend developer with React experience.",
      requirements: "React, JavaScript, CSS, HTML",
      createdAt: new Date(),
      hasApplied: false
    },
    {
      id: 2,
      title: "UX Designer",
      description: "Join our design team to create beautiful user experiences.",
      requirements: "Figma, UI/UX, User Research",
      createdAt: new Date(),
      hasApplied: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="home" />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Jobs</h2>
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;