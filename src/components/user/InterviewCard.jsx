import { FiClock, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const InterviewCard = ({ interview }) => {
  const interviewDate = new Date(interview.interviewDate);
  const now = new Date();

  const hasExpired = now > interviewDate;  

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg transition-all hover:shadow-md">
      <div className="px-6 py-4">
        <div className="text-sm text-black">
          <h3 className="text-lg font-bold text-gray-800">{interview.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{interview.description}</p>
        </div>
   

        {interview.status === "accepted" && (
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <FiClock className="mr-2 text-gray-500" />
              <span>
                Interview scheduled at{" "}
                <strong>
                  {interviewDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>{" "}
                on <strong>{interviewDate.toLocaleDateString()}</strong>
              </span>
            </div>

            {hasExpired ? (
              <p className="text-red-600 font-semibold mt-2">
                Time expired. Interview not available.
              </p>
            ) : (
              <Link
                to={`/interview/${interview.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Start Interview <FiChevronRight className="ml-2" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
