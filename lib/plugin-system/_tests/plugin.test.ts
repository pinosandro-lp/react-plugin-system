import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Plugin } from '../plugin';
import { PluginManager } from '../pluginManager';
import {
  dependencyTestPlugin,
  NOT_REGISTRED_PLUGIN_ID,
  notRegistredPlugin,
  type NotRegistredPluginApi,
  TEST_PLUGIN_ID,
  testPlugin,
} from '../../utils/tests';

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

    expect(fn).toThrowError(
      `Plugin ${NOT_REGISTRED_PLUGIN_ID} is not registered.`
    );
  });
});
