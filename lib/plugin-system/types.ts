import type { Plugin } from './plugin';

export type PluginApiStoreKey = keyof PluginApiStore;

export type PluginOptions = Record<string, unknown>;

export type PluginDeps = Record<string, PluginApiStoreKey>;

export type PluginDepsMap<D extends PluginDeps> = {
  [K in keyof D]: PluginApiStore[D[K]];
};

export interface PluginApiStore {}

export type PluginOptionsOf<P> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  P extends Plugin<infer _Id, infer _Deps, infer Options> ? Options : never;

export type LoadablePlugin<P> =
  | P
  | {
      plugin: P;
      options?: PluginOptionsOf<P>;
    };

export type PluginReference<Id extends PluginApiStoreKey> = {
  readonly id: Id;
  readonly dependencies: PluginApiStoreKey[];
  readonly api: Readonly<PluginApiStore[Id]>;
  readonly provider: React.FC<React.PropsWithChildren> | undefined;
};
