import React from 'react';
import type { PluginManager } from '../plugin-system';

/** Context to provide the PluginManager instance throughout the React component tree. */
export const PluginContext = React.createContext<PluginManager | null>(null);
