import { Plugin } from './plugin';
import type {
  PluginApiStore,
  PluginApiStoreKey,
  PluginDeps,
  PluginDepsMap,
  PluginOptions,
} from './types';

/**
 * Creates a new plugin instance with the specified parameters.
 *
 * @returns A new instance of the Plugin class.
 */
export function createPlugin<
  Id extends PluginApiStoreKey,
  Deps extends PluginDeps = {},
  Options extends PluginOptions = PluginOptions,
>(param: {
  id: Id;
  dependencies?: Deps;
  createApiClient: (
    deps: PluginDepsMap<Deps>,
    options?: Options,
  ) => PluginApiStore[Id];
  provider?: React.FC<React.PropsWithChildren>;
}): Plugin<Id, Deps, Options> {
  return new Plugin(param);
}
