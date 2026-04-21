import type { LoadablePlugins } from '../plugin-system';

function isDefined<T>(value?: T): value is T {
  return value != null;
}

export function extractPluginProviders(
  plugins: LoadablePlugins,
): React.FC<React.PropsWithChildren>[] {
  return plugins.map(plugin => plugin.provider).filter(isDefined);
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
