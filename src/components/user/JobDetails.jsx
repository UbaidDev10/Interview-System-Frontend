import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Briefcase,
  ChevronLeft,
  MapPin,
  DollarSign,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import useApplyToJob from "../../hooks/user/useApplytoJob";
import { useState, useEffect } from "react";
import { Separator } from "../../components/ui/separator";

const JobDetails = ({ job, onBack, onJobApplied }) => {
  const { applyToJob, isApplied } = useApplyToJob();
  const [status, setStatus] = useState("idle");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (job?.id && isApplied(job.id)) {
      setStatus("applied");
    }
  }, [job?.id, isApplied]);

  const handleApply = async () => {
    if (!job?.id) {
      console.error("Job ID is missing:", job);
      return;
    }

    setIsLoading(true);
    const result = await applyToJob(job.id);

    if (["applied", "already-applied"].includes(result.status)) {
      setStatus("applied");
      onJobApplied?.(job.id);
    } else {
      setStatus("error");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="text-blue-600 hover:text-blue-800 px-0"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to jobs
      </Button>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-0">
          <div>
            <div className="space-y-3">
              <div className="w-full flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-gray-900">
                {job.title}
              </CardTitle>

              <div className="w-16% pb-4 pt-4">
                {status === "applied" ? (
                  <Button
                    disabled
                    className=" bg-green-50 text-green-700 hover:bg-green-50 border-green-100 h-10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Applied
                  </Button>
                ) : (
                  <Button
                    onClick={handleApply}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 rounded-md via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white h-10"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2  border-white mr-2"></div>
                        Applying...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                )}

                {status === "error" && (
                  <Alert className="mt-3 border-red-200 bg-red-50 p-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-sm text-red-700">
                      Error applying. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              </div>
            </div>

            {job.User?.username && (
              <div className=" text-lg flex items-center gap-2 text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>{job.User.username}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4  text-gray-600">
              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{job.location}</span>
                </div>
              )}

              {job.salary && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>{job.salary}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent className="pt-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Job Description
            </h3>
            <CardDescription className=" text-md text-gray-700 pl-1">
              {job.description}
            </CardDescription>
          </div>

          {job.requirements && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Requirements
              </h3>
              <CardDescription className="text-gray-700 text-md whitespace-pre-line pl-1">
                {job.requirements}
              </CardDescription>
            </div>
          )}

          {job.responsibilities && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Responsibilities
              </h3>
              <CardDescription className="text-gray-700 text-md whitespace-pre-line pl-1">
                {job.responsibilities}
              </CardDescription>
            </div>
          )}

          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetails;