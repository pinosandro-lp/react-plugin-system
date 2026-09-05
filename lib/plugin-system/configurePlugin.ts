import type { Plugin } from './plugin';
import type { PluginApiStoreKey, PluginDeps, PluginOptions } from './types';

export function configurePlugin<
  Id extends PluginApiStoreKey,
  Deps extends PluginDeps = {},
  Options extends PluginOptions = PluginOptions,
>(
  plugin: Plugin<Id, Deps, Options>,
  options: Options,
): { plugin: Plugin<Id, Deps, Options>; options: Options } {
  return {
    plugin,
    options,
  };
}
