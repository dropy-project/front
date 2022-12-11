/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName, productionMode } from './app.json';

if (__DEV__ && productionMode)
  console.error('WATCH OUT YOU PROBABLY DONT WANT THAT : You are using production mode in development, this may impact production servers');


AppRegistry.registerComponent(appName, () => App);
