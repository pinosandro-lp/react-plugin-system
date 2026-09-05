# 🔌 React Plugin System

A plugin-based approach focuses on features and promotes a more intuitive, clear, and maintainable form of modularity. This **plugin system for React** applications takes inspiration from [Spotify’s Backstage](https://github.com/backstage/backstage/tree/master), a full-fledged framework that I use daily at work.

The goal of this library is to provide a **lightweight**, **flexible**, and **minimal** plugin system for React, with no external constraints or dependencies beyond React itself.

Whether you use it in a traditional React project, a monorepo, or across separate repositories, the library is designed to adapt to your architecture without imposing a specific project structure.

## Installation

In the root of your React project:

```bash
npm install @pinosandro/react-plugin-system
```

## Usage

The `react-plugin-system` allows you to extend your application by creating and registering **plugins**. Each plugin provides **its own API** that can be accessed anywhere in your app using the `usePluginApi` hook.

### Create a Plugin

A plugin can be created using the `createPlugin` function. Each plugin should have a **unique ID**, following the naming convention `@author/name-plugin`. The `createApiClient` function defines the plugin's API.

```js
import { createPlugin } from '@pinosandro/react-plugin-system';

// naming convention: @author/name-plugin
export const EXAMPLE_PLUGIN_ID = '@author/example-plugin';

export const examplePlugin = createPlugin({
  id: EXAMPLE_PLUGIN_ID,
  createApiClient() {
    return {
      printHello() {
        console.log('Hello from examplePlugin API Client!');
      },
    };
  },
});
```

### Register a plugin

The `createPluginApp` function wraps your `App` within the plugin context, allowing the APIs of all registered plugins to be accessed anywhere in your application.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createPluginApp } from '@pinosandro/react-plugin-system';
import { App } from './App.jsx';
import { examplePlugin } from './plugins';

