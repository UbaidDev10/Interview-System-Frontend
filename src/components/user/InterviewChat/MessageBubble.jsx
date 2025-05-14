// src/components/InterviewChat/MessageBubble.jsx
export default function MessageBubble({ msg, isSpeaking, isLast }) {
  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          msg.sender === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="font-medium mb-1">
          {msg.sender === 'user' ? 'You' : 'Interviewer'}
          {msg.sender === 'ai' && isSpeaking && isLast && (
            <span className="ml-2 text-xs opacity-80">(Speaking...)</span>
          )}
          {msg.isConclusion && (
            <span className="ml-2 text-xs opacity-80">(Final Message)</span>
          )}
        </div>
        <div>{msg.text}</div>
      </div>
    </div>
  );
}
