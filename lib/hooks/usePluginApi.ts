import type { PluginApiStore, PluginApiStoreKey } from '../plugin-system';
import { usePluginManager } from './usePluginManager';

/** Hook to access a plugin's API client by its ID.
 * @param pluginId - The unique identifier of the plugin.
 * @returns The API client of the specified plugin.
 * @throws Will throw an error if the plugin is not registered.
 */
export function usePluginApi<ID extends PluginApiStoreKey>(
  pluginId: ID,
): PluginApiStore[ID] {
  const pluginManager = usePluginManager();

  const plugin = pluginManager.getById(pluginId);

  if (!plugin) throw new Error(`Plugin ${pluginId} is not registered.`);

  return plugin.api as PluginApiStore[ID];
}
