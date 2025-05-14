import { useEffect, useRef, useState } from 'react';
export default function useAudioQueue(speakFunction, onSpeechEnd) {
  const audioQueueRef = useRef([]);
  
  const isProcessingQueueRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const onSpeechEndRef = useRef(onSpeechEnd);

  // Update the ref when onSpeechEnd changes
  useEffect(() => {
    onSpeechEndRef.current = onSpeechEnd;
  }, [onSpeechEnd]);

  const processAudioQueue = async () => {
    if (isProcessingQueueRef.current || audioQueueRef.current.length === 0) return;

    const nextAudio = audioQueueRef.current[0]; 
    if (nextAudio) {
      try {
        isProcessingQueueRef.current = true;
        setIsSpeaking(true);
        
        await speakFunction(nextAudio.text);
        
        // Only remove after successful speech
        audioQueueRef.current.shift();
      } catch (error) {
        console.error('Failed to speak text:', error);
        // Remove failed item from queue
        audioQueueRef.current.shift();
      } finally {
        setIsSpeaking(false);
        isProcessingQueueRef.current = false;
        
        // Process next item in queue
        if (audioQueueRef.current.length > 0) {
          processAudioQueue();
        } else if (onSpeechEndRef.current) {
          onSpeechEndRef.current(); // Call speech end handler when queue is empty
        }
      }
    }
  };

  const addToQueue = (message) => {
    audioQueueRef.current.push(message);
    if (!isProcessingQueueRef.current) {
      processAudioQueue();
    }
  };

  const clearQueue = () => {
    audioQueueRef.current = [];
  };

  return {
    addToQueue,
    clearQueue,
    isSpeaking,
  };
}