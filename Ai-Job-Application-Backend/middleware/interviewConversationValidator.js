// ... existing code ...
      );
    }
    if (!message.text || typeof message.text !== "string") {
      return next(
        new CustomError(
// ... existing code ...