export default function VoiceVisualization({ isListening, isSpeaking, isInterviewEnded }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center mb-4 lg:mb-6">
      <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
        {isInterviewEnded ? (
          <div className="text-center p-4 lg:p-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 lg:h-8 w-6 lg:w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-gray-600 font-medium text-sm lg:text-base">Interview completed</div>
          </div>
        ) : isListening ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-ping absolute h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-blue-100 opacity-75"></div>
            </div>
            <div className="relative z-10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 lg:h-12 w-10 lg:w-12 mx-auto text-blue-600 mb-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
              <div className="text-blue-600 font-medium text-sm lg:text-base">Listening...</div>
              <div className="text-xs text-blue-500 mt-1">Speak now</div>
            </div>
          </>
        ) : isSpeaking ? (
          <div className="text-center p-4 lg:p-6">
            <div className="flex space-x-1.5 justify-center mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-1.5 lg:w-2 bg-blue-500 rounded-full animate-wave"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div className="text-blue-600 font-medium text-sm lg:text-base">Processing response</div>
            <div className="text-xs text-blue-500 mt-1">AI is speaking</div>
          </div>
        ) : (
          <div className="text-center p-4 lg:p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 lg:h-12 w-10 lg:w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <div className="text-gray-500 font-medium text-sm lg:text-base">Ready for input</div>
            <div className="text-xs text-gray-400 mt-1">Press the microphone button</div>
          </div>
        )}
      </div>
    </div>
  );
}