const uploadVideos = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Increased limit to 100MB
}); 