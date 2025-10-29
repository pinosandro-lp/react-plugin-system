import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createPluginApp } from '../createPluginApp';
import { PluginManager } from '../pluginManager';
import { testPlugin } from '../../utils/tests';

describe('createPluginApp', () => {
  afterEach(() => {
    PluginManager.getInstance().clear();
  });

  it('should create a plugin app', () => {
    const PluginApp = createPluginApp({
      plugins: [testPlugin],
      App: () => <div>Plugin App</div>,
    });

    expect(PluginApp).toBeDefined();
  });

  it('should render the plugin app with plugins', () => {
    const PluginApp = createPluginApp({
      plugins: [testPlugin],
      App: () => <div>Plugin App</div>,
    });

    render(<PluginApp />);

    const app = screen.getByText(/plugin app/i);

    expect(app).toBeInTheDocument();
  });

  it('should load plugins into the PluginManager', () => {
    createPluginApp({
      plugins: [testPlugin],
      App: () => <div>Plugin App</div>,
    });

    const pluginManager = PluginManager.getInstance();

    expect(pluginManager.plugins).toContain(testPlugin);
  });
});
