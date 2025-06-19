import {
  FiClock,
  FiChevronRight,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const InterviewCard = ({ interview }) => {
  const interviewDate = new Date(
    interview.interviewDate || interview.interview_date
  );
  const now = new Date();
  const user = JSON.parse(localStorage.getItem("user"));
  const UserId = user?.userId;
  const hasExpired = now > interviewDate;

  // Format date and time nicely
  const formattedDate = interviewDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(+hour, +minute);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const startTimeFormatted = formatTime(interview.start_time);
  const endTimeFormatted = formatTime(interview.end_time);

  const calculateDuration = () => {
    if (interview.start_time && interview.end_time) {
      const [startHours, startMinutes] = interview.start_time
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = interview.end_time.split(":").map(Number);
      const durationMinutes =
        endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
      return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
    }
    return "1h";
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col group">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start gap-3 mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
              {interview.title ||
                interview.Application?.Job?.title ||
                "Interview"}
            </h3>
            <p className="text-sm text-gray-500">Interview #{interview.id}</p>
          </div>
          <Badge
            variant={hasExpired ? "secondary" : "default"}
            className={`rounded-full px-4 py-1 text-sm min-w-[90px] text-center ${
              hasExpired
                ? "bg-gray-100 text-gray-800"
                : "bg-green-200 text-green-700"
            }`}
          >
            {hasExpired ? "Pass" : "Upcoming"}
          </Badge>
        </div>

        {/* Date and Time Info */}
        <div className="bg-gray-50/50 rounded-lg p-4 space-y-3 mb-5 border border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <FiCalendar className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Interview Date</p>
              <span className="font-medium">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <FiClock className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Time</p>
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {startTimeFormatted} - {endTimeFormatted}
                </span>

                <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {calculateDuration()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2 mb-5">
          <h4 className="font-medium text-gray-900 flex items-center gap-3 text-sm">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <FiBriefcase className="h-4 w-4 text-indigo-600" />
            </div>
            <span>Job Description</span>
          </h4>
          <p className="text-sm text-gray-600 line-clamp-3 pl-11">
            {interview.description ||
              interview.Application?.Job?.requirements ||
              "No description available"}
          </p>
        </div>

        {/* Skills - Only show if available */}
        {interview.skills || interview.Application?.Job?.skills ? (
          <div className="space-y-2 mb-5">
            <h4 className="font-medium text-gray-900 text-sm pl-11">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2 pl-11">
              {(interview.skills || interview.Application?.Job?.skills || [])
                .slice(0, 3)
                .map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs rounded-full px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border-gray-200"
                  >
                    {skill}
                  </Badge>
                ))}
              {(interview.skills || interview.Application?.Job?.skills || [])
                .length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs rounded-full px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700"
                >
                  +
                  {(
                    interview.skills ||
                    interview.Application?.Job?.skills ||
                    []
                  ).length - 3}{" "}
                  more
                </Badge>
              )}
            </div>
          </div>
        ) : null}

        {interview.requirements || interview.Application?.Job?.requirements ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm pl-11">
              Requirements
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2 pl-11">
              {interview.requirements ||
                interview.Application?.Job?.requirements}
            </p>
          </div>
        ) : null}
      </div>

      <div className="px-6 pb-5 pt-0">
        {hasExpired ? (
          <div className="text-center text-gray-500 text-sm font-medium py-3 border-t border-gray-100">
            This interview has been completed
          </div>
        ) : (
          <Link
            to={`/interview/${UserId}/${interview.id}`}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all group-hover:shadow-md"
          >
            Start Interview
            <FiChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
