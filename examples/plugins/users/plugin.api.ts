export interface UsersPluginApi {
  getUser(id: string): Promise<{ id: string; name: string }>;
}
