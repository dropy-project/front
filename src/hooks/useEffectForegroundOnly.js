import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import useOnAppFocused from './useOnAppFocused';

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
  const refreshRequired = useRef(false);
  const effectReturnRef = useRef(null);

  useOnAppFocused(() => {
    if (refreshRequired.current === true) {
      refreshRequired.current = false;
      effectReturnRef.current = effect();
    }
  }, [effect, ...deps]);

  useEffect(() => {
    refreshRequired.current = false;
    if (AppState.currentState === 'active')
      return effect();
    refreshRequired.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // return the future cleanup function (It will be define when the app go back to foreground)
    return () => effectReturnRef.current;
  }, deps);
};

export default useEffectForegroundOnly;