const PluginApp = createPluginApp({
  plugins: [examplePlugin],
  App,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PluginApp />
  </StrictMode>,
);
```

### Consume the Plugin API

You can access the **registered plugin's API** by passing its **unique ID** to the `usePluginApi` hook.

```jsx
import { usePluginApi } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from './plugins';

export function App() {
  const exampleApi = usePluginApi(EXAMPLE_PLUGIN_ID);

  exampleApi.printHello();

  return <div>App</div>;
}
```

### Plugin Dependencies

A plugin **can depend on other plugins** if it uses them internally. Here’s an example of how to define such a plugin:

```js
import { createPlugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example.js/example';

export const DEPS_EXAMPLE_PLUGIN_ID = '@author/deps-example-plugin';

export const depsExamplePlugin = createPlugin({
  id: DEPS_EXAMPLE_PLUGIN_ID,
  dependencies: {
    exampleApi: EXAMPLE_PLUGIN_ID,
  },
  createApiClient({ exampleApi }) {
    return {
      anotherHelloMethod() {
        console.log('Hello from depsExamplePlugin API Client!');
        exampleApi.printHello();
      },
    };
  },
});
```

Once a plugin is created, it must be registered in the `PluginApp` **after its dependencies**; otherwise, an error will be thrown.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createPluginApp } from '@pinosandro/react-plugin-system';
import { App } from './App.jsx';
import { depsExamplePlugin, examplePlugin } from './plugins';

const PluginApp = createPluginApp({
  plugins: [examplePlugin, depsExamplePlugin],
  App,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PluginApp />
  </StrictMode>,
);
```

### Plugin Options

Plugins can receive configuration through `options` provided when they are registered.

The options are passed as the second argument to `createApiClient`. This allows the same plugin to be reused with different configurations depending on the application or environment.

```js
import { createPlugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example.js/example';

export const DEPS_EXAMPLE_PLUGIN_ID = '@author/deps-example-plugin';

export const depsExamplePlugin = createPlugin({
  id: DEPS_EXAMPLE_PLUGIN_ID,
  dependencies: {
    exampleApi: EXAMPLE_PLUGIN_ID,
  },
  createApiClient({ exampleApi }, options) {
    console.log(options.foo);

    return {
      anotherHelloMethod() {
        console.log('Hello from depsExamplePlugin API Client!');
        exampleApi.printHello();
      },
    };
  },
});
```

Options are provided when registering the plugin by using the `configurePlugin` function:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createPluginApp,
  configurePlugin,
} from '@pinosandro/react-plugin-system';
import { App } from './App.jsx';
import { depsExamplePlugin, examplePlugin } from './plugins';

const PluginApp = createPluginApp({
  plugins: [
    examplePlugin,
    configurePlugin(depsExamplePlugin, {
      foo: 'bar',
    }),
  ],
  App,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PluginApp />
  </StrictMode>,
);
```

This makes it possible to keep the plugin implementation generic while allowing each application to provide its own configuration.

#### Handling Missing Options

When a plugin defines options, it should explicitly handle cases where the expected options are not provided or are incomplete.

Depending on the plugin's requirements, you can either provide sensible default values or throw an error when a required option is missing.

For optional configuration, prefer using default values:

```js
createApiClient({ exampleApi }, options = {}) {
  const foo = options.foo ?? 'default-value';

  return {
    anotherHelloMethod() {
      console.log(foo);
      exampleApi.printHello();
    },
  };
}
```

For required configuration, fail early with a descriptive error instead:

```js
createApiClient({ exampleApi }, options = {}) {
  const foo = options.foo;

  if (foo === undefined) {
    throw new Error(
      `${DEPS_EXAMPLE_PLUGIN_ID}: "foo" option is required`,
    );
  }

  return {
    anotherHelloMethod() {
      console.log(foo);
      exampleApi.printHello();
    },
  };
}
```

This is especially useful for plugins that cannot operate correctly without a specific configuration. Failing during plugin initialization makes configuration errors easier to identify and prevents the plugin from running in an invalid state.

### Plugin Provider

Use the `provider` property to add a React context to your plugin. This simplifies the integration of plugins that require their own context. The `provider` automatically wraps the application when the plugin is registered.

```js
import { createPlugin } from '@pinosandro/react-plugin-system';
import { createApiClient } from './plugin.client';

export const FEEDBACK_PLUGIN_ID = '@author/feedback-plugin';

export const feedbackPlugin = createPlugin({
  id: FEEDBACK_PLUGIN_ID,
  createApiClient,
  provider: FeedbackProvider,
});
```

If multiple plugins define a provider, each provider wraps the previously registered plugin, following the order in which the plugins are registered.

```js
// plugins: [pluginA, pluginB, pluginC]

<ProviderA>
  <ProviderB>
    <ProviderC>
      <App />
    </ProviderC>
  </ProviderB>
</ProviderA>
```

### Types

The library provides native **TypeScript** support, but if you're using **JavaScript**, it's recommended to add declaration files `.d.ts` to benefit from autocompletion and a better developer experience.

- #### JavaScript (.d.ts)

For each plugin, create a `.d.ts` file following this example:

```ts
import { DEPS_EXAMPLE_PLUGIN_ID } from './depsExample';

export interface DepsExamplePluginApi {
  anotherHelloMethod(): void;
}

declare module '@pinosandro/react-plugin-system' {
  interface PluginApiStore {
    [DEPS_EXAMPLE_PLUGIN_ID]: DepsExamplePluginApi;
  }
}
```

Once the declaration file is created, you can **reference** it directly in your JavaScript plugin. This ensures that your plugin has full access to the shared type definitions and API contracts defined above.

```js
// @ts-check
/// <reference path="./index.d.ts" />

import { createPlugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example/example';

export const DEPS_EXAMPLE_PLUGIN_ID = '@author/deps-example-plugin';

export const depsExamplePlugin = createPlugin({
  id: DEPS_EXAMPLE_PLUGIN_ID,
  dependencies: {
    exampleApi: EXAMPLE_PLUGIN_ID,
  },
  createApiClient({ exampleApi }) {
    return {
      anotherHelloMethod() {
        console.log('Hello from depsExamplePlugin API Client!');
        exampleApi.printHello();
      },
    };
  },
});
```

- #### Typescript

If you're using TypeScript, the plugin declaration should be like this:

```ts
import {
  createPlugin,
  type PluginDeps,
  type PluginOptions,
} from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID, type ExamplePluginApi } from '../example/example';

export const DEPS_EXAMPLE_PLUGIN_ID = '@author/deps-example-plugin';

interface DepsExamplePluginApi {
  anotherHelloMethod(): void;
}

type DepsExamplePluginId = typeof DEPS_EXAMPLE_PLUGIN_ID;

interface DepsExamplePluginDeps extends PluginDeps {
  exampleApi: ExamplePluginApi;
}

interface DepsExampleOptions extends PluginOptions {
  foo: string;
}

declare module '@pinosandro/react-plugin-system' {
  interface PluginApiStore {
    [DEPS_EXAMPLE_PLUGIN_ID]: DepsExamplePluginApi;
  }
}

export const depsExamplePlugin = createPlugin<
  DepsExamplePluginId,
  DepsExamplePluginDeps,
  DepsExampleOptions
>({
  id: DEPS_EXAMPLE_PLUGIN_ID,
  dependencies: {
    exampleApi: EXAMPLE_PLUGIN_ID,
  },
  createApiClient({ exampleApi }, options) {
    console.log(options.foo);

    return {
      anotherHelloMethod() {
        console.log('Hello from depsExamplePlugin API Client!');
        exampleApi.printHello();
      },
    };
  },
});
```

### End Notes

The plugin API is **fully customizable** to fit your specific needs. It can include utility functions and services, and in some cases, **React components and hooks** that can be accessed via `usePluginApi`.

However, exposing React components or hooks through the API is generally **discouraged**, except for **special cases**. The plugin API is primarily intended to expose **functionality and services**, while components and hooks are better kept as part of the plugin's UI and can be exported directly from the plugin when they need to be consumed by the application.

This avoids unnecessary coupling and indirection while keeping the plugin API focused on its actual capabilities.

## License

Licensed under [MIT](./LICENSE).
