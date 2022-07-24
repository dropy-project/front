/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName, productionMode } from './app.json';

// eslint-disable-next-line no-undef
if(__DEV__ && productionMode) {
  console.warn('You using production mode in development, this may impact production servers');
}

AppRegistry.registerComponent(appName, () => App);
