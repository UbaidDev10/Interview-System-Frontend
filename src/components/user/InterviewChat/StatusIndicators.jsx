export default function StatusIndicators({ isConnected, isListening, isSpeaking, isInterviewEnded }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div className={`flex items-center text-sm p-2.5 rounded-lg ${
        isConnected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}>
        <span className={`flex w-2.5 h-2.5 rounded-full mr-2.5 ${
          isConnected ? 'bg-green-500' : 'bg-gray-400'
        } ${isConnected ? 'animate-pulse' : ''}`}></span>
        <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
      </div>
      
      <div className={`flex items-center text-sm p-2.5 rounded-lg ${
        isListening ? 'bg-red-50 text-red-700' : 
        isSpeaking ? 'bg-blue-50 text-blue-700' : 
        'bg-gray-100 text-gray-500'
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full mr-2.5 ${
          isListening ? 'bg-red-500' : 
          isSpeaking ? 'bg-blue-500' : 
          'bg-gray-400'
        } ${isListening ? 'animate-pulse' : ''}`}></span>
        {isListening ? 'Listening' : isSpeaking ? 'Responding' : 'Ready'}
      </div>
      
      {isInterviewEnded && (
        <div className="flex items-center text-sm p-2.5 rounded-lg bg-red-50 text-red-700 col-span-full">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2.5 animate-pulse"></span>
          Interview Session Ended
        </div>
      )}
    </div>
  );
}