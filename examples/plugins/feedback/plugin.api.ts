// import type { useFeedbackContext } from "./contexts";

export interface FeedbackPluginApi {
  // If you dont want to export the hook directly, you can export it as part of the API like this:
  // useContext: typeof useFeedbackContext;
  severity: {
    INFO: 'info';
    WARNING: 'warning';
    ERROR: 'error';
  };
}
