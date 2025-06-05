export default function InterviewControls({
  messages,
  isConnected,
  isInterviewEnded,
  isListening,
  isSpeaking,
  handleStartInterview,
  handleRecordButtonClick,
  hasStarted,
}) {
  return (
    <div className="mt-auto w-full">
      {messages.length === 0 ? (
        <button
          onClick={handleStartInterview}
          disabled={!isConnected || isInterviewEnded || hasStarted}
          className={`w-full py-3.5 rounded-xl text-white font-medium transition-all duration-200 ${
            isConnected && !isInterviewEnded && !hasStarted
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isConnected ? (
              isInterviewEnded ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Interview Completed
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Start Interview
                </>
              )
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Connecting...
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          {!isInterviewEnded && (
            <>
              <button
                onClick={handleRecordButtonClick}
                disabled={isSpeaking}
                className={`py-3.5 px-6 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-md hover:shadow-lg animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
                } ${isSpeaking ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isListening ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Stop Recording
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Start Voice Input
                  </>
                )}
              </button>
              {isListening && (
                <div className="text-center text-sm text-gray-500 animate-pulse flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  Listening... Speak now
                </div>
              )}
            </>
          )}
          {isInterviewEnded && (
            <div className="text-center py-4 px-6 rounded-xl bg-green-50 text-green-800 border border-green-100">
              <div className="font-medium mb-1 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Interview Completed
              </div>
              <p className="text-sm">Thank you for your participation!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}