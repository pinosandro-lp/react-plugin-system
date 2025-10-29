import type { Plugin } from './plugin';

export type PluginApiStoreKey = keyof PluginApiStore;

export type PluginDeps = Record<string, PluginApiStoreKey>;

export type PluginDepsMap<D extends PluginDeps> = {
  [K in keyof D]: PluginApiStore[D[K]];
};

export interface PluginApiStore {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoadablePlugins = readonly Plugin<PluginApiStoreKey, any>[];
