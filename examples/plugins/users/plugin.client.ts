import type { UsersPluginDeps } from "./plugin";
import type { UsersPluginApi } from "./plugin.api";

export function createApiClient({
  fetcherApi,
}: UsersPluginDeps): UsersPluginApi {
  return {
    getUser: async (id: string) => {
      const response = await fetcherApi.get(
        `https://jsonplaceholder.typicode.com/users/${id}`,
      );

      return JSON.parse(response);
    },
  };
}
