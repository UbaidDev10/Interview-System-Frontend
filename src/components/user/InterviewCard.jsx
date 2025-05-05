import { FiClock, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const InterviewCard = ({ interview }) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg transition-all hover:shadow-md">
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{interview.jobTitle}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Applied on {interview.appliedDate.toLocaleDateString()}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            interview.status === 'accepted' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {interview.status === 'accepted' ? 'Accepted' : 'Rejected'}
          </span>
        </div>
        {interview.status === 'accepted' && (
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="mr-2" />
              <span>
                Scheduled for {interview.interviewDate.toLocaleString()}
              </span>
            </div>
            <div className="mt-4">
              <Link
                to={`/interview/${interview.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Start Interview <FiChevronRight className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;