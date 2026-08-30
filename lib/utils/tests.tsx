import React from 'react';
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

export interface WithProviderPluginApi {}

export interface WithOptionsPluginApi {
  getOptions(): {
    option1: string;
    option2: string;
  };
}

export const TEST_PLUGIN_ID = 'test.plugin';
export const DEPENDENCY_TEST_PLUGIN_ID = 'dependency_test.plugin';
export const NOT_REGISTRED_PLUGIN_ID = 'not_registred.plugin';
export const WITH_PROVIDER_PLUGIN_ID = 'with_provider.plugin';
export const WITH_OPTIONS_PLUGIN_ID = 'with_options.plugin';
export const WITH_PARTIAL_OPTIONS_PLUGIN_ID = 'with_partial_options.plugin';
export const WITH_OPTIONAL_OPTIONS_PLUGIN_ID = 'with_optional_options.plugin';
export const ERROR_OPTIONS_PLUGIN_ID = 'error_options.plugin';

declare module '../plugin-system' {
  interface PluginApiStore {
    [TEST_PLUGIN_ID]: TestPluginApi;
    [DEPENDENCY_TEST_PLUGIN_ID]: DependencyTestPluginApi;
    [NOT_REGISTRED_PLUGIN_ID]: NotRegistredPluginApi;
    [WITH_PROVIDER_PLUGIN_ID]: WithProviderPluginApi;
    [WITH_OPTIONS_PLUGIN_ID]: WithOptionsPluginApi;
    [WITH_PARTIAL_OPTIONS_PLUGIN_ID]: WithOptionsPluginApi;
    [WITH_OPTIONAL_OPTIONS_PLUGIN_ID]: WithOptionsPluginApi;
    [ERROR_OPTIONS_PLUGIN_ID]: WithOptionsPluginApi;
  }
}

export const OPTIONS_PARAM = {
  option1: 'value1',
  option2: 'value2',
};

export const DEFAULT_OPTIONS = {
  option1: 'default1',
  option2: 'default2',
};

export const PARTIAL_OPTIONS = {
  option1: 'partial1',
};

export const OPTIONS_ERROR_MESSAGE = 'Options are required for this plugin.';

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

export const withOptionsPlugin = new Plugin(
  {
    id: WITH_OPTIONS_PLUGIN_ID,
    createApiClient(_deps, options): WithOptionsPluginApi {
      if (!options) {
        throw new Error('Options are required for this plugin.');
      }

      return {
        getOptions: () => options,
      };
    },
  },
  OPTIONS_PARAM,
);

export const withPartialOptionsPlugin = new Plugin<
  typeof WITH_PARTIAL_OPTIONS_PLUGIN_ID,
  {},
  { option1?: string; option2?: string }
>(
  {
    id: WITH_PARTIAL_OPTIONS_PLUGIN_ID,
    createApiClient(_deps, options): WithOptionsPluginApi {
      if (!options) {
        throw new Error('Options are required for this plugin.');
      }

      return {
        getOptions: () => ({
          option1: options.option1 ?? DEFAULT_OPTIONS.option1,
          option2: options.option2 ?? DEFAULT_OPTIONS.option2,
        }),
      };
    },
  },
  PARTIAL_OPTIONS,
);

export const withOptionalOptionsPlugin = new Plugin<
  typeof WITH_OPTIONAL_OPTIONS_PLUGIN_ID,
  {},
  { option1?: string; option2?: string } | undefined
>({
  id: WITH_OPTIONAL_OPTIONS_PLUGIN_ID,
  createApiClient(_deps, options): WithOptionsPluginApi {
    return {
      getOptions: () => ({
        option1: options?.option1 ?? DEFAULT_OPTIONS.option1,
        option2: options?.option2 ?? DEFAULT_OPTIONS.option2,
      }),
    };
  },
});

export const errorOptionsPlugin = new Plugin({
  id: ERROR_OPTIONS_PLUGIN_ID,
  createApiClient(_deps, options): WithOptionsPluginApi {
    if (!options) {
      throw new Error(OPTIONS_ERROR_MESSAGE);
    }

    return {
      getOptions: () => options,
    };
  },
});
