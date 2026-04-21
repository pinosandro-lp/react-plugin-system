import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createPluginApp } from '../lib/index.ts';
import { App } from './App.tsx';
import { feedbackPlugin, fetcherPlugin, usersPlugin } from './plugins/index.ts';

const PluginApp = createPluginApp({
  plugins: [feedbackPlugin, fetcherPlugin, usersPlugin],
  App,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PluginApp />
  </StrictMode>,
);
