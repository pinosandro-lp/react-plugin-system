import { Plugin } from '../plugin-system';

export interface TestPluginApi {
  foo(): string;
}

export interface DependencyTestPluginApi {
  bar(): string;
}

export interface NotRegistredPluginApi {
  baz(): string;
}

export const TEST_PLUGIN_ID = 'test.plugin';
export const DEPENDENCY_TEST_PLUGIN_ID = 'dependency_test.plugin';
export const NOT_REGISTRED_PLUGIN_ID = 'not_registred.plugin';

declare module '../plugin-system' {
  interface PluginApiStore {
    [TEST_PLUGIN_ID]: TestPluginApi;
    [DEPENDENCY_TEST_PLUGIN_ID]: DependencyTestPluginApi;
    [NOT_REGISTRED_PLUGIN_ID]: NotRegistredPluginApi;
  }
}

export const testPlugin = new Plugin({
  id: TEST_PLUGIN_ID,
  createApiClient(): TestPluginApi {
    return {
      foo: () => 'foo',
    };
  },
});

export const dependencyTestPlugin = new Plugin({
  id: DEPENDENCY_TEST_PLUGIN_ID,
  dependencies: {
    testPlugin: TEST_PLUGIN_ID,
  },
  createApiClient({ testPlugin }): DependencyTestPluginApi {
    return {
      bar: () => `bar: ${testPlugin.foo()}`,
    };
  },
});

export const notRegistredPlugin = new Plugin({
  id: NOT_REGISTRED_PLUGIN_ID,
  dependencies: {},
  createApiClient(): NotRegistredPluginApi {
    return {
      baz: () => 'baz',
    };
  },
});
