import React from 'react';
import { Plugin, type PluginOptions } from '../plugin-system';

export interface TestPluginApi {
  foo(): string;
}

export interface DependencyTestPluginApi {
  bar(): string;
}

export interface NotRegistredPluginApi {
  baz(): string;
}

export interface WithProviderPluginApi {}

export interface WithOptionsPluginApi {
  getOptions(): Record<string, unknown>;
}

export interface ExamplePluginOptions extends PluginOptions {
  option1: string;
  option2: number;
}

export const TEST_PLUGIN_ID = '@pinsoandro/test-plugin';
export const DEPENDENCY_TEST_PLUGIN_ID = '@pinsoandro/dependency-test-plugin';
export const NOT_REGISTRED_PLUGIN_ID = '@pinsoandro/not-registred-plugin';
export const WITH_PROVIDER_PLUGIN_ID = '@pinsoandro/with-provider-plugin';
export const WITH_OPTIONS_PLUGIN_ID = '@pinsoandro/with-options-plugin';

declare module '../plugin-system' {
  interface PluginApiStore {
    [TEST_PLUGIN_ID]: TestPluginApi;
    [DEPENDENCY_TEST_PLUGIN_ID]: DependencyTestPluginApi;
    [NOT_REGISTRED_PLUGIN_ID]: NotRegistredPluginApi;
    [WITH_PROVIDER_PLUGIN_ID]: WithProviderPluginApi;
    [WITH_OPTIONS_PLUGIN_ID]: WithOptionsPluginApi;
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

export const withProviderPlugin = new Plugin({
  id: WITH_PROVIDER_PLUGIN_ID,
  createApiClient(): WithProviderPluginApi {
    return {};
  },
  provider: ({ children }): React.JSX.Element => {
    return (
      <div data-testid="provider" className="with-provider">
        {children}
      </div>
    );
  },
});

export const withOptionsPlugin = new Plugin<
  typeof WITH_OPTIONS_PLUGIN_ID,
  {},
  ExamplePluginOptions
>({
  id: WITH_OPTIONS_PLUGIN_ID,
  createApiClient(_: {}, options): WithOptionsPluginApi {
    options = options ?? {
      option1: 'default1',
      option2: 0,
    };

    return {
      getOptions: () => options,
    };
  },
});
