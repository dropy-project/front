import { useEffect } from 'react';
import { AppState } from 'react-native';

/**
 * Trigger the given callback when the regain focus
 * @param {function} callback the callback to trigger
 * @param {array} deps reload the subscribed callback method when the dependencies change
 * @returns {void}
*/
const useOnAppFocused = (callback = () => {}, deps = []) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState === 'active')
        callback();
    });

    return () => {
      subscription.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, ...deps]);
};

export default useOnAppFocused;
