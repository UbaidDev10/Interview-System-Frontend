import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const PORT = 3001;
const GEMINI_API_KEY = 'AIzaSyCgUZT4_y8AiKE5NIdrgxu3cjz3_xbCOVg';
const MODEL_NAME = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

const wss = new WebSocketServer({ port: PORT });
const interviewSessions = new Map();

const MAX_QUESTIONS = 5;
const INTERVIEW_GUIDELINES = `
You are a technical interviewer conducting a screening interview. Follow these rules:
1. Start with a friendly greeting and introduce yourself briefly
2. Ask one technical question at a time
3. Questions should cover: programming concepts, algorithms, and problem-solving
4. Keep questions concise and clear
5. After each answer, provide brief acknowledgment before next question
6. After ${MAX_QUESTIONS} questions, conclude the interview politely
7. Maintain professional but friendly tone throughout
`;

async function callGeminiAPI(messages) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
          topP: 0.8
        }
      }),
      timeout: 30000 // 30 seconds timeout
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  const sessionId = Date.now().toString();
  
  interviewSessions.set(sessionId, {
    messages: [{
      role: 'user',
      parts: [{ text: INTERVIEW_GUIDELINES }]
    }],
    questionCount: 0,
    isInterviewActive: false
  });

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const session = interviewSessions.get(sessionId);

      if (data.type === 'start_interview') {
        session.isInterviewActive = true;
        
        session.messages.push({
          role: 'user',
          parts: [{ text: "Please begin the interview with your first technical question." }]
        });

        const responseText = await callGeminiAPI(session.messages);
        
        session.messages.push({
          role: 'model',
          parts: [{ text: responseText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: responseText
        }));
      }
      else if (data.type === 'message' && session.isInterviewActive) {
        session.questionCount++;
        
        // Store user response
        session.messages.push({
          role: 'user',
          parts: [{ text: data.text }]
        });

        // Check if interview should conclude
        if (session.questionCount >= MAX_QUESTIONS) {
          // Add conclusion prompt
          session.messages.push({
            role: 'user',
            parts: [{ text: "Please conclude the interview with a polite closing message." }]
          });

          const responseText = await callGeminiAPI(session.messages);
          
          ws.send(JSON.stringify({
            type: 'response',
            text: responseText
          }));
          
          session.isInterviewActive = false;
          return;
        }

        // Add prompt for next question
        session.messages.push({
          role: 'user',
          parts: [{
            text: `Please: 1. Acknowledge the response briefly, 2. Ask the next technical question`
          }]
        });

        // Get next question
        const responseText = await callGeminiAPI(session.messages);
        
        // Store AI response
        session.messages.push({
          role: 'model',
          parts: [{ text: responseText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: responseText
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        text: 'Sorry, an error occurred. Please try again.'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    interviewSessions.delete(sessionId);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);