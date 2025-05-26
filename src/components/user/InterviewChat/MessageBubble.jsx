export default function MessageBubble({ msg, isSpeaking, isLast }) {
  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-xl transition-all duration-200 ${
          msg.sender === 'user'
            ? 'bg-blue-600 text-white rounded-br-none shadow-md'
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
        } ${isLast ? 'animate-fade-in' : ''}`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="font-medium text-sm flex items-center">
            {msg.sender === 'user' ? (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                You
              </span>
            ) : (
              <span className="flex items-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Interviewer
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {msg.sender === 'ai' && isSpeaking && isLast && (
              <span className="text-xs text-blue-500 flex items-center">
                <span className="flex h-2 w-2 relative mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Speaking
              </span>
            )}
            {msg.isConclusion && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Final Feedback</span>
            )}
          </div>
        </div>
        <div className="text-sm leading-relaxed">{msg.text}</div>
      </div>
    </div>
  );
}