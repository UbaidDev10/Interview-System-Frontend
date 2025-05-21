import React from "react";

const ResumePreviewModal = ({ isOpen, onClose, pdfUrl }) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-[90%] max-w-4xl relative h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Resume Preview
        </h2>

        <iframe
          src={pdfUrl}
          title="Resume Preview"
          width="100%"
          height="100%"
          className="rounded border"
        />
      </div>
    </div>
  );
};

export default ResumePreviewModal;
