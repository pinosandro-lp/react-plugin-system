import type { Plugin } from './plugin';
import type { PluginApiStoreKey, PluginDeps, LoadablePlugins } from './types';

/**
 * Singleton class to manage the registration and loading of plugins.
 * It ensures that each plugin is registered only once and that all dependencies are satisfied.
 */
export class PluginManager {
  private static pm: PluginManager;
  private pluginMap: Map<
    PluginApiStoreKey,
    Plugin<PluginApiStoreKey, PluginDeps>
  > = new Map<PluginApiStoreKey, Plugin<PluginApiStoreKey, PluginDeps>>();

  private constructor() {}

  /** Get the singleton instance of the PluginManager. */
  static getInstance(): PluginManager {
    if (!PluginManager.pm) {
      PluginManager.pm = new PluginManager();
    }
    return PluginManager.pm;
  }

  /** Register a single plugin.
   * @param plugin - The plugin to be registered.
   */
  private register(plugin: Plugin<PluginApiStoreKey, PluginDeps>): void {
    const isRegistred = this.pluginMap.has(plugin.id);

    if (isRegistred)
      throw new Error(`Plugin ${plugin.id} is already registered.`);

    const missingDependencies = plugin.dependencies?.filter(
      d => !this.pluginMap.has(d)
    );

    if (missingDependencies?.length)
      throw new Error(
        `Plugin ${
          plugin.id
        } has missing dependencies: ${missingDependencies.join(', ')}.`
      );

    this.pluginMap.set(plugin.id, plugin);
  }

  /** Load and register multiple plugins.
   * @param plugins - An array of plugins to be registered.
   */
  load(plugins: LoadablePlugins): void {
    plugins.forEach(p => this.register(p));
  }

  /** Get all registered plugins. */
  get plugins(): Plugin<PluginApiStoreKey, PluginDeps>[] {
    return [...this.pluginMap.values()];
  }

  /** Clear all registered plugins (for testing purposes). */
  clear(): void {
    this.pluginMap.clear();
  }
}
