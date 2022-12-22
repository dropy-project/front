import { useEffect } from 'react';
import { AppState } from 'react-native';

const useOnAppFocused = (callback) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', () => {
      if (AppState.currentState === 'active')
        callback();
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);
};

export default useOnAppFocused;
