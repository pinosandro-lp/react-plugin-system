import { renderHook } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PluginManager } from '../../plugin-system';
import { PluginProvider } from '../../components';
import { usePluginApi } from '../usePluginApi';
import {
  NOT_REGISTRED_PLUGIN_ID,
  TEST_PLUGIN_ID,
  testPlugin,
} from '../../utils/tests';

describe('usePluginApi hook', () => {
  const pm = PluginManager.getInstance();

  beforeAll(() => {
    pm.load([testPlugin]);
  });

  afterAll(() => {
    pm.clear();
  });

  const Wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): React.JSX.Element => {
    return <PluginProvider pluginManager={pm}>{children}</PluginProvider>;
  };

  it('should return the plugin API', () => {
    const { result } = renderHook(() => usePluginApi(TEST_PLUGIN_ID), {
      wrapper: Wrapper,
    });

    expect(result.current).toBe(testPlugin.api);
    expect(result.current.foo()).toBe('foo');
  });

  it('should throw an error if the plugin is not registered', () => {
    try {
      renderHook(() => usePluginApi(NOT_REGISTRED_PLUGIN_ID), {
        wrapper: Wrapper,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        `Plugin ${NOT_REGISTRED_PLUGIN_ID} is not registered.`
      );
    }
  });

  it('should throw an error if the hook (that use usePluginManager) is used outside of a plugin provider', () => {
    try {
      renderHook(() => usePluginApi(TEST_PLUGIN_ID));
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        'usePluginManager must be used within a PluginProvider.'
      );
    }
  });
});
