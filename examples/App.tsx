import React from 'react';
import { usePluginApi } from '../lib';
import { UserInfo } from './plugins/users';
import { FETCHER_PLUGIN_ID } from './plugins';
import { FEEDBACK_PLUGIN_ID, useFeedbackContext } from './plugins/feedback';

export function App() {
  const fetcherApi = usePluginApi(FETCHER_PLUGIN_ID);
  const feedbackApi = usePluginApi(FEEDBACK_PLUGIN_ID);

  const { showAlert } = useFeedbackContext();
  // Alternatively, you can expose the useFeedbackContext directly in the plugin API and use it like this:
  // const { showAlert } = feedbackApi.useContext();

  const severity = feedbackApi.severity;

  React.useEffect(() => {
    fetcherApi
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .then(data => {
        console.log('Data:', data);
      });
  }, [fetcherApi]);

  return (
    <>
      <UserInfo />
      <button
        onClick={() => showAlert('This is an info alert!', severity.INFO)}
      >
        Show Info
      </button>
    </>
  );
}
