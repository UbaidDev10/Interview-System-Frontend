import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Calendar, Clock, Download, Volume2, VolumeX, Pause, Play, User, FileText, ArrowLeft, Video, ChevronDown } from 'lucide-react';

const InterviewDetailPage = ({ jobId, interviewId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const interview = {
    candidateName: "Sarah Johnson",
    candidateEmail: "sarah.j@example.com",
    position: "Senior Frontend Developer",
    date: "2023-06-15",
    time: "10:00 AM",
    duration: "45 minutes",
    initials: "SJ",
    videoUrl: "https://example.com/video.mp4",
    jobTitle: "Senior Frontend Developer",
    transcript: [
      {
        speaker: "Interviewer",
        time: "00:00:15",
        text: "Thank you for joining us today. Could you start by introducing yourself?",
      },
      {
        speaker: "Sarah Johnson",
        time: "00:00:30",
        text: "Sure, I'm Sarah, working as a frontend dev for 5 years...",
      },
      {
        speaker: "Interviewer",
        time: "00:01:15",
        text: "Can you tell us about your experience with React and modern JavaScript frameworks?",
      },
      {
        speaker: "Sarah Johnson",
        time: "00:01:30",
        text: "I've been working with React for about 4 years now. I've built several large-scale applications using React, Redux, and more recently, I've been exploring React Query and Zustand for state management. I'm also familiar with Next.js for server-side rendering and have experience with TypeScript in production environments.",
      },
      {
        speaker: "Interviewer",
        time: "00:02:45",
        text: "That's great. How do you approach responsive design and accessibility in your projects?",
      },
      {
        speaker: "Sarah Johnson",
        time: "00:03:00",
        text: "I believe responsive design should be considered from the start of any project. I typically use a mobile-first approach with CSS Grid and Flexbox. For accessibility, I ensure proper semantic HTML, keyboard navigation, appropriate ARIA attributes, and test with screen readers. I aim for WCAG AA compliance at minimum.",
      },
    ],
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const jumpToTime = (timeString) => {
    const [m, s] = timeString.split(":").map(Number);
    const time = m * 60 + s;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => navigate(`/admin/interviews/${jobId}`)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Interview Recording
                </h1>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">Job:</span> 
                  {interview.jobTitle} (ID: {jobId})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/30"
              >
                <Download className="h-4 w-4" /> 
                Download Recording
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Candidate Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {interview.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <div className="pt-16 pb-6 px-6 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{interview.candidateName}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{interview.candidateEmail}</p>
                <Badge className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full">
                  {interview.position}
                </Badge>
                
                <div className="w-full mt-6 space-y-4 text-sm">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" /> 
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Interview Date</div>
                      <div className="text-gray-500 dark:text-gray-400">{interview.date}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" /> 
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Start Time</div>
                      <div className="text-gray-500 dark:text-gray-400">{interview.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" /> 
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Duration</div>
                      <div className="text-gray-500 dark:text-gray-400">{interview.duration}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Video and Transcript */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video Player */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Interview Recording
                </h2>
              </div>
              
              <div className="p-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    poster="/placeholder.svg"
                    controls={false}
                  >
                    <source src={interview.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 flex items-center gap-3">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20 hover:text-white h-9 w-9 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    
                    <div className="text-sm font-medium">{formatTime(currentTime)}</div>
                    
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-blue-500"
                        style={{ width: `${(currentTime / (45 * 60)) * 100}%` }}
                      />
                    </div>
                    
                    <div className="text-sm font-medium">45:00</div>
                    
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 hover:text-white h-9 w-9 rounded-full"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transcript Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  Interview Transcript
                </h2>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/30"
                >
                  <Download className="h-4 w-4" /> 
                  Download Transcript
                </Button>
              </div>
              
              <div className="p-4">
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {interview.transcript.map((entry, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <button
                        onClick={() => jumpToTime(entry.time.substring(3))}
                        className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline whitespace-nowrap self-start mt-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md"
                      >
                        {entry.time}
                      </button>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm mb-1 ${
                          entry.speaker === "Interviewer" 
                            ? "text-purple-600 dark:text-purple-400" 
                            : "text-blue-600 dark:text-blue-400"
                        }`}>
                          {entry.speaker}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{entry.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewDetailPage;