import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  dependencyTestPlugin,
  NOT_REGISTRED_PLUGIN_ID,
  notRegistredPlugin,
  TEST_PLUGIN_ID,
  testPlugin,
  withProviderPlugin,
  type NotRegistredPluginApi,
} from '../../utils/tests';
import { Plugin } from '../plugin';
import { PluginManager } from '../pluginManager';

describe('Plugin class', () => {
  const pluginManager = PluginManager.getInstance();

  beforeAll(() => {
    pluginManager.load([testPlugin, dependencyTestPlugin]);
  });

  afterAll(() => {
    pluginManager.clear();
  });

  it('should return a new plugin instance', () => {
    expect(testPlugin).toBeInstanceOf(Plugin);
  });

  it('should contain the provided plugin ID and API client', () => {
    expect(testPlugin.id).toBe(TEST_PLUGIN_ID);
    expect(testPlugin.api).toEqual(testPlugin.api);
  });

  it('should plugin dependencies be an empty array if none or an empty object are provided', () => {
    expect(testPlugin.dependencies).toEqual([]);
    expect(notRegistredPlugin.dependencies).toEqual([]);
  });

  it('should contain the provided plugin dependencies', () => {
    expect(dependencyTestPlugin.dependencies).toEqual([TEST_PLUGIN_ID]);
  });

  it('should dependencies has to be resolved properly', () => {
    const result = dependencyTestPlugin.api.bar();

    expect(result).toBe('bar: foo');
  });

  it('should throw an error when accessing the API of an unregistered plugin', () => {
    const fn = (): NotRegistredPluginApi => notRegistredPlugin.api;

    expect(fn).toThrow(`Plugin ${NOT_REGISTRED_PLUGIN_ID} is not registered.`);
  });

  it('should provider be undefined if not provided', () => {
    expect(testPlugin.provider).toBeUndefined();
  });

  it('should return the provided provider', () => {
    expect(withProviderPlugin.provider).toBeDefined();
  });

  it('should thow an error if a plugin tries to set options more than once', () => {
    const fn = (): void => {
      withProviderPlugin.setOptions({ option1: 'value1', option2: 1 });
      withProviderPlugin.setOptions({ option1: 'value2', option2: 2 });
    };

    expect(fn).toThrow(
      `Options for plugin ${withProviderPlugin.id} are already set.`,
    );
  });
});
