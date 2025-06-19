import { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";
import InterviewCard from "../../components/user/InterviewCard";
import useInterviews from "../../hooks/user/useInterviews";
import { Card, CardContent } from "../../components/ui/card";
import { CalendarClock } from "lucide-react";

const InterviewsPage = () => {
  const { getInterviews } = useInterviews();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const raw = await getInterviews();

        // Sort by interview date directly on raw data
        const sorted = raw.sort((a, b) => {
          const dateA = new Date(
            `${a.interview_date.split("T")[0]}T${a.start_time}`
          );
          const dateB = new Date(
            `${b.interview_date.split("T")[0]}T${b.start_time}`
          );
          return dateB - dateA;
        });

        setInterviews(sorted);
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
            <Card className="col-span-full text-center py-12">
              <CardContent>
                <CalendarClock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Interviews Found
                </h3>
                <p className="text-gray-600 mb-4">
                  You currently have no interviews scheduled. Check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
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
