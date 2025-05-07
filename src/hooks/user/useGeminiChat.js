import { useState, useEffect, useCallback } from 'react';

export default function useGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForUserResponse, setIsWaitingForUserResponse] = useState(false); // ✅ Add this

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
        setMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = useCallback((text, isFollowUp = false) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Add user message to state immediately
      setMessages(prev => [...prev, { sender: 'user', text }]);
      socket.send(JSON.stringify({
        type: 'message',
        text
      }));
    }
  }, [socket]);

  const startInterview = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'start_interview' }));
    }
  }, [socket]);

  return {
    messages,
    sendMessage,
    startInterview,
    isConnected,
    isWaitingForUserResponse,           // ✅ Return it
    setIsWaitingForUserResponse         // ✅ Return the setter
  };
}
