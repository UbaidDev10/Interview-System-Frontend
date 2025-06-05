import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  console.log("userId", userId);

  const [hasStarted, setHasStarted] = useState(false);

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

      const uploadInterviewData = async () => {
        try {
          // Upload video
          const response = await fetch(mediaBlobUrl);
          const blob = await response.blob();
          await uploadVideo(id, blob);

          // Upload conversation
          await uploadConversation(id, messages);

          console.log("Interview data uploaded successfully");
        } catch (error) {
          console.error("Error uploading interview data:", error);
        }
      };

      uploadInterviewData();
    }
  }, [
    isInterviewEnded,
    mediaBlobUrl,
    messages,
    userId,
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
    </div>
  );
}
