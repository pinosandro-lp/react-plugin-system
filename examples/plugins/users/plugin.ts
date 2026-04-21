import { Plugin } from '../../../lib';
import { FETCHER_PLUGIN_ID } from '../fetcher';
import type { FetcherPluginApi } from '../fetcher/plugin.api';
import type { UsersPluginApi } from './plugin.api';
import { createApiClient } from './plugin.client';

export const USERS_PLUGIN_ID = 'pinosandro-users';

declare module '../../../lib/' {
  interface PluginApiStore {
    [USERS_PLUGIN_ID]: UsersPluginApi;
  }
}

export type UsersPluginID = typeof USERS_PLUGIN_ID;

export interface UsersPluginDeps {
  fetcherApi: FetcherPluginApi;
}

export const usersPlugin = new Plugin<UsersPluginID, UsersPluginDeps>({
  id: USERS_PLUGIN_ID,
  dependencies: {
    fetcherApi: FETCHER_PLUGIN_ID,
  },
  createApiClient,
});
