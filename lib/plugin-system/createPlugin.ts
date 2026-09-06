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
 * @param param The parameters required to create the plugin.
 * @param param.id The unique identifier for the plugin.
 * @param param.dependencies The dependencies required by the plugin.
 * @param param.createApiClient The function to create the API client for the plugin.
 * @param param.provider An optional React component that provides the plugin's context.
 * @template Id The unique identifier for the plugin.
 * @template Deps The dependencies required by the plugin.
 * @template Options The options used to configure the plugin.
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
