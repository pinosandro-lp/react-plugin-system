import { Plugin } from './plugin';
import type { PluginApiStoreKey, PluginDeps } from './types';

/**
 * Creates a new plugin instance with the specified parameters.
 *
 * @returns A new instance of the Plugin class.
 */
export function createPlugin<
  Id extends PluginApiStoreKey,
  Deps extends PluginDeps,
>(param: ConstructorParameters<typeof Plugin<Id, Deps>>[0]): Plugin<Id, Deps> {
  return new Plugin(param);
}
