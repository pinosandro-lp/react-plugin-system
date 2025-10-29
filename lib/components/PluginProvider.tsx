import { PluginContext } from '../contexts';
import type { PluginManager } from '../plugin-system';

export interface PluginProviderProps extends React.PropsWithChildren {
  pluginManager: PluginManager;
}

/** React component that provides the PluginManager context to its children. */
export function PluginProvider(props: PluginProviderProps): React.ReactElement {
  const { children, pluginManager } = props;

  return (
    <PluginContext.Provider value={pluginManager}>
      {children}
    </PluginContext.Provider>
  );
}
