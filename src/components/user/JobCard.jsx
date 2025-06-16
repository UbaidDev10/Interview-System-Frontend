"use client"

import { Calendar, Briefcase } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

const JobCard = ({ job, className = "", onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border border-gray-200 flex flex-col h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3">
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {job.title}
          </CardTitle>
          
          {job.User?.username && (
            <CardDescription className="text-lg text-gray-500">
              Posted by: {job.User.username}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1 ">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.salary}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <div className="px-6 pb-4 pt-2">
        <Button
          onClick={() => onViewDetails(job)}
          size="sm"
          variant="outline"
          className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-indigo-600 group-hover:text-white transition-all"
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}

export default JobCard