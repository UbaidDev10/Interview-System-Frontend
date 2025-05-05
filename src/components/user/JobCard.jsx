const JobCard = ({ job }) => {
    return (
      <div className="bg-white shadow overflow-hidden rounded-lg transition-all hover:shadow-md">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Posted on {job.createdAt.toLocaleDateString()}
              </p>
            </div>
            {job.hasApplied ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Applied
              </span>
            ) : (
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                Apply
              </button>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">{job.description}</p>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.requirements.split(',').map((req, i) => (
                <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {req.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default JobCard;