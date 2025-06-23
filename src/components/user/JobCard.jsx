import { Bookmark, Briefcase, Clock, MapPin } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { motion } from "framer-motion"

const JobCard = ({ job, className = "", onViewDetails, onSave, onUnsave, isSaved }) => {
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const getCompanyInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "C"
  }

  const handleSave = (e) => {
    e.stopPropagation();
    if (isSaved) {
      onUnsave?.(job.id);
    } else {
      onSave?.(job.id);
    }
  };

  const getJobTypeBadges = () => {
    const badges = []
    if (job.employment_type) {
      badges.push({
        text: job.employment_type.charAt(0).toUpperCase() + job.employment_type.slice(1),
        icon: <Briefcase className="h-3 w-3" />
      })
    }
    if (job.job_type) {
      badges.push({
        text: job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1),
        icon: <Clock className="h-3 w-3" />
      })
    }
    return badges
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 ${className}`}>
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
            
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getCompanyInitial(job.User?.username)}
              </div>
              <div className="mb-1">
                <h3 className="font-medium text-gray-900 text-base">{job.User?.username || "Company"}</h3>
                <p className="text-gray-500 text-xs">{formatDate(job.createdAt)}</p>
              </div>
            </div>

            {/* Save Button - Updated to match design */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`h-8 w-8 p-0 rounded-md ${
                isSaved 
                  ? "bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 text-indigo-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-3">
          {/* Job Title */}
          <h2 className="text-xl font-semibold text-gray-900 leading-tight">{job.title}</h2>

          {/* Job Type Badges */}
          <div className="flex flex-wrap gap-2 ">
            {getJobTypeBadges().map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal px-2.5 py-1 rounded-full text-xs transition-colors"
              >
                {badge.icon}
                {badge.text}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 my-1 mt-12"></div>

          {/* Salary and Location */}
          <div className="pt-1 pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {job.salary && (
                  <p className="text-lg font-medium text-gray-900">
                    {job.salary.includes("/hr") ? job.salary : `${job.salary}`}
                  </p>
                )}
                {job.location && (
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <span>{job.location}</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  onClick={() => onViewDetails(job)}
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap"
                >
                  View Details
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default JobCard