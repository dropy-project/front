import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Styles, { Colors, Fonts } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';

import API from '../services/API';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import Sonar from '../components/Sonar';
import Haptics from '../utils/haptics';
import useOverlay from '../hooks/useOverlay';
import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const mapRef = useRef(null);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);

  const { userCoordinates } = useGeolocation();
  const { sendBottomAlert } = useOverlay();

  const { dropiesAround, createDropy, retreiveDropy } = useDropiesAroundSocket();

  useMapViewSyncronizer(mapRef);

  useEffect(() => {
    if(dropyCreateParams != null) {
      setConfirmDropOverlayVisible(true);
    }
  }, []);

  const closeConfirmDropOverlay = () => {
    setConfirmDropOverlayVisible(false);
  };

  const handleDropyPressed = async (dropy) => {
    Haptics.impactHeavy();
    try {
      if(dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

      const response = await retreiveDropy(dropy.id);
      if(response.error != null) {
        throw response.error;
      }

      const result = await API.getDropy(dropy.id);
      navigation.navigate('GetDropy', { dropy: result.data });

    } catch (error) {
      console.error(error);
      sendBottomAlert({
        title: 'Oh no!',
        description: 'Looks like there has been an issue while collecting this drop...\nCheck your internet connection',
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === 'ios' ? mapStyleIOS : mapStyleAndroid}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => handleDropyPressed(dropy)} />
        ))}
      </MapView>
      <Sonar />
      <HomeScreenTabBar />
      <ToggleBackgroundGeolocation />
      <ConfirmDropyOverlay
        createDropy={createDropy}
        dropyCreateParams={dropyCreateParams}
        visible={confirmDropOverlayVisible}
        onCloseOverlay={closeConfirmDropOverlay}
      />
    </View>
  );
};

export default HomeScreen;

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
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
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
});
