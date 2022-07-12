/**
 * @format
 */

import { AppRegistry } from 'react-native';
import * as Sentry from '@sentry/react-native';
import App from './App';
import { name as appName } from './app.json';

Sentry.init({
  dsn: 'https://19407e7c32a2487689649a399a55c564@o1315355.ingest.sentry.io/6567185',
  // eslint-disable-next-line no-undef
  environment: __DEV__ ? 'dev' : 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

AppRegistry.registerComponent(appName, () => App);
