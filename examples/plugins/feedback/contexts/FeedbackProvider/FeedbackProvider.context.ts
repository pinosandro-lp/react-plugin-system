import React from "react";

interface FeedbackContextType {
  showAlert: (message: string, severity: "error" | "warning" | "info") => void;
}

export const FeedbackContext = React.createContext<FeedbackContextType | null>(
  null,
);
