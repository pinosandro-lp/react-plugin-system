import React from 'react';
import { usePluginApi } from '../../../../../lib';
import { USERS_PLUGIN_ID } from '../../plugin';

export function UserInfo() {
  const userApi = usePluginApi(USERS_PLUGIN_ID);

  const [user, setUser] = React.useState<{ id: string; name: string } | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    userApi.getUser('1').then(user => {
      setUser(user);
      setLoading(false);
    });
  }, [userApi]);

  return (
    <div>
      {loading ? (
        'Loading...'
      ) : (
        <>
          <div>ID: {user?.id}</div>
          <div>Name: {user?.name}</div>
        </>
      )}
    </div>
  );
}
