import React from 'react';
import { PluginContext } from '../contexts/PluginContext';
import type { PluginManager } from '../plugin-system';

/** Hook to access the PluginManager instance from the context.
 * @returns The PluginManager instance.
 * @throws Will throw an error if used outside of a PluginsProvider.
 */
export function usePluginManager(): PluginManager {
  const context = React.useContext(PluginContext);

  if (!context)
    throw new Error('usePluginManager must be used within a PluginProvider.');

  return context;
}
