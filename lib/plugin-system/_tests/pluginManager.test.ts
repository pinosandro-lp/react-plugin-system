import { describe, expect, it, afterEach } from 'vitest';
import { PluginManager } from '../pluginManager';
import {
  DEPENDENCY_TEST_PLUGIN_ID,
  dependencyTestPlugin,
  TEST_PLUGIN_ID,
  testPlugin,
} from '../../utils/tests';

describe('PluginManager class', () => {
  afterEach(() => {
    const pm = PluginManager.getInstance();
    pm.clear();
  });

  it('should return an instance of PluginManager', () => {
    const pluginManager = PluginManager.getInstance();

    expect(pluginManager).toBeInstanceOf(PluginManager);
  });

  it('should be a singleton', () => {
    const instance1 = PluginManager.getInstance();
    const instance2 = PluginManager.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should register and load plugins correctly', () => {
    const pluginManager = PluginManager.getInstance();

    pluginManager.load([testPlugin, dependencyTestPlugin]);

    expect(pluginManager.plugins).toHaveLength(2);
  });

  it('should throw an error when registering a plugin that is already registered', () => {
    const pluginManager = PluginManager.getInstance();

    expect(() => {
      pluginManager.load([testPlugin, testPlugin]);
    }).toThrow(`Plugin ${TEST_PLUGIN_ID} is already registered.`);
  });

  it('should throw an error when registering a plugin with missing dependencies', () => {
    const pluginManager = PluginManager.getInstance();

    expect(() => {
      pluginManager.load([dependencyTestPlugin]);
    }).toThrow(
      `Plugin ${DEPENDENCY_TEST_PLUGIN_ID} has missing dependencies: ${TEST_PLUGIN_ID}.`,
    );
  });

  it('should throw an error when plugin are loaded in the wrong order', () => {
    const pluginManager = PluginManager.getInstance();

    expect(() => {
      pluginManager.load([dependencyTestPlugin, testPlugin]);
    }).toThrow(
      `Plugin ${DEPENDENCY_TEST_PLUGIN_ID} has missing dependencies: ${TEST_PLUGIN_ID}.`,
    );
  });

  it('should return all registered plugins', () => {
    const pluginManager = PluginManager.getInstance();

    pluginManager.load([testPlugin, dependencyTestPlugin]);

    const plugins = pluginManager.plugins;

    expect(plugins).toContain(testPlugin);
    expect(plugins).toContain(dependencyTestPlugin);
  });

  it('should return an empty array if no plugins are registered', () => {
    const pluginManager = PluginManager.getInstance();

    const plugins = pluginManager.plugins;

    expect(plugins).toHaveLength(0);
  });

  it('should return a plugin by its ID', () => {
    const pluginManager = PluginManager.getInstance();

    pluginManager.load([testPlugin, dependencyTestPlugin]);

    const plugin = pluginManager.getById(TEST_PLUGIN_ID);

    expect(plugin).toBe(testPlugin);
  });

  it('should return undefined if a plugin with the specified ID is not found', () => {
    const pluginManager = PluginManager.getInstance();

    pluginManager.load([testPlugin, dependencyTestPlugin]);

    const plugin = pluginManager.getById(
      'non-existent-plugin' as typeof TEST_PLUGIN_ID,
    );

    expect(plugin).toBeUndefined();
  });

  it('should clear all registered plugins', () => {
    const pluginManager = PluginManager.getInstance();

    pluginManager.load([testPlugin, dependencyTestPlugin]);

    expect(pluginManager.plugins).toHaveLength(2);

    pluginManager.clear();

    expect(pluginManager.plugins).toHaveLength(0);
  });
});
