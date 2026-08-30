import { Plugin } from './plugin';
import type { PluginApiStoreKey, PluginDeps, PluginOptions } from './types';

/**
 * Creates a new plugin instance with the specified parameters.
 *
 * @returns A new instance of the Plugin class.
 */
export function createPlugin<
  Id extends PluginApiStoreKey,
  Deps extends PluginDeps,
  Options extends PluginOptions | undefined = undefined,
>(
  param: ConstructorParameters<typeof Plugin<Id, Deps, Options>>[0],
  options?: ConstructorParameters<typeof Plugin<Id, Deps, Options>>[1],
): Plugin<Id, Deps, Options> {
  return new Plugin(param, options);
}
