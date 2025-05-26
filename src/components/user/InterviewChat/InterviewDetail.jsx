import { useEffect, useRef } from 'react';
import useGeminiChat from '../../../hooks/user/useGeminiChat';
import useHumeTTS from '../../../hooks/user/useHumeTTS';
import useAssemblyAI from '../../../hooks/user/useAssemblyAI';
import useAudioQueue from '../../../hooks/user/useAudioQueue';
import useVideoRecorder from '../../../hooks/user/useVideoRecording';

import StatusIndicators from './StatusIndicators';
import VoiceVisualization from './VoiceVisualization';
import InterviewControls from './InterviewControls';
import TranscriptPanel from './TranscriptPanel';

export default function InterviewChat() {
  const {
    messages,
    sendMessage,
    startInterview,
    isConnected,
    isInterviewEnded,
    askFollowUp,
    socket,
    isWaitingForUserResponse,
    setIsWaitingForUserResponse
  } = useGeminiChat();

  const {
    isListening,
    transcript,
    startRecording,
    stopRecording,
    setTranscript,
  } = useAssemblyAI();

  const {
    speakText,
    onSpeechEnd
  } = useHumeTTS();

  const {
    addToQueue,
    clearQueue,
    isSpeaking
  } = useAudioQueue(speakText, () => {
    if (!isListening && !followUpTriggered.current && !isInterviewEnded) {
      startRecording();
    }
    if (onSpeechEnd) onSpeechEnd();
  });

  const {
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    downloadRecording,
    mediaBlobUrl,
    previewStream,
    status: videoStatus
  } = useVideoRecorder();

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
  }, [isInterviewEnded, stopRecording, clearQueue, stopVideoRecording, downloadRecording]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (messages.length > prevMessageCount.current && lastMessage?.sender === 'ai') {
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
        setTranscript('');
        setTimeout(() => {
          if (messages.length > 0 && !isInterviewEnded) {
            followUpTriggered.current = true;
            askFollowUp(messages);
          }
        }, 1000);
      }, 2000);
    }
  }, [transcript, sendMessage, setTranscript, stopRecording, messages, askFollowUp, isInterviewEnded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    if (isConnected && !isInterviewEnded) {
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
        setTranscript('');
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
            <h1 className="text-2xl font-bold text-gray-800">AI Interview Session</h1>
            <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
              {isConnected ? 'Live' : 'Connecting...'}
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