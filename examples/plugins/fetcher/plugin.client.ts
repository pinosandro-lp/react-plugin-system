import type { FetcherPluginDeps } from "./plugin";
import type { FetcherPluginApi } from "./plugin.api";

export function createApiClient(_: FetcherPluginDeps): FetcherPluginApi {
  return {
    get: async (url: string) => {
      const response = await fetch(url);
      return response.text();
    },
    post: async (url: string, body: unknown) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.text();
    },
    put: async (url: string, body: unknown) => {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.text();
    },
    delete: async (url: string) => {
      const response = await fetch(url, {
        method: "DELETE",
      });
      return response.text();
    },
  };
}
