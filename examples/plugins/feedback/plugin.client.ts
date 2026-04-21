// import { useFeedbackContext } from "./contexts";
import type { FeedbackPluginDeps } from "./plugin";
import type { FeedbackPluginApi } from "./plugin.api";

export function createApiClient(_: FeedbackPluginDeps): FeedbackPluginApi {
  return {
    // useContext: useFeedbackContext,
    severity: {
      INFO: "info",
      WARNING: "warning",
      ERROR: "error",
    } as const,
  };
}
