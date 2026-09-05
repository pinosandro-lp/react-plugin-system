import type { LoadablePlugin } from '../plugin-system';

function isDefined<T>(value?: T): value is T {
  return value != null;
}

export function extractPluginProviders<const P extends readonly unknown[]>(
  plugins: readonly [
    ...{
      [K in keyof P]: LoadablePlugin<P[K]>;
    },
  ],
): React.FC<React.PropsWithChildren>[] {
  return plugins
    .map(lp => {
      if (typeof lp === 'object' && lp != null && 'provider' in lp) {
        return (lp as { provider: React.FC<React.PropsWithChildren> }).provider;
      }
      if (typeof lp === 'object' && lp != null && 'plugin' in lp) {
        return (
          lp as { plugin: { provider: React.FC<React.PropsWithChildren> } }
        ).plugin?.provider;
      }
    })
    .filter(isDefined);
}

export function composeProviders(
  contexts: React.FC<React.PropsWithChildren>[],
): React.FC<React.PropsWithChildren> {
  return contexts.reduce(
    (AccumulatedContext, CurrentContext) => {
      return ({ children }: React.PropsWithChildren) => (
        <AccumulatedContext>
          <CurrentContext>{children}</CurrentContext>
        </AccumulatedContext>
      );
    },
    ({ children }: React.PropsWithChildren) => <>{children}</>,
  );
}
