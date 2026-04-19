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
      d => !this.pluginMap.has(d),
    );

    if (missingDependencies?.length)
      throw new Error(
        `Plugin ${
          plugin.id
        } has missing dependencies: ${missingDependencies.join(', ')}.`,
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

  /** Get a plugin by its unique identifier.
   * @param id - The unique identifier of the plugin.
   * @returns The plugin with the specified ID, or undefined if not found.
   */
  getById<Id extends PluginApiStoreKey>(
    id: Id,
  ): Plugin<Id, PluginDeps> | undefined {
    return this.pluginMap.get(id) as Plugin<Id, PluginDeps> | undefined;
  }

  /** Clear all registered plugins (for testing purposes). */
  clear(): void {
    this.pluginMap.clear();
  }
}
