import { useState } from 'react';
import API from '../../api/BaseService';

const useConversationUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadConversation = async (interviewId, conversation) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await API.post(`/user/${interviewId}/conversation`, {
        conversation
      });
      
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to upload conversation');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadConversation,
    isUploading,
    error
  };
};

export default useConversationUpload;