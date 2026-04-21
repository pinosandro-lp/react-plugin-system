import React from "react";
import { FeedbackContext } from "./FeedbackProvider.context";
import { Alert } from "../../components";

export const FeedbackProvider = ({ children }: React.PropsWithChildren) => {
  const [alert, setAlert] = React.useState<{
    message: string;
    severity: "error" | "warning" | "info";
  } | null>(null);

  const showAlert = (
    message: string,
    severity: "error" | "warning" | "info",
  ) => {
    setAlert({ message, severity });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <FeedbackContext value={{ showAlert }}>
      {alert && <Alert message={alert.message} severity={alert.severity} />}
      {children}
    </FeedbackContext>
  );
};
