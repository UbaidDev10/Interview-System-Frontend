import { useState, useEffect, useCallback } from 'react';

export default function useGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isWaitingForUserResponse, setIsWaitingForUserResponse] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response') {
        const newMessage = { 
          sender: 'ai', 
          text: data.text,
          ...(data.isConclusion ? { isConclusion: true } : {})
        };
        setMessages(prev => [...prev, newMessage]);
        
        if (data.isConclusion) {
          setIsInterviewEnded(true);
          // Close the socket after a short delay to allow final message to be processed
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          }, 1000);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
      setIsInterviewEnded(true); // Mark interview as ended on disconnect
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsInterviewEnded(true);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = useCallback((text, isFollowUp = false) => {
    if (socket && socket.readyState === WebSocket.OPEN && !isInterviewEnded) {
      setMessages(prev => [...prev, { sender: 'user', text }]);
      socket.send(JSON.stringify({
        type: 'message',
        text
      }));
    }
  }, [socket, isInterviewEnded]);

  const startInterview = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsInterviewEnded(false); // Reset interview state when starting new one
      socket.send(JSON.stringify({ type: 'start_interview' }));
    }
  }, [socket]);

  const askFollowUp = useCallback((messages) => {
    if (socket && socket.readyState === WebSocket.OPEN && !isInterviewEnded) {
      setIsWaitingForUserResponse(true);
      // You can implement follow-up logic here if needed
    }
  }, [socket, isInterviewEnded]);

  return {
    messages,
    sendMessage,
    startInterview,
    isConnected,
    isInterviewEnded,
    isWaitingForUserResponse,
    setIsWaitingForUserResponse,
    askFollowUp,
    socket
  };
}