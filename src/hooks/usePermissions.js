import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { check, PERMISSIONS, request } from 'react-native-permissions';

const usePermissions = () => {

  const [permissions, setPermissions] = useState({
    geolocationForegroundState: null,
    geolocationBackgroundState: null,
    cameraState: null,
    microphoneState: null,
    notificationState: null,
  });

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = async () => {
    if(Platform.OS === 'ios') {
      setPermissions({
        geolocationForegroundState: await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE),
        cameraState: await check(PERMISSIONS.IOS.CAMERA),
        audioEnabled: await check(PERMISSIONS.IOS.MICROPHONE),
      });
    } else {
      setPermissions({
        geolocationForegroundState: await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
        cameraState: await check(PERMISSIONS.ANDROID.CAMERA),
        microphoneState: await check(PERMISSIONS.ANDROID.RECORD_AUDIO),
      });
    }
  };

  const requestForegroundGeolocation = async () => {

    let result = null;
    if(Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    setPermissions(oldPerms => ({
      ...oldPerms,
      geolocationForegroundState: result,
    }));

    if(result === 'blocked') {
      Alert.alert('Dropy needs location sevices to be enabled.', '', [
        { text: 'Open Settings', onPress: () => Linking.openSettings() }
      ]);
    }

    return result;
  };

  return {
    ...permissions,
    requestForegroundGeolocation,
  };
};

export default usePermissions;
