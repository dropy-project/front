import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, StatusBar, Platform, TouchableOpacity } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Styles, { Colors } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';

import API from '../services/API';
import Sonar from '../components/Sonar';
import Haptics from '../utils/haptics';
import useOverlay from '../hooks/useOverlay';
import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';
import ProfileAvatar from '../components/ProfileAvatar';

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
      console.error('Dropy pressed error', error);
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
      <TouchableOpacity style={{ position: 'absolute', top: '2%', left: '2%' }} onPress={() => navigation.navigate('ProfilePage')}>
        <ProfileAvatar
          size={70}
          onPress={() => navigation.navigate('Profile')}
          showQuestionMark={false}
          showStatusDot={false}
        />
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
  },
});
