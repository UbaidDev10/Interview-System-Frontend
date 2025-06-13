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
    console.log('Fetching interview details for ID:', interviewId);
    const res = await API.get(`/admin/interview/detail/${interviewId}`);
    console.log('Interview details response:', res.data);
    
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
    console.error('Error fetching interview details:', err);
    setError("Failed to load interview details");
  } finally {
    setLoading(false);
  }
};

    fetchInterviewDetail();
  }, [interviewId]);

  return { conversation, videoUrl, loading, error };
};

export default useInterviewDetail;
