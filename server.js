import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';

const PORT = 3001;
const GEMINI_API_KEY = 'AIzaSyCgUZT4_y8AiKE5NIdrgxu3cjz3_xbCOVg';
const MODEL_NAME = 'gemini-1.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

const wss = new WebSocketServer({ port: PORT });
const interviewSessions = new Map();

const MAX_QUESTIONS = 8;
const INTERVIEW_GUIDELINES = `
You are a professional technical interviewer conducting a screening interview...
[TRUNCATED FOR BREVITY, KEEP AS IS]
End after ${MAX_QUESTIONS} questions with closing remarks
`;

async function callGeminiAPI(messages, temperature = 0.5) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: 300,
          topP: 0.9
        }
      }),
      timeout: 30000
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
    isInterviewActive: false,
    candidateLevel: 'mid',
    timeoutHandle: null,
    followupCount: 0
  });

  const session = interviewSessions.get(sessionId);

  const setNextQuestionTimeout = () => {
    if (session.timeoutHandle) clearTimeout(session.timeoutHandle);

    session.timeoutHandle = setTimeout(async () => {
      if (session.followupCount >= 2) {
        // If we've already sent 2 followups, end the interview
        const conclusionPrompt = {
          role: 'user',
          parts: [{
            text: `The candidate didn't respond to multiple follow-ups. 
                  Please conclude the interview professionally by thanking them 
                  for their time and mentioning that we'll be in touch if 
                  there's interest in proceeding. Keep it brief (1-2 sentences).`
          }]
        };

        session.messages.push(conclusionPrompt);
        const closingText = await callGeminiAPI(session.messages);

        session.messages.push({
          role: 'model',
          parts: [{ text: closingText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: closingText,
          isConclusion: true
        }));

        session.isInterviewActive = false;
        return;
      }

      console.log(`User timed out — sending follow-up ${session.followupCount + 1}/2`);
      session.followupCount++;

      session.messages.push({
        role: 'user',
        parts: [{
          text: `The candidate didn't respond within 60 seconds (follow-up ${session.followupCount}/2). 
                ${session.followupCount === 1 ? 
                  "Please ask a follow-up question to re-engage them." : 
                  "Please ask one final follow-up question before concluding."}`
        }]
      });

      const responseText = await callGeminiAPI(session.messages, 0.5);

      session.messages.push({
        role: 'model',
        parts: [{ text: responseText }]
      });

      session.questionCount++;

      ws.send(JSON.stringify({
        type: 'response',
        text: responseText,
        questionCount: session.questionCount,
        isFollowup: true,
        followupCount: session.followupCount
      }));

      if (session.questionCount >= MAX_QUESTIONS) {
        const conclusionPrompt = {
          role: 'user',
          parts: [{
            text: `Please conclude the interview professionally. 
                  Thank the candidate for their time, mention next steps 
                  (like "We'll review your answers and get back to you"), 
                  and wish them a good day. Keep it under 3 sentences.`
          }]
        };

        session.messages.push(conclusionPrompt);
        const closingText = await callGeminiAPI(session.messages);

        session.messages.push({
          role: 'model',
          parts: [{ text: closingText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: closingText,
          isConclusion: true
        }));

        session.isInterviewActive = false;
      } else {
        setNextQuestionTimeout(); // Restart timer for next question
      }

    }, 60000); // 60 seconds
  };

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'start_interview') {
        session.isInterviewActive = true;
        session.followupCount = 0; // Reset followup counter on new interview

        session.messages.push({
          role: 'user',
          parts: [{
            text: `Begin the interview with a friendly introduction and first question. 
                  Start with a warm greeting, briefly introduce yourself as the interviewer, 
                  then ask an opening question something related to HR like introduce yourself`
          }]
        });

        const responseText = await callGeminiAPI(session.messages, 0.7);

        session.messages.push({
          role: 'model',
          parts: [{ text: responseText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: responseText,
          isFirstQuestion: true
        }));

        setNextQuestionTimeout(); // Start timeout after first question

      } else if (data.type === 'message' && session.isInterviewActive) {
        // Reset followup counter when user responds
        session.followupCount = 0;
        
        // Clear timeout when user responds
        if (session.timeoutHandle) clearTimeout(session.timeoutHandle);

        session.questionCount++;

        session.messages.push({
          role: 'user',
          parts: [{ text: data.text }]
        });

        if (data.text.length > 200) {
          session.candidateLevel = 'senior';
        } else if (data.text.length < 50) {
          session.candidateLevel = 'junior';
        }

        if (session.questionCount >= MAX_QUESTIONS) {
          const conclusionPrompt = {
            role: 'user',
            parts: [{
              text: `Please conclude the interview professionally. 
                    Thank the candidate for their time, mention next steps 
                    (like "We'll review your answers and get back to you"), 
                    and wish them a good day. Keep it under 3 sentences.`
            }]
          };

          session.messages.push(conclusionPrompt);
          const responseText = await callGeminiAPI(session.messages);

          session.messages.push({
            role: 'model',
            parts: [{ text: responseText }]
          });

          ws.send(JSON.stringify({
            type: 'response',
            text: responseText,
            isConclusion: true
          }));

          session.isInterviewActive = false;
          return;
        }

        let nextPrompt;
        if (session.questionCount < 2) {
          nextPrompt = `Ask another relatively easy question to continue warming up. 
                       You can make it slightly more technical than the first.`;
        } else if (session.questionCount < 5) {
          nextPrompt = `Based on the candidate's apparent level (${session.candidateLevel}), 
                       ask a moderately technical question about ${getTechnicalTopic(session.questionCount)}. 
                       After their answer, provide brief acknowledgment before moving on.`;
        } else {
          nextPrompt = `Ask ${session.questionCount < MAX_QUESTIONS - 1 ? 
                       'a more challenging technical question' : 
                       'a final open-ended question about their experience or problem-solving approach'}. 
                       Make it appropriate for a ${session.candidateLevel} candidate.`;
        }

        session.messages.push({
          role: 'user',
          parts: [{ text: nextPrompt }]
        });

        const temperature = session.questionCount < 2 ? 0.7 :
                            session.questionCount > MAX_QUESTIONS - 2 ? 0.6 : 0.5;

        const responseText = await callGeminiAPI(session.messages, temperature);

        session.messages.push({
          role: 'model',
          parts: [{ text: responseText }]
        });

        ws.send(JSON.stringify({
          type: 'response',
          text: responseText,
          questionCount: session.questionCount
        }));

        setNextQuestionTimeout(); // Restart timeout for next question
      }

    } catch (error) {
      console.error('Error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        text: 'Apologies, I encountered a technical difficulty. Could you please repeat your last response?'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (session?.timeoutHandle) clearTimeout(session.timeoutHandle);
    interviewSessions.delete(sessionId);
  });
});

// Helper function
function getTechnicalTopic(index) {
  const topics = [
    'programming fundamentals',
    'data structures',
    'algorithms',
    'system design principles',
    'software architecture',
    'debugging techniques',
    'performance optimization',
    'testing methodologies'
  ];
  return topics[index % topics.length];
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);