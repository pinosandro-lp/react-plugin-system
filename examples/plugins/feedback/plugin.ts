import { Plugin } from '../../../lib';
import { FeedbackProvider } from './contexts';
import type { FeedbackPluginApi } from './plugin.api';
import { createApiClient } from './plugin.client';

export const FEEDBACK_PLUGIN_ID = 'pinosandro-feedback';

declare module '../../../lib/' {
  interface PluginApiStore {
    [FEEDBACK_PLUGIN_ID]: FeedbackPluginApi;
  }
}

export type FeedbackPluginID = typeof FEEDBACK_PLUGIN_ID;

export interface FeedbackPluginDeps {}

export const feedbackPlugin = new Plugin<FeedbackPluginID, {}>({
  id: FEEDBACK_PLUGIN_ID,
  createApiClient,
  provider: FeedbackProvider,
});
