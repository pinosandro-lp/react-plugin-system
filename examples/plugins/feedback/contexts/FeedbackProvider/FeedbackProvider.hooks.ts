import React from "react";
import { FeedbackContext } from "./FeedbackProvider.context";

export const useFeedbackContext = () => {
  const feedbackContext = React.use(FeedbackContext);

  if (!feedbackContext) {
    throw new Error(
      "useFeedbackContext must be used within a FeedbackProvider",
    );
  }

  return feedbackContext;
};
