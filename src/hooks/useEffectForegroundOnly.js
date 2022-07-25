import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * Same as useEffect but has not effect when app is in background
 *
 * If the depencies changes while being in background, the effect will be executed after the app is in foreground again
 *
 * @param {*} effect Imperative function that can return a cleanup function
 * @param {*} deps If present, effect will only activate if the values in the list change.
 */
const useEffectForegroundOnly = (effect, deps) => {
  const appState = useRef(AppState.currentState);
  const needRefresh = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;

      if(nextAppState === 'active' && needRefresh.current) {
        effect();
        needRefresh.current = false;
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (appState.current === 'active') {
      effect();
      needRefresh.current = false;
    } else {
      needRefresh.current = true;
    }
  }, deps);

};

export default useEffectForegroundOnly;
