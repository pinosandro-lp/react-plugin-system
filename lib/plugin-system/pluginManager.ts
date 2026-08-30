import type { Plugin } from './plugin';
import type {
  PluginApiStoreKey,
  PluginOptions,
  LoadablePlugin,
  PluginOptionsOf,
  PluginDeps,
  PluginReference,
} from './types';

type RegisteredPlugin = {
  [K in PluginApiStoreKey]: Plugin<K, PluginDeps, PluginOptions>;
}[PluginApiStoreKey];

/**
 * Singleton class to manage the registration and loading of plugins.
 * It ensures that each plugin is registered only once and that all dependencies are satisfied.
 */
export class PluginManager {
  private static pm: PluginManager;

  private pluginMap: Map<PluginApiStoreKey, RegisteredPlugin> = new Map();

  private constructor() {}

  /** Get the singleton instance of the PluginManager. */
  static getInstance(): PluginManager {
    if (!PluginManager.pm) {
      PluginManager.pm = new PluginManager();
    }

    return PluginManager.pm;
  }

  /** Register a single plugin. */
  private register<P extends RegisteredPlugin>(
    plugin: P,
    options?: PluginOptionsOf<P>,
  ): void {
    const isRegistred = this.pluginMap.has(plugin.id);

    if (isRegistred) {
      throw new Error(`Plugin ${plugin.id} is already registered.`);
    }

    const missingDependencies = plugin.dependencies?.filter(
      d => !this.pluginMap.has(d),
    );

    if (missingDependencies?.length) {
      throw new Error(
        `Plugin ${
          plugin.id
        } has missing dependencies: ${missingDependencies.join(', ')}.`,
      );
    }

    if (options) {
      plugin.setOptions(options);
    }

    this.pluginMap.set(plugin.id, plugin);
  }

  /** Load and register multiple plugins. */
  load<const P extends readonly unknown[]>(
    plugins: readonly [
      ...{
        [K in keyof P]: LoadablePlugin<P[K]>;
      },
    ],
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins.forEach((p: any) => {
      if ('plugin' in p) {
        this.register(p.plugin, p.options);
      } else {
        this.register(p);
      }
    });
  }

  /** Get all registered plugins. */
  get plugins(): RegisteredPlugin[] {
    return [...this.pluginMap.values()];
  }

  /** Get a plugin by its unique identifier. */
  getById<Id extends PluginApiStoreKey>(
    id: Id,
  ): PluginReference<Id> | undefined {
    return this.pluginMap.get(id) as PluginReference<Id> | undefined;
  }

  /** Clear all registered plugins. */
  clear(): void {
    this.pluginMap.clear();
  }
}
