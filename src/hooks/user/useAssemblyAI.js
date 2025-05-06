import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ASSEMBLYAI_API_KEY = 'd87af90a62634274868181364dbfbaec';

export default function useAssemblyAI() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      // Upload audio file
      const uploadResponse = await axios.post(
        'https://api.assemblyai.com/v2/upload',
        audioBlob,
        {
          headers: {
            'authorization': ASSEMBLYAI_API_KEY,
            'content-type': 'application/octet-stream'
          }
        }
      );

      const audioUrl = uploadResponse.data.upload_url;

      // Start transcription
      const transcriptionResponse = await axios.post(
        'https://api.assemblyai.com/v2/transcript',
        {
          audio_url: audioUrl,
          speech_model: 'universal'
        },
        {
          headers: {
            'authorization': ASSEMBLYAI_API_KEY,
            'content-type': 'application/json'
          }
        }
      );

      const transcriptId = transcriptionResponse.data.id;
      let transcriptionResult = null;

      // Poll for results
      while (true) {
        const pollingResponse = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: {
              'authorization': ASSEMBLYAI_API_KEY
            }
          }
        );

        transcriptionResult = pollingResponse.data;

        if (transcriptionResult.status === 'completed') {
          setTranscript(transcriptionResult.text);
          break;
        } else if (transcriptionResult.status === 'error') {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return transcriptionResult.text;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    startRecording,
    stopRecording,
    setTranscript
  };
}