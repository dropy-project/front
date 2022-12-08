import { Linking } from 'react-native';

export const missingLibraryPermissionAlert = async (sendAlertFct) => {
  const alertResult = await sendAlertFct({
    title: 'Il faut autoriser l\'accès à la galerie !',
    description: 'On ne peut pas accéder à ta galerie sans ton autorisation.',
    validateText: 'Ouvrir les paramètres',
    denyText: 'bof...',
  });
  if (alertResult)
    Linking.openSettings();
  return alertResult;
};

export const missingCameraPersmissionAlert = async (sendAlertFct) => {
  const alertResult = await sendAlertFct({
    title: 'Il faut autoriser l\'accès à la caméra !',
    description: 'On ne peut pas accéder à ta caméra sans ton autorisation.',
    validateText: 'Ouvrir les paramètres',
    denyText: 'bof...',
  });
  if (alertResult)
    Linking.openSettings();
  return alertResult;
};
