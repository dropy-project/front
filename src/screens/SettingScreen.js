import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoBackHeader from '../components/GoBackHeader';
import AppInfo from '../../app.json';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import useOverlay from '../hooks/useOverlay';
import useGeolocation from '../hooks/useGeolocation';

const SettingsScreen = () => {

  const { userCoordinates, compassHeading } = useGeolocation();
  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader text="Settings" />
      <View style={styles.wrapper}>
        <ToggleBackgroundGeolocation />
        <Text style={styles.text}>
        Current version is {AppInfo.version}
        </Text>
        <Text style={styles.text}>
          {/* eslint-disable-next-line no-undef */}
        Current server : {AppInfo.productionMode ? 'prod' : 'preprod'}
        </Text>
        <Text style={{ ...styles.text, marginTop: 20 }}>
          latitude: {userCoordinates.latitude}
        </Text>
        <Text style={{ ...styles.text }}>
          longitude: {userCoordinates.longitude}
        </Text>
        <Text style={{ ...styles.text }}>
          heading: {compassHeading}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;


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
      <TouchableOpacity onPress={toggle}>
        <View style={styles.toggleBackgroundGeolocButton}>
          <Text style={styles.toggleBackgroundGeolocButtonText}>
            {backgroundGeolocationEnabled ? 'Disable background geolocation' : 'Enable background geolocation'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={{ marginVertical: 20 }} onPress={showLogs}>
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
    ...Styles.safeAreaView,
  },
  toggleBackgroundGeolocButton: {
    opacity: 0.8,
    alignItems: 'center',
    backgroundColor: Colors.mainBlue,
    ...Styles.center,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  toggleBackgroundGeolocButtonText: {
    ...Fonts.bold(12, Colors.white),
    textAlign: 'center',
  },
  text: {
    ...Fonts.bold(12, Colors.darkGrey),
  },
  wrapper: {
    height: '100%',
    width: '100%',
    ...Styles.center,
  },
});
