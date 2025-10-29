import { PluginProvider } from '../components';
import { PluginManager } from './pluginManager';
import type { LoadablePlugins } from './types';

/**
 * Decorates the main application component with the plugins system.,
 * @param params - The parameters for creating the plugin app.
 * @param params.plugins - An array of plugins to be loaded into the application.
 * @param params.App - The main application component.
 * @returns A React component that provides the plugin manager context.
 */
export function createPluginApp(params: {
  plugins: LoadablePlugins;
  App: React.FC;
}): React.FC<React.PropsWithChildren> {
  const { plugins, App } = params;

  const pluginManager = PluginManager.getInstance();

  pluginManager.load(plugins);

  return function PluginApp() {
    return (
      <PluginProvider pluginManager={pluginManager}>
        <App />
      </PluginProvider>
    );
  };
}
