import { describe, expect, it } from 'vitest';
import { composeProviders, extractPluginProviders } from '../plugins';
import { testPlugin, withProviderPlugin } from '../../utils/tests';
import { render } from '@testing-library/react';

describe('extractPluginProviders function', () => {
  it('should extract providers from plugins', () => {
    const plugins = [testPlugin, withProviderPlugin];

    const providers = extractPluginProviders(plugins);

    expect(providers).toHaveLength(1);

    expect(providers[0]).toBe(withProviderPlugin.provider);
  });
});

describe('composeProviders function', () => {
  it('should compose multiple providers into a single provider', () => {
    const ProviderA: React.FC<React.PropsWithChildren> = ({ children }) => (
      <div className="provider-a">{children}</div>
    );
    const ProviderB: React.FC<React.PropsWithChildren> = ({ children }) => (
      <div className="provider-b">{children}</div>
    );

    const ComposedProvider = composeProviders([ProviderA, ProviderB]);

    const TestComponent: React.FC = () => (
      <div className="test-component">Test</div>
    );

    const WrappedComponent: React.FC = () => (
      <ComposedProvider>
        <TestComponent />
      </ComposedProvider>
    );

    const { container } = render(<WrappedComponent />);

    expect(container.querySelector('.provider-a')).toBeInTheDocument();
    expect(container.querySelector('.provider-b')).toBeInTheDocument();
    expect(container.querySelector('.test-component')).toBeInTheDocument();
  });
});
