import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createPluginApp } from '../createPluginApp';
import { PluginManager } from '../pluginManager';
import { testPlugin, withProviderPlugin } from '../../utils/tests';

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

  it('should handle empty plugins array', () => {
    const PluginApp = createPluginApp({
      plugins: [],
      App: () => <div>Plugin App</div>,
    });

    render(<PluginApp />);

    const app = screen.getByText(/plugin app/i);

    expect(app).toBeInTheDocument();
  });

  it('should handle invalid plugins', () => {
    expect(() => {
      createPluginApp({
        // @ts-expect-error Invalid plugin type
        plugins: [null],
        App: () => <div>Plugin App</div>,
      });
    }).toThrow();
  });

  it('should add providers to the app', () => {
    const PluginApp = createPluginApp({
      plugins: [withProviderPlugin],
      App: () => <div>Plugin App</div>,
    });

    render(<PluginApp />);

    const provider = screen.getByTestId('provider');
    const app = screen.getByText(/plugin app/i);

    expect(provider).toBeInTheDocument();
    expect(app).toBeInTheDocument();
  });
});
