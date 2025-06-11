import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInterviewDetail from "@/hooks/admin/useInterviewDetail";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Pause,
  Play,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "../ui/button";

const InterviewDetailPage = ({ jobId, interviewId }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const { conversation, videoUrl, loading, error } =
    useInterviewDetail(interviewId);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading)
    return (
      <div className="p-6 text-center text-blue-500">Loading interview...</div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
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
              </div>
            </div>
            {videoUrl && (
              <Button
                variant="outline"
                className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900"
              >
                <Download className="h-4 w-4" />
                Download Recording
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Video Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Interview Recording
            </h2>
          </div>
          <div className="p-4">
            {videoUrl ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-md">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() =>
                    setDuration(videoRef.current?.duration || 0)
                  }
                  muted={isMuted}
                  controls={false}
                >
                  <source src={videoUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Custom YouTube-like Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4 flex items-center gap-3">
                  {/* ⏪ -10s */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.max(
                          0,
                          videoRef.current.currentTime - 10
                        );
                      }
                    }}
                    className="text-white hover:bg-white/20 h-9 w-9"
                  >
                    <span className="text-sm font-bold">-10</span>
                  </Button>

                  {/* ▶️ Play / ⏸ Pause */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20 h-9 w-9"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>

                  {/* ⏩ +10s */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = Math.min(
                          duration,
                          videoRef.current.currentTime + 10
                        );
                      }
                    }}
                    className="text-white hover:bg-white/20 h-9 w-9"
                  >
                    <span className="text-sm font-bold">+10</span>
                  </Button>

                  {/* ⏱ Current Time */}
                  <div className="text-sm font-medium">
                    {formatTime(currentTime)}
                  </div>

                  {/* ⏳ Progress Bar */}
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-500"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* 📏 Total Duration */}
                  <div className="text-sm font-medium">
                    {formatTime(duration)}
                  </div>

                  {/* 🔇 Volume */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-9 w-9"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No video available
              </div>
            )}
          </div>
        </section>

        {/* Transcript Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              Transcript
            </h2>
          </div>
          <div className="p-4">
            {conversation.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {conversation.map((entry, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div
                      className={`font-semibold text-sm ${
                        entry.speaker === "Interviewer"
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {entry.speaker}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No transcript available
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewDetailPage;
