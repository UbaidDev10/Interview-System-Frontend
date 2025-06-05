router.route("/video/:interview_id").post(
  protect,
  authorize("user"),
  uploadVideos.single("video"),
  uploadController.uploadVideo
); 