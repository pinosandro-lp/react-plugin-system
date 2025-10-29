import { deepFreeze } from '../utils';
import { PluginManager } from './pluginManager';
import type {
  PluginApiStore,
  PluginApiStoreKey,
  PluginDeps,
  PluginDepsMap,
} from './types';

/**
 * Base class for creating plugins.
 * Each plugin has a unique ID, optional dependencies on other plugins,
 * and a method to create its API client using the APIs of its dependencies.
 */
export class Plugin<Id extends PluginApiStoreKey, Deps extends PluginDeps> {
  #id: Id;
  #dependencies: Deps;
  #createApiClient: (deps: PluginDepsMap<Deps>) => PluginApiStore[Id];
  #apiClient: Readonly<PluginApiStore[Id]> | null = null;

  /**
   * @param params - The parameters for the plugin.
   * @param params.id - The unique identifier for the plugin.
   * @param params.dependencies - An optional object mapping dependency names to their plugin IDs.
   * @param params.createApiClient - A function that creates the API client for the plugin using its dependencies.
   */
  constructor(params: {
    id: Id;
    dependencies?: Deps;
    createApiClient: (deps: PluginDepsMap<Deps>) => PluginApiStore[Id];
  }) {
    const { id, dependencies = {} as Deps, createApiClient } = params;
    this.#id = id;
    this.#dependencies = dependencies;
    this.#createApiClient = createApiClient;
  }

  /** Check if the plugin is registered in the PluginManager. */
  private isRegistered(): boolean {
    const pm = PluginManager.getInstance();
    return !!pm.plugins.find(p => p.id === this.id);
  }

  /** Resolves the dependencies of the plugin by retrieving their API clients from the PluginManager. */
  #resolveDependencies(): PluginDepsMap<Deps> {
    const pm = PluginManager.getInstance();

    return Object.entries(this.#dependencies).reduce((acc, [alias, depId]) => {
      const depPlugin = pm.plugins.find(p => p.id === depId);

      // impossible case if PluginManager is working properly
      if (!depPlugin) {
        throw new Error(`Missing dependency: ${depId} for plugin ${this.id}.`);
      }

      return {
        ...acc,
        [alias]: depPlugin.api,
      };
    }, {} as PluginDepsMap<Deps>);
  }

  /** The unique identifier of the plugin. */
  get id(): Id {
    return this.#id;
  }

  /** The dependencies of the plugin. */
  get dependencies(): PluginApiStoreKey[] {
    return [...Object.values(this.#dependencies)];
  }

  /** The API client of the plugin, created using its dependencies. */
  get api(): Readonly<PluginApiStore[Id]> {
    if (!this.isRegistered()) {
      throw new Error(`Plugin ${this.id} is not registered.`);
    }

    if (this.#apiClient === null) {
      const deps = this.#resolveDependencies();
      this.#apiClient = deepFreeze(this.#createApiClient(deps));
    }

    return this.#apiClient;
  }
}
