import { useState } from 'react';
import API from '../../api/BaseService';

const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadVideo = async (interviewId, videoBlob) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'interview.webm');
      
      const response = await API.post(`/upload/video/${interviewId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to upload video');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVideo,
    isUploading,
    error
  };
};

export default useVideoUpload;