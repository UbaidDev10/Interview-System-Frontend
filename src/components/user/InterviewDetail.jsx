// interviewDetail.js
import { useEffect, useRef, useState } from 'react';
import useGeminiChat from '../../hooks/user/useGeminiChat';
import useHumeTTS from '../../hooks/user/useHumeTTS';
import useAssemblyAI from '../../hooks/user/useAssemblyAI';

export default function InterviewChat() {
  const {
    messages,
    sendMessage,
    startInterview,
    isConnected,
  } = useGeminiChat();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const {
    isListening,
    transcript,
    startRecording,
    stopRecording,
    setTranscript,
  } = useAssemblyAI();

  const prevMessageCount = useRef(messages.length);
  const recordingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audioQueueRef = useRef([]); // Queue for audio messages
  const isProcessingQueueRef = useRef(false); // Flag to track if queue is being processed

  const handleSpeechEnd = () => {
    setIsSpeaking(false);
    isProcessingQueueRef.current = false;
    processAudioQueue(); // Check if there are more items in queue
    startRecording(); // Start recording when AI finishes speaking
  };

  const { speakText } = useHumeTTS(handleSpeechEnd);

  // Process the audio queue
  const processAudioQueue = () => {
    if (isProcessingQueueRef.current || audioQueueRef.current.length === 0) return;

    const nextAudio = audioQueueRef.current.shift();
    if (nextAudio) {
      isProcessingQueueRef.current = true;
      setIsSpeaking(true);
      speakText(nextAudio.text).catch((error) => {
        console.error('Failed to speak text:', error);
        setIsSpeaking(false);
        isProcessingQueueRef.current = false;
        processAudioQueue(); // Continue with next item even if current fails
      });
    }
  };

  // Speak AI messages, adding to queue if needed
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      messages.length > prevMessageCount.current &&
      lastMessage &&
      lastMessage.sender === 'ai'
    ) {
      // Add to queue instead of speaking immediately
      audioQueueRef.current.push(lastMessage);
      
      // If not currently speaking and queue was empty, process immediately
      if (!isProcessingQueueRef.current && audioQueueRef.current.length === 1) {
        processAudioQueue();
      }
    }

    prevMessageCount.current = messages.length;
  }, [messages]);

  // Handle transcript changes
  useEffect(() => {
    if (transcript) {
      // Clear any existing timeout
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
        sendMessage(transcript);
        setTranscript('');
      }, 2000);
    }
  }, [transcript, sendMessage, setTranscript, stopRecording]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      // Clear the audio queue
      audioQueueRef.current = [];
    };
  }, []);

  const handleStartInterview = () => {
    if (isConnected) {
      startInterview();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left panel - Voice interaction */}
      <div className="w-1/2 p-6 flex flex-col">
        <div className="bg-white rounded-xl shadow-md p-6 flex-1 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Interview Session</h1>
          
          {/* Status indicators */}
          <div className="flex gap-4 mb-6">
            <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-gray-400'}`}>
              <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              {isConnected ? 'Connected' : 'Connecting'}
            </div>
            <div className="flex items-center text-blue-500">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              {isListening ? 'Listening' : isSpeaking ? 'AI Speaking' : 'Ready'}
            </div>
          </div>

          {/* Voice visualization placeholder */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
              {isListening ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-ping absolute h-32 w-32 rounded-full bg-blue-200 opacity-75"></div>
                  <div className="relative">
                    <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : isSpeaking ? (
                <div className="animate-pulse">
                  <svg className="w-16 h-16 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                  </svg>
                </div>
              ) : (
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-auto">
            {messages.length === 0 ? (
              <button
                onClick={handleStartInterview}
                disabled={!isConnected}
                className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
                  isConnected 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isConnected ? 'Start Interview' : 'Connecting...'}
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => isListening ? stopRecording() : startRecording()}
                  className={`py-3 px-6 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md animate-pulse'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                  } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSpeaking}
                >
                  {isListening ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                      </svg>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      Start Voice Input
                    </>
                  )}
                </button>
                
                {isListening && (
                  <div className="text-center text-sm text-gray-500 animate-pulse">
                    Listening... Speak now
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel - Conversation transcript */}
      <div className="w-1/2 bg-white border-l border-gray-200 p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation Transcript</h2>
        
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <p className="mt-2">Your interview conversation will appear here</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {msg.sender === 'user' ? 'You' : 'Interviewer'}
                    {msg.sender === 'ai' && isSpeaking && i === messages.length - 1 && (
                      <span className="ml-2 text-xs opacity-80">(Speaking...)</span>
                    )}
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}