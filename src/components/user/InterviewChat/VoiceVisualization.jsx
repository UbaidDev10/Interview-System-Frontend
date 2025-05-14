// src/components/InterviewChat/VoiceVisualization.jsx
export default function VoiceVisualization({ isListening, isSpeaking, isInterviewEnded }) {
  return (
    <div className="flex-1 flex items-center justify-center mb-6">
      <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        {isInterviewEnded ? (
          <div className="text-center text-gray-400">Interview completed</div>
        ) : isListening ? (
          <div className="animate-ping absolute h-32 w-32 rounded-full bg-blue-200 opacity-75" />
        ) : isSpeaking ? (
          <div className="animate-pulse text-indigo-500">Speaking...</div>
        ) : (
          <div className="text-gray-400">Idle</div>
        )}
      </div>
    </div>
  );
}
