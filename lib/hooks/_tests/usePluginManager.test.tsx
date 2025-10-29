import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePluginManager } from '../usePluginManager';
import { PluginProvider } from '../../components';
import { PluginManager } from '../../plugin-system';

describe('usePluginManager hook', () => {
  it('should return the plugin manager instance', () => {
    const Wrapper = ({
      children,
    }: {
      children: React.ReactNode;
    }): React.JSX.Element => {
      const pm = PluginManager.getInstance();

      return <PluginProvider pluginManager={pm}>{children}</PluginProvider>;
    };

    const { result } = renderHook(usePluginManager, {
      wrapper: Wrapper,
    });

    expect(result.current).toBeInstanceOf(PluginManager);
  });

  it('should throw an error if used outside of PluginProvider', () => {
    try {
      renderHook(usePluginManager);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        'usePluginManager must be used within a PluginProvider.'
      );
    }
  });
});
