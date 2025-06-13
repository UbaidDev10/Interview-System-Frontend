"use client"

import { useRef, useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useInterviewDetail from "@/hooks/admin/useInterviewDetail"
import { ArrowLeft, Download, FileText, Pause, Play, Video, Volume2, VolumeX, User } from "lucide-react"
import { Button } from "../../components/ui/button"


const InterviewDetailPage = () => {
  const { jobId, interviewId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const { conversation, videoUrl, loading, error } = useInterviewDetail(interviewId)

  useEffect(() => {
  if (videoRef.current) {
    const video = videoRef.current
    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration)
      }
    }
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }
}, [videoUrl])

  const togglePlayPause = () => {
    if (!videoRef.current) return
    isPlaying ? videoRef.current.pause() : videoRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleProgressBarClick = (e) => {
  if (!videoRef.current) return
  const progressBar = e.currentTarget
  const rect = progressBar.getBoundingClientRect()
  const clickPosition = (e.clientX - rect.left) / rect.width
  const newTime = clickPosition * duration
  videoRef.current.currentTime = newTime
  setCurrentTime(newTime)
}

 const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "00:00"
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")
  return `${m}:${s}`
}

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interview details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg border border-red-200">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => navigate(`/admin/interviews/${jobId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interviews
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Interview Recording</h1>
              </div>
            </div>
            {videoUrl && (
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <Download className="h-4 w-4 mr-2" />
                Download Recording
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Video Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Video Recording
            </h2>
          </div>
          <div className="p-6">
            {videoUrl ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
               <video
  ref={videoRef}
  className="w-full h-full"
  onTimeUpdate={handleTimeUpdate}
  muted={isMuted}
  controls={false}
>
  <source src={videoUrl} type="video/webm" />
  Your browser does not support the video tag.
</video>

                {/* Custom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                  <div className="flex items-center gap-3">
                    {/* Skip Back */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
                        }
                      }}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <span className="text-xs font-bold">-10</span>
                    </Button>

                    {/* Play/Pause */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlayPause}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    {/* Skip Forward */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
                        }
                      }}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <span className="text-xs font-bold">+10</span>
                    </Button>

                    {/* Current Time */}
                    <div className="text-sm font-medium">{formatTime(currentTime)}</div>

                    {/* Progress Bar */}
                    <div 
  className="flex-1 h-1.5 bg-white/20 rounded-full relative overflow-hidden cursor-pointer"
  onClick={handleProgressBarClick}
>
  <div
    className="absolute top-0 left-0 h-full bg-blue-500 transition-all"
    style={{ width: `${(currentTime / duration) * 100}%` }}
  />
</div>

                    {/* Total Duration */}
                    <div className="text-sm font-medium">{formatTime(duration)}</div>

                    {/* Volume */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Video className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium">No video available</p>
                  <p className="text-sm">The recording may still be processing</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Transcript Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Interview Transcript
            </h2>
          </div>
          <div className="p-6">
            {conversation.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {conversation.map((entry, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          entry.speaker === "Interviewer" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold text-sm mb-1 ${
                          entry.speaker === "Interviewer" ? "text-blue-700" : "text-green-700"
                        }`}
                      >
                        {entry.speaker}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium text-gray-500">No transcript available</p>
                <p className="text-sm text-gray-400">The transcript may still be processing</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default InterviewDetailPage
