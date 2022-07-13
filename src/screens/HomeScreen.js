import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';

import Styles, { Colors } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import ProfileAvatar from '../components/ProfileAvatar';
import DropyMap from '../components/DropyMap';

import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);
  const { dropiesAround, createDropy, retreiveDropy } = useDropiesAroundSocket();

  useEffect(() => {
    if(dropyCreateParams != null) {
      setConfirmDropOverlayVisible(true);
    }
  }, []);

  const closeConfirmDropOverlay = () => {
    setConfirmDropOverlayVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <DropyMap dropiesAround={dropiesAround} retreiveDropy={retreiveDropy} />
      <SafeAreaView style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <ProfileAvatar
            size={70}
            onPress={() => navigation.navigate('Profile')}
          />
        </TouchableOpacity>
      </SafeAreaView>
      <HomeScreenTabBar />
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
  avatarContainer: {
    ...Styles.safeAreaView,
    position: 'absolute',
    top: 0,
    width: '90%',
  },
});
