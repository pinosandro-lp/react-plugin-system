import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  DEFAULT_OPTIONS,
  dependencyTestPlugin,
  errorOptionsPlugin,
  NOT_REGISTRED_PLUGIN_ID,
  notRegistredPlugin,
  OPTIONS_ERROR_MESSAGE,
  OPTIONS_PARAM,
  PARTIAL_OPTIONS,
  TEST_PLUGIN_ID,
  testPlugin,
  withOptionalOptionsPlugin,
  withOptionsPlugin,
  withPartialOptionsPlugin,
  withProviderPlugin,
  type NotRegistredPluginApi,
} from '../../utils/tests';
import { Plugin } from '../plugin';
import { PluginManager } from '../pluginManager';

describe('Plugin class', () => {
  const pluginManager = PluginManager.getInstance();

  beforeAll(() => {
    pluginManager.load([
      testPlugin,
      dependencyTestPlugin,
      withOptionsPlugin,
      withPartialOptionsPlugin,
      withOptionalOptionsPlugin,
      errorOptionsPlugin,
    ]);
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

  it('should throw an error when accessing the API of a plugin with required options but no options provided', () => {
    const fn = (): void => {
      errorOptionsPlugin.api.getOptions();
    };

    expect(fn).toThrow(OPTIONS_ERROR_MESSAGE);
  });

  it('should return the provided options', () => {
    const options = withOptionsPlugin.api.getOptions();

    expect(options.option1).toBe(OPTIONS_PARAM.option1);
    expect(options.option2).toBe(OPTIONS_PARAM.option2);
  });

  it('should return the provided options when partial options are provided', () => {
    const options = withPartialOptionsPlugin.api.getOptions();

    expect(options.option1).toBe(PARTIAL_OPTIONS.option1);
    expect(options.option2).toBe(DEFAULT_OPTIONS.option2);
  });

  it('should return the default options when no options are provided', () => {
    const options = withOptionalOptionsPlugin.api.getOptions();

    expect(options.option1).toBe(DEFAULT_OPTIONS.option1);
    expect(options.option2).toBe(DEFAULT_OPTIONS.option2);
  });
});
