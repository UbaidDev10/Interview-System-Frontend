import { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import InterviewCard from "../../components/user/InterviewCard";
import useInterviews from "../../hooks/user/useInterviews";

const InterviewsPage = () => {
  const { getInterviews } = useInterviews();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const raw = await getInterviews();

        const formatted = raw.map((item) => ({
          id: item.id,
          interviewDate: new Date(
            `${item.interview_date.split("T")[0]}T${item.start_time}`
          ),
          status: "accepted", // all are scheduled
          title: item.Application?.Job?.title || "Untitled",
          description:
            item.Application?.Job?.description || "No description available",
        }));

        setInterviews(formatted);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      }
    };

    loadInterviews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="interviews" />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Interviews
          </h2>

          {interviews.length === 0 ? (
            <div className="text-center text-red-600 text-lg py-10">
              No interviews scheduled yet. Please check again later.
            </div>
          ) : (
            <div className="space-y-6">
              {interviews.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InterviewsPage;
