// src/components/InterviewChat/TranscriptPanel.jsx
import MessageBubble from './MessageBubble';

export default function TranscriptPanel({ messages, isSpeaking, isInterviewEnded, messagesEndRef }) {
  return (
    <div className="w-1/2 bg-white border-l border-gray-200 p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation Transcript</h2>
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">Your interview conversation will appear here</div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} isSpeaking={isSpeaking} isLast={i === messages.length - 1} />
            ))}
            {isInterviewEnded && (
              <div className="text-center py-4 text-gray-500 border-t border-gray-200 mt-4">
                Interview completed
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
