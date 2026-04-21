export interface FetcherPluginApi {
  get(url: string): Promise<string>;
  post(url: string, body: unknown): Promise<string>;
  put(url: string, body: unknown): Promise<string>;
  delete(url: string): Promise<string>;
}
