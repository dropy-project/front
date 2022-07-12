import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoBackHeader from '../components/GoBackHeader';
import AppInfo from '../../app.json';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import useOverlay from '../hooks/useOverlay';


const ProfileScreen = () => {

  return (
    <View style={styles.container}>
      <GoBackHeader/>
      <View style={styles.wrapper}>
        <ToggleBackgroundGeolocation />
        <Text style={styles.version}>
        Current version is {AppInfo.version}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;


// TEMPORARY
const ToggleBackgroundGeolocation = () => {
  const { backgroundGeolocationEnabled, setBackgroundGeolocationEnabled, showLogs } = useContext(BackgroundGeolocationContext);

  const { sendAlert } = useOverlay();

  const toggle = async () => {
    if (backgroundGeolocationEnabled) {
      const result = await sendAlert({
        title: 'Turn off background location',
        description: 'The app will not be able to tell you if there are drops around you.',
        denyText: 'keep enabled',
        validateText: 'TURN OFF',
      });
      if(!result) return;
      setBackgroundGeolocationEnabled(false);
    } else {
      const result = await sendAlert({
        title: 'Turn on background location',
        description: 'The app will send you notifications when you are near a drop, even if you are not using the app.',
        denyText: 'cancel',
        validateText: 'TURN ON',
      });
      if(!result) return;
      setBackgroundGeolocationEnabled(true);
    }
  };

  return (
    <>
      <TouchableOpacity style={{ position: 'absolute', top: '10%' }} onPress={toggle}>
        <View style={styles.toggleBackgroundGeolocButton}>
          <Text style={styles.toggleBackgroundGeolocButtonText}>
            {backgroundGeolocationEnabled ? 'Disable background geolocation' : 'Enable background geolocation'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{ position: 'absolute', top: '15%' }} onPress={showLogs}>
        <View style={styles.toggleBackgroundGeolocButton}>
          <Text style={styles.toggleBackgroundGeolocButtonText}>
            Show logs
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  toggleBackgroundGeolocButton: {
    opacity: 0.8,
    alignItems: 'center',
    backgroundColor: Colors.mainBlue,
    ...Styles.hardShadows,
    ...Styles.center,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  toggleBackgroundGeolocButtonText: {
    ...Fonts.bold(12, Colors.white),
    textAlign: 'center',
  },
  version: {
    ...Fonts.bold(12, Colors.darkGrey),
  },
  wrapper: {
    height: '100%',
    width: '100%',
    ...Styles.center,
  },
});
