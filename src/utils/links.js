import { Linking } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

export const handleOpenURL = async (url) => {
  if (await InAppBrowser.isAvailable()) {
    await InAppBrowser.open(url, {
      // iOS Properties
      dismissButtonStyle: 'cancel',
      preferredBarTintColor: '#B7C1F7',
      preferredControlTintColor: 'white',
      readerMode: false,
      animated: true,
      modalPresentationStyle: 'pageSheet',
      modalTransitionStyle: 'coverVertical',
      modalEnabled: true,
      enableBarCollapsing: false,
      showTitle: true,
      toolbarColor: '#B7C1F7',
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: false,
      animations: {
        startEnter: 'slide_in_right',
        startExit: 'slide_out_left',
        endEnter: 'slide_in_left',
        endExit: 'slide_out_right',
      },
    });
  } else
    Linking.openURL(url);
};
