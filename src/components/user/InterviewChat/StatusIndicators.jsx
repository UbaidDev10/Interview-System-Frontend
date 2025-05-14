// src/components/InterviewChat/StatusIndicators.jsx
export default function StatusIndicators({ isConnected, isListening, isSpeaking, isInterviewEnded }) {
  return (
    <div className="flex gap-4 mb-6">
      <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-gray-400'}`}>
        <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        {isConnected ? 'Connected' : 'Connecting'}
      </div>
      <div className="flex items-center text-blue-500">
        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
        {isListening ? 'Listening' : isSpeaking ? 'AI Speaking' : 'Ready'}
      </div>
      {isInterviewEnded && (
        <div className="flex items-center text-red-500">
          <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Interview Ended
        </div>
      )}
    </div>
  );
}
