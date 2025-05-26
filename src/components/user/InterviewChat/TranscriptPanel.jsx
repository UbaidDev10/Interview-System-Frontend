import MessageBubble from './MessageBubble';

export default function TranscriptPanel({ messages, isSpeaking, isInterviewEnded, messagesEndRef }) {
  return (
    <div className="w-full lg:w-1/2 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Interview Transcript
        </h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-3 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <div className="font-medium mb-1">No messages yet</div>
            <div className="text-sm">Start the interview to begin the conversation</div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble 
                key={i} 
                msg={msg} 
                isSpeaking={isSpeaking} 
                isLast={i === messages.length - 1} 
              />
            ))}
            {isInterviewEnded && (
              <div className="text-center py-4 text-gray-500 border-t border-gray-200 mt-4 text-sm">
                <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Interview completed
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}