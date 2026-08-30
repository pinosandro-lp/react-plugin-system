import { createPlugin } from '@pinosandro/react-plugin-system';
import type { PluginDeps, PluginOptions } from './lib/plugin-system';

export const ENV_PLUGIN_ID = 'pinosandro-env';

export type EnvPluginId = typeof ENV_PLUGIN_ID;

export interface EnvPluginApi {}

export interface EnvPluginDeps extends PluginDeps {}

export interface EnvPluginOptions extends PluginOptions {}

declare module './lib/plugin-system' {
  interface PluginApiStore {
    [ENV_PLUGIN_ID]: EnvPluginApi;
  }
}

export const envPlugin = createPlugin<
  EnvPluginId,
  EnvPluginDeps,
  EnvPluginOptions
>({
  id: ENV_PLUGIN_ID,
  createApiClient() {
    return {};
  },
});
