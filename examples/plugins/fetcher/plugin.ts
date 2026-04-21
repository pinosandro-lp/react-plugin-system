import { Plugin } from '../../../lib';
import type { FetcherPluginApi } from './plugin.api';
import { createApiClient } from './plugin.client';

export const FETCHER_PLUGIN_ID = 'pinosandro-fetcher';

declare module '../../../lib/' {
  interface PluginApiStore {
    [FETCHER_PLUGIN_ID]: FetcherPluginApi;
  }
}

export type FetcherPluginID = typeof FETCHER_PLUGIN_ID;

export interface FetcherPluginDeps {}

export const fetcherPlugin = new Plugin<FetcherPluginID, {}>({
  id: FETCHER_PLUGIN_ID,
  createApiClient,
});
