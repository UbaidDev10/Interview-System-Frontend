// src/components/InterviewChat/InterviewControls.jsx
export default function InterviewControls({
  messages,
  isConnected,
  isInterviewEnded,
  isListening,
  isSpeaking,
  handleStartInterview,
  handleRecordButtonClick
}) {
  return (
    <div className="mt-auto">
      {messages.length === 0 ? (
        <button
          onClick={handleStartInterview}
          disabled={!isConnected || isInterviewEnded}
          className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
            isConnected && !isInterviewEnded
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isConnected ? (isInterviewEnded ? 'Interview Completed' : 'Start Interview') : 'Connecting...'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {!isInterviewEnded && (
            <>
              <button
                onClick={handleRecordButtonClick}
                disabled={isSpeaking}
                className={`py-3 px-6 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md animate-pulse'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md'
                } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? 'Stop Recording' : 'Start Voice Input'}
              </button>
              {isListening && (
                <div className="text-center text-sm text-gray-500 animate-pulse">Listening... Speak now</div>
              )}
            </>
          )}
          {isInterviewEnded && (
            <div className="text-center py-4 text-gray-500">
              The interview has concluded. Thank you for your participation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
