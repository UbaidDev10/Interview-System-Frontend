import { useState, useEffect, useCallback } from 'react';

export default function useGeminiChat(userId, interviewId) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isWaitingForUserResponse, setIsWaitingForUserResponse] = useState(false);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
      setIsConnected(true);

      if (userId) {
        ws.send(JSON.stringify({
          type: 'user_info',
          userId,interviewId
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response') {
        // If we're already processing a question, add this one to the queue
        if (isProcessingQuestion) {
          setQuestionQueue(prev => [...prev, data]);
        } else {
          // Process this question immediately
          setIsProcessingQuestion(true);
          const newMessage = { 
            sender: 'ai', 
            text: data.text,
            ...(data.isConclusion ? { isConclusion: true } : {})
          };
          setMessages(prev => [...prev, newMessage]);
          
          if (data.isConclusion) {
            setIsInterviewEnded(true);
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.close();
              }
            }, 1000);
          }
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

  // Effect to process queued questions when user responds
  useEffect(() => {
    if (!isWaitingForUserResponse && questionQueue.length > 0 && !isProcessingQuestion) {
      const nextQuestion = questionQueue[0];
      setQuestionQueue(prev => prev.slice(1));
      setIsProcessingQuestion(true);
      
      const newMessage = { 
        sender: 'ai', 
        text: nextQuestion.text,
        ...(nextQuestion.isConclusion ? { isConclusion: true } : {})
      };
      setMessages(prev => [...prev, newMessage]);
      
      if (nextQuestion.isConclusion) {
        setIsInterviewEnded(true);
        setTimeout(() => {
          if (socket?.readyState === WebSocket.OPEN) {
            socket.close();
          }
        }, 1000);
      }
    }
  }, [isWaitingForUserResponse, questionQueue, isProcessingQuestion, socket]);

  const sendMessage = useCallback((text, isFollowUp = false) => {
    if (socket && socket.readyState === WebSocket.OPEN && !isInterviewEnded) {
      setMessages(prev => [...prev, { sender: 'user', text }]);
      socket.send(JSON.stringify({
        type: 'message',
        text
      }));
      setIsProcessingQuestion(false); // Mark current question as processed
    }
  }, [socket, isInterviewEnded]);

  const startInterview = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsInterviewEnded(false); // Reset interview state when starting new one
      setQuestionQueue([]); // Clear any existing questions in queue
      setIsProcessingQuestion(false); // Reset processing state
      socket.send(JSON.stringify({ type: 'start_interview' }));
    }
  }, [socket]);

  const askFollowUp = useCallback((messages) => {
    if (socket && socket.readyState === WebSocket.OPEN && !isInterviewEnded) {
      setIsWaitingForUserResponse(true);
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