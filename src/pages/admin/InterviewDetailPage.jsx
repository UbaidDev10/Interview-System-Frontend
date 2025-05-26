import { useParams} from "react-router-dom";
import InterviewDetailCard from "../../components/admin/InterviewDetailCard";


const InterviewDetailPage = () => {
  const { jobId, interviewId } = useParams();

  return (
      <InterviewDetailCard jobId={jobId} interviewId={interviewId} />

  );
};

export default InterviewDetailPage;
