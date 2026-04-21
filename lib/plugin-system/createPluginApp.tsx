import { PluginProvider } from '../components';
import { composeProviders, extractPluginProviders } from '../utils';
import { PluginManager } from './pluginManager';
import type { LoadablePlugins } from './types';

/**
 * Decorates the main application component with the plugins system.
 * @param params - The parameters for creating the plugin app.
 * @param params.plugins - An array of plugins to be loaded into the application.
 * @param params.App - The main application component.
 * @returns A React component that provides the plugin manager context.
 */
export function createPluginApp(params: {
  plugins: LoadablePlugins;
  App: React.FC;
}): React.FC {
  const { plugins, App } = params;

  const pluginManager = PluginManager.getInstance();

  pluginManager.load(plugins);

  const CombinedContexts = composeProviders(extractPluginProviders(plugins));

  return function PluginApp() {
    return (
      <PluginProvider pluginManager={pluginManager}>
        <CombinedContexts>
          <App />
        </CombinedContexts>
      </PluginProvider>
    );
  };
}
