import { useState, useEffect, useRef } from 'react';
import useGeminiChat from '../../hooks/user/useGeminiChat';
import useHumeTTS from '../../hooks/user/useHumeTTS';
import useAssemblyAI from '../../hooks/user/useAssemblyAI';

export default function InterviewChat() {
  const [input, setInput] = useState('');
  const { 
    messages, 
    sendMessage, 
    startInterview, 
    isConnected 
  } = useGeminiChat();
  const { speakText, isSpeaking } = useHumeTTS();
  const { 
    isListening, 
    transcript, 
    startRecording, 
    stopRecording,
    setTranscript
  } = useAssemblyAI();

  const prevMessageCount = useRef(messages.length);

  // Handle AI responses with TTS
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
  
    if (
      messages.length > prevMessageCount.current &&
      lastMessage &&
      lastMessage.sender === 'ai'
    ) {
      speakText(lastMessage.text).catch((error) => {
        console.error('Failed to speak text:', error);
      });
    }
  
    prevMessageCount.current = messages.length;
  }, [messages, speakText]);

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setTranscript(''); // Clear transcript after using
    }
  }, [transcript, setTranscript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleStartInterview = () => {
    if (isConnected) {
      startInterview();
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <div className="h-64 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`p-2 rounded ${msg.sender === 'user' ? 
              'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Interviewer'}:</strong> {msg.text}
            {msg.sender === 'ai' && isSpeaking && i === messages.length - 1 && (
              <span className="ml-2 text-xs text-gray-500">(Speaking...)</span>
            )}
          </div>
        ))}
      </div>

      {messages.length === 0 ? (
        <button
          onClick={handleStartInterview}
          disabled={!isConnected}
          className={`w-full py-2 rounded text-white ${
            isConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
          }`}
        >
          {isConnected ? 'Start Interview' : 'Connecting...'}
        </button>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 p-2 border rounded"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={isSpeaking}
            >
              Send
            </button>
          </form>
          
          <div className="flex justify-center">
            <button
              onClick={toggleRecording}
              className={`px-4 py-2 rounded-full text-white ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={isSpeaking}
            >
              {isListening ? 'Stop Recording' : 'Start Voice Input'}
            </button>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Listening... Speak now
            </div>
          )}
        </>
      )}
    </div>
  );
}