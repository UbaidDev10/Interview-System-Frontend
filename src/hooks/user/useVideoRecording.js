import { useReactMediaRecorder } from 'react-media-recorder';

export default function useVideoRecorder() {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
    status,
  } = useReactMediaRecorder({ video: true });

  const downloadRecording = () => {
    if (mediaBlobUrl) {
      const link = document.createElement('a');
      link.href = mediaBlobUrl;
      link.download = 'interview-recording.webm';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    startRecording,
    stopRecording,
    downloadRecording,
    mediaBlobUrl,
    previewStream,
    status,
  };
}
