import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import InterviewCard from "../../components/user/InterviewCard";

const InterviewsPage = () => {
  // Mock data
  const interviews = [
    {
      id: 1,
      jobTitle: "Frontend Developer",
      appliedDate: new Date(),
      status: "accepted",
      interviewDate: new Date(Date.now() + 86400000) // Tomorrow
    },
    {
      id: 2,
      jobTitle: "UX Designer",
      appliedDate: new Date(Date.now() - 86400000),
      status: "rejected"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="interviews" />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Interviews</h2>
          <div className="space-y-6">
            {interviews.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InterviewsPage;