import { afterEach, describe, expect, it } from 'vitest';
import { createPlugin } from '../createPlugin';
import { Plugin } from '../plugin';
import { PluginManager } from '../pluginManager';

export interface CreatePluginTestApi {
  foo(): string;
}

export interface CreatePluginTestDependencyApi {
  bar(): string;
}

export const CREATE_PLUGIN_TEST_ID = 'test.create_plugin';
export const CREATE_PLUGIN_TEST_DEPENDENCY_ID = 'test.create_plugin_dependency';

declare module '../' {
  interface PluginApiStore {
    [CREATE_PLUGIN_TEST_ID]: CreatePluginTestApi;
    [CREATE_PLUGIN_TEST_DEPENDENCY_ID]: CreatePluginTestDependencyApi;
  }
}

describe('createPlugin', () => {
  const pluginManager = PluginManager.getInstance();

  afterEach(() => {
    pluginManager.clear();
  });

  it('should create a plugin', () => {
    const plugin = createPlugin({
      id: CREATE_PLUGIN_TEST_ID,
      createApiClient() {
        return {
          foo: (): string => 'bar',
        };
      },
    });

    expect(plugin).instanceOf(Plugin);
    expect(plugin.id).toBe(CREATE_PLUGIN_TEST_ID);
  });

  it('should dependencies be available in createApiClient', () => {
    const dependencyPlugin = createPlugin({
      id: CREATE_PLUGIN_TEST_DEPENDENCY_ID,
      dependencies: {
        testPlugin: CREATE_PLUGIN_TEST_ID,
      },
      createApiClient({ testPlugin }): CreatePluginTestDependencyApi {
        return {
          bar: () => `bar: ${testPlugin.foo()}`,
        };
      },
    });

    const plugin = createPlugin({
      id: CREATE_PLUGIN_TEST_ID,
      createApiClient(): CreatePluginTestApi {
        return {
          foo: () => 'foo',
        };
      },
    });

    pluginManager.load([plugin, dependencyPlugin]);

    expect(plugin.api.foo()).toBe('foo');
    expect(dependencyPlugin.api.bar()).toBe('bar: foo');
  });

  it('should pass options to createApiClient', () => {
    const plugin = createPlugin({
      id: CREATE_PLUGIN_TEST_ID,
      createApiClient(_deps, options) {
        return {
          foo: (): string => `foo: ${options?.prefix}`,
        };
      },
    });

    plugin.setOptions({ prefix: 'test' });

    pluginManager.load([plugin]);

    expect(plugin.api.foo()).toBe('foo: test');
  });
});
