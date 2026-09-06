import type { Plugin } from './plugin';
import type { PluginApiStoreKey, PluginDeps, PluginOptions } from './types';

/**
 * Configures a plugin instance with the specified options.
 *
 * @param plugin The plugin instance to configure.
 * @param options The options to configure the plugin with.
 * @template Id The unique identifier for the plugin.
 * @template Deps The dependencies required by the plugin.
 * @template Options The options used to configure the plugin.
 * @returns An object containing the plugin instance and the provided options.
 */
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
