# 🔌 React Plugin System

A plugin-based approach focuses on features and promotes a more intuitive, clear, and maintainable form of modularity. This **plugin system for React** applications takes inspiration from [Spotify’s Backstage](https://github.com/backstage/backstage/tree/master), a full-fledged framework that I use daily at work.

The goal of this library is to provide a **lightweight**, **flexible**, and **minimal** plugin system for React, with no external constraints or dependencies beyond React itself.

Whether you use it in a traditional project, a monorepo, or with separate repositories for each plugin, there’s no wrong way to use this library.

## Installation

In the root of your React project:

```bash
npm install @pinosandro/react-plugin-system
```

## Usage

The `react-plugin-system` allows you to extend your application by creating and registering **plugins**. Each plugin provides **its own API** that can be accessed anywhere in your app using the `usePluginApi` hook.

### Create a Plugin

It is possible to create a new plugin using the `Plugin` class. Each plugin should have a **unique ID**, following the naming convention `author-pluginname`. The `createApiClient` function defines the plugin's API.

```js
import { Plugin } from '@pinosandro/react-plugin-system';

// naming convention: author-pluginname
export const EXAMPLE_PLUGIN_ID = 'author-example';

export const examplePlugin = new Plugin({
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
  </StrictMode>
);
```

### Consume the Plugin Api

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
import { Plugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example.js/example';

export const DEPS_EXAMPLE_PLUGIN_ID = 'author-depsexample';

export const depsExamplePlugin = new Plugin({
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
  </StrictMode>
);
```

### Types

The library provides native **TypeScript** support, but if you're using **JavaScript**, it's recommended to add declaration files `.d.ts` to benefit from autocompletion and a better developer experience.

- #### JavaScript (.d.ts)

For each plugin, create a `.d.ts` file following this example:

```ts
import { DEPS_EXAMPLE_PLUGIN_ID } from './depsExample';

interface DepsExamplePluginApi {
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

import { Plugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example.js/example';

export const DEPS_EXAMPLE_PLUGIN_ID = 'author-depsexample';

export const depsExamplePlugin = new Plugin({
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
import { Plugin } from '@pinosandro/react-plugin-system';
import { EXAMPLE_PLUGIN_ID } from '../example/example';

export const DEPS_EXAMPLE_PLUGIN_ID = 'author-depsexample';

interface DepsExamplePluginApi {
  anotherHelloMethod(): void;
}

declare module '@pinosandro/react-plugin-system' {
  interface PluginApiStore {
    [DEPS_EXAMPLE_PLUGIN_ID]: DepsExamplePluginApi;
  }
}

export const depsExamplePlugin = new Plugin({
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

### End Notes

The plugin API client is **fully customizable** to fit your specific needs. It can include not only utility functions but also, for example, **React components** that can be accessed via `usePluginApi`.

However, this approach is usually only necessary for **special cases**. In most scenarios, it’s sufficient to define plugin-related components within the plugin’s folder structure.

## License

Licensed under [MIT](./LICENSE).
