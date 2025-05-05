// Updated ApplicantsList.jsx with improved light mode styles

import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiMail, FiCalendar, FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi";

const ApplicantsList = ({ darkMode }) => {
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  useEffect(() => {
    const mockApplicants = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        jobTitle: "Frontend Developer",
        appliedDate: "2023-05-15",
        status: "Under Review",
        resume: "john_doe_resume.pdf",
        coverLetter: "Lorem ipsum dolor sit amet...",
        skills: ["React", "JavaScript", "CSS"]
      }
    ];
    setApplicants(mockApplicants);
  }, []);

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedApplicant(expandedApplicant === id ? null : id);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : 'bg-gray-50 border-gray-400 text-gray-900'}`}
            />
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className={`rounded-xl p-8 text-center ${darkMode ? 'dark:bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`${darkMode ? 'dark:text-gray-400' : 'text-gray-600'}`}>
              {searchTerm ? "No applicants match your search." : "No applicants found."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map(applicant => (
              <div
                key={applicant.id}
                className={`rounded-xl overflow-hidden shadow-sm border ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600' : 'bg-white border border-gray-300 shadow'}`}
              >
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => toggleExpand(applicant.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${darkMode ? 'dark:bg-gray-600' : 'bg-gray-100'}`}>
                      <FiUser className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{applicant.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{applicant.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      applicant.status === "Under Review" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      applicant.status === "Hired" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}>
                      {applicant.status}
                    </span>
                    {expandedApplicant === applicant.id ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>

                {expandedApplicant === applicant.id && (
                  <div className={`p-4 border-t ${darkMode ? 'dark:border-gray-600' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiMail className="text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiCalendar className="text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Applied on {applicant.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiFileText className="text-gray-500" />
                          <a href="#" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">Download Resume</a>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map((skill, index) => (
                            <span
                              key={index}
                              className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'dark:bg-gray-600 dark:text-gray-200' : 'bg-gray-100 text-gray-800'}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-200 transition text-sm">
                        Mark as Hired
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-200 transition text-sm">
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;
