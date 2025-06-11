import { useEffect, useState } from "react";
import API from "@/api/BaseService";

const useInterviewDetail = (interviewId) => {
  const [conversation, setConversation] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!interviewId) return;

    const fetchInterviewDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/admin/interview/detail/${interviewId}`);
        const convo = res.data.data.parsedConversation.conversation;
        const video = res.data.data.videofeed?.interview_url;

        const transcript = convo.map((entry, idx) => ({
          speaker: entry.sender === "ai" ? "Interviewer" : "Candidate",
          time: "", 
          text: entry.text,
          isConclusion: entry.isConclusion || false,
        }));

        setConversation(transcript);
        setVideoUrl(video);
      } catch (err) {
        setError("Failed to load interview details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetail();
  }, [interviewId]);

  return { conversation, videoUrl, loading, error };
};

export default useInterviewDetail;
