import { useParams} from "react-router-dom";
import InterviewTable from "../../components/admin/InterviewTable";


const JobInterviewsPage = () => {
  const { jobId } = useParams();

  return (
      <InterviewTable jobId={jobId} />
  );
};

export default JobInterviewsPage;
