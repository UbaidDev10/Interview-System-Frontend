import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGeminiChat from "../../../hooks/user/useGeminiChat";
import useHumeTTS from "../../../hooks/user/useHumeTTS";
import useAssemblyAI from "../../../hooks/user/useAssemblyAI";
import useAudioQueue from "../../../hooks/user/useAudioQueue";
import useVideoRecorder from "../../../hooks/user/useVideoRecording";

import StatusIndicators from "./StatusIndicators";
import VoiceVisualization from "./VoiceVisualization";
import InterviewControls from "./InterviewControls";
import TranscriptPanel from "./TranscriptPanel";

import useVideoUpload from "../../../hooks/user/useVideoUpload";
import useConversationUpload from "../../../hooks/user/useConversationUpload";

export default function InterviewChat() {
  const { userId, interviewId } = useParams();
  const navigate = useNavigate();
  console.log("userId", userId);

  const [hasStarted, setHasStarted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

  const {
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    mediaBlobUrl,
    previewStream,
    status: videoStatus,
    downloadRecording
  } = useVideoRecorder();

  const {
    messages,
    sendMessage,
    startInterview,
    isConnected,
    isInterviewEnded,
    askFollowUp,
    socket,
    isWaitingForUserResponse,
    setIsWaitingForUserResponse,
  } = useGeminiChat(userId, interviewId);

  const {
    isListening,
    transcript,
    startRecording,
    stopRecording,
    setTranscript,
  } = useAssemblyAI();

  const { speakText, onSpeechEnd } = useHumeTTS();

  const { addToQueue, clearQueue, isSpeaking } = useAudioQueue(
    speakText,
    () => {
      if (!isListening && !followUpTriggered.current && !isInterviewEnded) {
        startRecording();
      }
      if (onSpeechEnd) onSpeechEnd();
    }
  );

  const prevMessageCount = useRef(messages.length);
  const recordingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isFirstRender = useRef(true);
  const followUpTriggered = useRef(false);

  // Stop video & audio when interview ends
  useEffect(() => {
    if (isInterviewEnded) {
      stopRecording();
      clearQueue();
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }

      stopVideoRecording();
      setTimeout(() => {
        downloadRecording();
      }, 1000);
    }
  }, [isInterviewEnded, stopRecording, clearQueue, stopVideoRecording]);

  const {
    uploadVideo,
    isUploading: isVideoUploading,
    error: videoError,
  } = useVideoUpload();

  const {
    uploadConversation,
    isUploading: isConversationUploading,
    error: conversationError,
  } = useConversationUpload();

  const hasAttemptedUpload = useRef(false);

  useEffect(() => {
    if (
      isInterviewEnded &&
      mediaBlobUrl &&
      !hasAttemptedUpload.current
    ) {
      hasAttemptedUpload.current = true;
      setShowCompletionModal(true);

      const uploadInterviewData = async () => {
        try {
          console.log("Starting interview data upload...");
          
          // Upload video
          const response = await fetch(mediaBlobUrl);
          const blob = await response.blob();
          console.log("Video blob created, size:", blob.size);
          
          await uploadVideo(interviewId, blob);
          console.log("Video uploaded successfully");

          // Upload conversation
          await uploadConversation(interviewId, messages);
          console.log("Conversation uploaded successfully");

          console.log("All interview data uploaded successfully");
          setIsUploadComplete(true);
        } catch (error) {
          console.error("Error uploading interview data:", error);
          // You might want to show an error message to the user here
        }
      };

      // Add a small delay to ensure video is fully processed
      setTimeout(uploadInterviewData, 2000);
    }
  }, [
    isInterviewEnded,
    mediaBlobUrl,
    messages,
    interviewId,
    uploadVideo,
    uploadConversation,
  ]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (
      messages.length > prevMessageCount.current &&
      lastMessage?.sender === "ai"
    ) {
      addToQueue(lastMessage);
      followUpTriggered.current = false;

      if (lastMessage.isConclusion) {
        stopRecording();
        clearQueue();
      }
    }

    prevMessageCount.current = messages.length;
  }, [messages, addToQueue, stopRecording, clearQueue]);

  useEffect(() => {
    if (transcript && !isInterviewEnded) {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }

      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
        sendMessage(transcript);
        setTranscript("");

        setTimeout(() => {
          if (messages.length > 0 && !isInterviewEnded) {
            followUpTriggered.current = true;
            askFollowUp(messages);
          }
        }, 1000);
      }, 2000);
    }
  }, [
    transcript,
    sendMessage,
    setTranscript,
    stopRecording,
    messages,
    askFollowUp,
    isInterviewEnded,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      clearQueue();
    };
  }, [clearQueue]);

  const handleStartInterview = () => {
    if (isConnected && !isInterviewEnded && !hasStarted) {
      setHasStarted(true);
      startInterview();
      startVideoRecording();
    }
  };

  const handleRecordButtonClick = () => {
    if (isInterviewEnded) return;

    if (isListening) {
      stopRecording();
      if (transcript) {
        sendMessage(transcript);
        setTranscript("");
      }
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Left Panel - Controls */}
      <div className="w-full lg:w-1/2 p-4 lg:p-6 flex flex-col">
        <div className="bg-white rounded-xl shadow-sm p-6 flex-1 flex flex-col border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              AI Interview Session
            </h1>
            <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {isConnected ? "Live" : "Connecting..."}
            </div>
          </div>

          {/* Video Preview */}
          {previewStream && (
            <div className="relative rounded-lg w-full mb-6 h-48 lg:h-64 bg-gray-100 overflow-hidden border border-gray-200">
              <video
                ref={(video) => {
                  if (video) video.srcObject = previewStream;
                }}
                autoPlay
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Recording
              </div>
            </div>
          )}

          <StatusIndicators
            isConnected={isConnected}
            isListening={isListening}
            isSpeaking={isSpeaking}
            isInterviewEnded={isInterviewEnded}
            isUploading={isVideoUploading || isConversationUploading}
          />

          <VoiceVisualization
            isListening={isListening}
            isSpeaking={isSpeaking}
            isInterviewEnded={isInterviewEnded}
          />

          <InterviewControls
            messages={messages}
            isConnected={isConnected}
            isInterviewEnded={isInterviewEnded}
            isListening={isListening}
            isSpeaking={isSpeaking}
            handleStartInterview={handleStartInterview}
            handleRecordButtonClick={handleRecordButtonClick}
            hasStarted={hasStarted}
          />
        </div>
      </div>

      {/* Right Panel - Transcript */}
      <TranscriptPanel
        messages={messages}
        isSpeaking={isSpeaking}
        isInterviewEnded={isInterviewEnded}
        messagesEndRef={messagesEndRef}
      />

      {/* Interview Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            {!isUploadComplete ? (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                    Saving Interview Data
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Please wait while we save your interview data...
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                    Interview Completed!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Thank you for completing the interview. We will get back to you through email.
                  </p>
                  <button
                    onClick={() => navigate('/user')}
                    className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Return to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
