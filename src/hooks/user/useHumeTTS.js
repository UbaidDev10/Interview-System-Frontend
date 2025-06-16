import { useEffect, useRef } from 'react';

const HUME_API_KEY = 'J5M0ylhkAfL9A4vYsfqxpZ11gOKZWsroTEuADxt1r9v8O7LV';

export default function useHumeTTS(onSpeechEnd) {
  const audioContextRef = useRef(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const synthesizeSpeech = async (text) => {
    const response = await fetch('https://api.hume.ai/v0/tts', {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': HUME_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        utterances: [{
          text: text,
          description: `Professional interview assistant female voice with clear articulation tone`
        }],
        format: { type: "mp3" },
        num_generations: 1
      })
    });

    const data = await response.json();
    return data.generations[0].audio;
  };

  const playAudio = async (base64Audio) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
    const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.buffer);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    return new Promise((resolve) => {
      source.onended = () => {
        onSpeechEnd?.(); // 🟢 trigger recording when playback ends
        resolve();
      };
      source.start(0);
    });
  };

  const speakText = async (text) => {
    try {
      const base64Audio = await synthesizeSpeech(text);
      await playAudio(base64Audio);
    } catch (error) {
      console.error('Speech Error:', error);
      throw error;
    }
  };

  return { speakText };
}
